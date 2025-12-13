# Redux 状态管理指南

## 📦 Store 架构

### Store 结构

```typescript
{
  app: {
    isDarkMode: boolean,
    language: 'zh' | 'en' | 'ja-JP'
  },
  user: {
    userInfo: UserInfo | null,
    isLoggedIn: boolean
  },
  counter: {
    value: number,
    history: number[]
  }
}
```

## 🗂️ Slice 说明

### 1. App Slice - 应用全局状态

**文件**: `store/appSlice.ts`

**状态**:
```typescript
interface AppState {
  isDarkMode: boolean    // 深色模式开关
  language: Language     // 界面语言
}
```

**Actions**:
```typescript
// 切换深色模式
dispatch(toggleDarkMode())

// 设置深色模式
dispatch(setDarkMode(true))

// 设置语言
dispatch(setLanguage('zh'))
```

**使用示例**:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { toggleDarkMode, setLanguage } from '@/store/appSlice'

function MyComponent() {
  const { isDarkMode, language } = useAppSelector((state) => state.app)
  const dispatch = useAppDispatch()

  return (
    <div>
      <button onClick={() => dispatch(toggleDarkMode())}>
        Toggle Theme
      </button>
      <select 
        value={language} 
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      >
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  )
}
```

### 2. User Slice - 用户信息状态

**文件**: `store/userSlice.ts`

**状态**:
```typescript
interface UserState {
  userInfo: UserInfo | null  // 用户信息
  isLoggedIn: boolean        // 登录状态
}

interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}
```

**Actions**:
```typescript
// 设置用户信息（登录）
dispatch(setUserInfo({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Admin'
}))

// 更新用户信息
dispatch(updateUserInfo({
  name: 'Jane Doe'
}))

// 退出登录
dispatch(logout())
```

**使用示例**:
```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setUserInfo, logout } from '@/store/userSlice'

function UserComponent() {
  const { userInfo, isLoggedIn } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const handleLogin = () => {
    dispatch(setUserInfo({
      id: '1',
      name: 'John',
      email: 'john@example.com'
    }))
  }

  if (!isLoggedIn) {
    return <button onClick={handleLogin}>Login</button>
  }

  return (
    <div>
      <h2>Welcome, {userInfo?.name}</h2>
      <button onClick={() => dispatch(logout())}>Logout</button>
    </div>
  )
}
```

### 3. Counter Slice - 计数器示例

**文件**: `store/counterSlice.ts`

**状态**:
```typescript
interface CounterState {
  value: number       // 当前值
  history: number[]   // 历史记录
}
```

**Actions**:
```typescript
// 增加
dispatch(increment())

// 减少
dispatch(decrement())

// 增加指定数量
dispatch(incrementByAmount(10))

// 重置
dispatch(reset())
```

## 🔧 自定义 Hooks

**文件**: `store/hooks.ts`

### useAppDispatch
类型安全的 dispatch hook

```typescript
const dispatch = useAppDispatch()
dispatch(increment()) // ✅ 完整类型提示
```

### useAppSelector
类型安全的 selector hook

```typescript
const count = useAppSelector((state) => state.counter.value)
// ✅ state 有完整类型提示
```

### useAppStore
类型安全的 store hook

```typescript
const store = useAppStore()
const state = store.getState()
```

## 📝 创建新的 Slice

### 1. 创建 Slice 文件

```typescript
// store/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Todo {
  id: string
  text: string
  completed: boolean
}

interface TodoState {
  todos: Todo[]
}

const initialState: TodoState = {
  todos: []
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: Date.now().toString(),
        text: action.payload,
        completed: false
      })
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
      }
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload)
    }
  }
})

export const { addTodo, toggleTodo, removeTodo } = todoSlice.actions
export default todoSlice.reducer
```

### 2. 注册到 Store

```typescript
// store/store.ts
import todoReducer from './todoSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      user: userReducer,
      counter: counterReducer,
      todo: todoReducer,  // 👈 添加新的 reducer
    },
  })
}
```

### 3. 在组件中使用

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addTodo, toggleTodo } from '@/store/todoSlice'

function TodoList() {
  const todos = useAppSelector((state) => state.todo.todos)
  const dispatch = useAppDispatch()

  return (
    <div>
      <button onClick={() => dispatch(addTodo('New Todo'))}>
        Add Todo
      </button>
      {todos.map(todo => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          />
          {todo.text}
        </div>
      ))}
    </div>
  )
}
```

## 🎯 最佳实践

### 1. 使用类型安全的 Hooks
```typescript
// ❌ 不推荐
import { useDispatch, useSelector } from 'react-redux'

// ✅ 推荐
import { useAppDispatch, useAppSelector } from '@/store/hooks'
```

### 2. State 设计原则
- **扁平化**: 避免深层嵌套
- **规范化**: 使用 ID 引用代替嵌套对象
- **最小化**: 只存储必要的状态
- **可序列化**: 避免存储函数、Promise 等

### 3. Action 命名规范
- 使用动词开头: `addTodo`, `updateUser`, `toggleDarkMode`
- 语义清晰: 从名称就能理解作用
- 保持一致: 同类操作使用相同前缀

### 4. Slice 组织原则
- **单一职责**: 每个 slice 管理独立的功能域
- **合理粒度**: 不要太大也不要太小
- **清晰边界**: slice 之间职责明确

### 5. 使用 Immer 语法
Redux Toolkit 内置 Immer，可以直接"修改" state：

```typescript
// ✅ Redux Toolkit 中可以这样写
reducers: {
  updateUser: (state, action) => {
    state.user.name = action.payload
  }
}

// 也可以返回新的 state
reducers: {
  updateUser: (state, action) => {
    return {
      ...state,
      user: { ...state.user, name: action.payload }
    }
  }
}
```

## 🔍 调试工具

### Redux DevTools

1. 安装浏览器扩展：[Redux DevTools](https://github.com/reduxjs/redux-devtools)

2. Redux Toolkit 自动集成，无需额外配置

3. 功能：
   - 查看 action 历史
   - 检查 state 变化
   - 时间旅行调试
   - 导出/导入 state

### 使用技巧

```typescript
// 在开发环境启用 action 日志
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    console.log('State updated:', store.getState())
  })
}
```

## ⚡ 性能优化

### 1. 使用 Selector 优化

```typescript
// ❌ 每次都计算
function Component() {
  const todos = useAppSelector(state => 
    state.todo.todos.filter(t => !t.completed)
  )
}

// ✅ 使用 reselect 缓存
import { createSelector } from '@reduxjs/toolkit'

const selectActiveTodos = createSelector(
  (state) => state.todo.todos,
  (todos) => todos.filter(t => !t.completed)
)

function Component() {
  const todos = useAppSelector(selectActiveTodos)
}
```

### 2. 避免不必要的渲染

```typescript
// ❌ 整个对象变化都会重新渲染
const user = useAppSelector(state => state.user)

// ✅ 只订阅需要的字段
const userName = useAppSelector(state => state.user.userInfo?.name)
const isLoggedIn = useAppSelector(state => state.user.isLoggedIn)
```

## 📚 参考资源

- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)
- [Redux 风格指南](https://redux.js.org/style-guide/)
- [React-Redux Hooks API](https://react-redux.js.org/api/hooks)

