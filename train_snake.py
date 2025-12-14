import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import gymnasium as gym
from gymnasium import spaces
import random
from collections import deque
import os
import shutil
import tensorflowjs as tfjs

# ... SnakeEnv 클래스는 이전과 동일하므로 생략 가능하나, 전체 복사 붙여넣기를 위해 유지 ...
class SnakeEnv(gym.Env):
    def __init__(self):
        super(SnakeEnv, self).__init__()
        self.grid_size = 8
        self.action_space = spaces.Discrete(3) 
        self.observation_space = spaces.Box(low=0, high=1, shape=(11,), dtype=np.float32)
        self.reset()

    def reset(self, seed=None, options=None):
        self.direction = 1 
        self.snake = [(self.grid_size//2, self.grid_size//2)]
        self.food = self._place_food()
        self.step_count = 0
        self.score = 0
        return self._get_state(), {}

    def _place_food(self):
        while True:
            food = (np.random.randint(0, self.grid_size), np.random.randint(0, self.grid_size))
            if food not in self.snake:
                return food

    def _is_collision(self, pt):
        if pt[0] < 0 or pt[0] >= self.grid_size or pt[1] < 0 or pt[1] >= self.grid_size:
            return True
        if pt in self.snake[1:]:
            return True
        return False

    def _get_state(self):
        head = self.snake[0]
        point_l = (head[0] - 1, head[1])
        point_r = (head[0] + 1, head[1])
        point_u = (head[0], head[1] - 1)
        point_d = (head[0], head[1] + 1)
        
        dir_l = self.direction == 0
        dir_r = self.direction == 1
        dir_u = self.direction == 2
        dir_d = self.direction == 3

        state = [
            (dir_r and self._is_collision(point_r)) or 
            (dir_l and self._is_collision(point_l)) or 
            (dir_u and self._is_collision(point_u)) or 
            (dir_d and self._is_collision(point_d)),

            (dir_u and self._is_collision(point_r)) or 
            (dir_d and self._is_collision(point_l)) or 
            (dir_l and self._is_collision(point_u)) or 
            (dir_r and self._is_collision(point_d)),

            (dir_d and self._is_collision(point_r)) or 
            (dir_u and self._is_collision(point_l)) or 
            (dir_r and self._is_collision(point_u)) or 
            (dir_l and self._is_collision(point_d)),
            
            dir_l, dir_r, dir_u, dir_d,
            self.food[0] < head[0], self.food[0] > head[0], 
            self.food[1] < head[1], self.food[1] > head[1]  
        ]
        return np.array(state, dtype=np.float32)

    def step(self, action):
        clock_wise = [0, 2, 1, 3] 
        idx = clock_wise.index(self.direction)
        if action == 0: new_dir = clock_wise[idx] 
        elif action == 1: new_dir = clock_wise[(idx + 1) % 4] 
        else: new_dir = clock_wise[(idx - 1) % 4] 
            
        self.direction = new_dir
        x, y = self.snake[0]
        if self.direction == 0: x -= 1
        elif self.direction == 1: x += 1
        elif self.direction == 2: y -= 1
        elif self.direction == 3: y += 1
        new_head = (x, y)
        self.step_count += 1
        
        if self._is_collision(new_head) or self.step_count > 100 * len(self.snake):
            return self._get_state(), -10, True, False, {}
            
        self.snake.insert(0, new_head)
        if new_head == self.food:
            self.score += 1
            reward = 10
            self.food = self._place_food()
            self.step_count = 0
        else:
            self.snake.pop()
            reward = 0 
        return self._get_state(), reward, False, False, {}

class DQNAgent:
    def __init__(self, state_shape, action_size):
        self.state_shape = state_shape
        self.action_size = action_size
        self.memory = deque(maxlen=100_000)
        self.gamma = 0.99
        self.epsilon = 1.0
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001
        self.model = self._build_model()
        self.target_model = self._build_model()
        self.update_target_model()

    def _build_model(self):
        # [수정됨] keras.Input 대신 layers.InputLayer를 사용하여 명시적으로 input_shape 지정
        # 이는 TensorFlow.js 변환 시 호환성을 높여줍니다.
        model = keras.Sequential([
            layers.InputLayer(input_shape=self.state_shape), 
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(256, activation='relu'),
            layers.Dense(self.action_size, activation='linear')
        ])
        model.compile(loss='mse', optimizer=keras.optimizers.Adam(learning_rate=self.learning_rate))
        return model

    def update_target_model(self):
        self.target_model.set_weights(self.model.get_weights())

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return np.random.randint(self.action_size)
        state_tensor = tf.convert_to_tensor(state)
        state_tensor = tf.expand_dims(state_tensor, 0)
        act_values = self.model(state_tensor)
        return np.argmax(act_values[0])

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def replay(self, batch_size):
        if len(self.memory) < batch_size: return
        minibatch = random.sample(self.memory, batch_size)
        states = np.array([i[0] for i in minibatch])
        actions = np.array([i[1] for i in minibatch])
        rewards = np.array([i[2] for i in minibatch])
        next_states = np.array([i[3] for i in minibatch])
        dones = np.array([i[4] for i in minibatch])
        
        targets = self.model.predict_on_batch(states)
        next_qs = self.target_model.predict_on_batch(next_states)
        max_next_qs = np.amax(next_qs, axis=1)
        
        for i in range(batch_size):
            target = rewards[i]
            if not dones[i]: target += self.gamma * max_next_qs[i]
            targets[i][actions[i]] = target
        self.model.train_on_batch(states, targets)

    def decay_epsilon(self):
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

if __name__ == "__main__":
    env = SnakeEnv()
    state_shape = (11,)
    action_size = 3 
    agent = DQNAgent(state_shape, action_size)

    batch_size = 64
    episodes = 1000
    
    print("Starting Training with FIXED Model Structure...")

    for e in range(episodes):
        state, _ = env.reset()
        done = False
        total_reward = 0
        while not done:
            action = agent.act(state)
            next_state, reward, done, _, _ = env.step(action)
            agent.remember(state, action, reward, next_state, done)
            state = next_state
            total_reward += reward
            agent.replay(batch_size)
        agent.update_target_model()
        agent.decay_epsilon()
        if e % 10 == 0:
            print(f"Episode: {e}/{episodes}, Score: {env.score}, Epsilon: {agent.epsilon:.2f}, Reward: {total_reward}")

    output_dir = "public/models/snake-rl"
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    
    saved_model_path = "temp_saved_model"
    if os.path.exists(saved_model_path):
        shutil.rmtree(saved_model_path)
        
    print("Saving as Native SavedModel...")
    tf.saved_model.save(agent.model, saved_model_path)
    
    print("Exporting to TensorFlow.js Graph Model...")
    tfjs.converters.convert_tf_saved_model(saved_model_path, output_dir)
    
    # 임시 폴더 삭제
    if os.path.exists(saved_model_path):
        shutil.rmtree(saved_model_path)
        
    print(f"Model saved to {output_dir}")