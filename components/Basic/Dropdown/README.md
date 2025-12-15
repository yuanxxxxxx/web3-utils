# Dropdown 通用组件

## 概述

Dropdown 是一个通用的下拉菜单组件，支持自定义选项、样式和交互行为。

## 功能特性

- ✅ 支持单选下拉菜单
- ✅ 鼠标悬停展开/收起
- ✅ 自动关闭菜单
- ✅ 支持自定义样式
- ✅ 支持全宽模式
- ✅ 响应式设计
- ✅ 主题适配
- ✅ 平滑动画效果

## Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| value | string | 是 | - | 当前选中的值 |
| options | Array<{label: string, value: string}> | 是 | - | 选项列表 |
| onChange | (value: string) => void | 是 | - | 选择改变时的回调 |
| style | React.CSSProperties | 否 | - | 自定义样式 |
| onClick | () => void | 否 | - | 点击下拉按钮时的回调 |
| placeholder | string | 否 | 'Select' | 未选中时的占位文本 |
| fullWidth | boolean | 否 | false | 是否占满父容器宽度 |
| minimal | boolean | 否 | false | 最简模式：无背景色、无边框、宽度auto |

## 使用示例

### 基础用法

```tsx
import Dropdown from '@/components/Basic/Dropdown';

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "filled", label: "Filled" },
];

function MyComponent() {
  const [status, setStatus] = useState("all");

  return (
    <Dropdown
      value={status}
      options={statusOptions}
      onChange={(value) => setStatus(value)}
    />
  );
}
```

### 全宽模式

```tsx
<Dropdown
  value={orderType}
  options={orderTypes}
  onChange={setOrderType}
  fullWidth={true}
/>
```

### 自定义样式

```tsx
<Dropdown
  value={filter}
  options={filterOptions}
  onChange={setFilter}
  style={{ minWidth: '200px' }}
/>
```

### 带点击事件

```tsx
<Dropdown
  value={type}
  options={typeOptions}
  onChange={setType}
  onClick={() => console.log('Dropdown clicked')}
/>
```

### 最简模式（无背景、无边框、宽度auto）

```tsx
<Dropdown
  value={orderType}
  options={orderTypes}
  onChange={setOrderType}
  minimal={true}
/>
```

## 样式特点

### 按钮样式

**标准模式（minimal=false）：**
- 默认背景：`theme.inputBg`
- 悬停/聚焦：白色背景，显示边框
- 圆角：10px
- 内边距：10px 14px
- 最小宽度：160px

**最简模式（minimal=true）：**
- 背景：透明
- 边框：无
- 圆角：8px
- 内边距：8px 12px
- 宽度：auto（根据内容自适应）
- 字体加粗：600

### 菜单样式
- 白色背景
- 圆角：10px
- 边框：`theme.border`
- 阴影：`0 4px 12px rgba(0, 0, 0, 0.1)`
- 悬停动画：平滑展开/收起

### 菜单项样式
- 激活项：加粗字体，高亮背景
- 悬停：高亮背景
- 分隔线：底部边框（最后一项除外）

## 响应式设计

### 桌面端（>768px）
- 最小宽度：160px
- 自适应内容宽度

### 移动端（≤768px）
- 全宽模式：占满父容器宽度
- 普通模式：保持最小宽度

## 主题适配

组件使用 styled-components 的 theme 支持深色/浅色主题：

- `theme.inputBg` - 输入框背景色
- `theme.inputBorder` - 边框颜色
- `theme.text1` - 主要文本颜色
- `theme.text2` - 次要文本颜色
- `theme.hover1` - 悬停背景色
- `theme.border` - 边框颜色

## 使用场景

1. **状态筛选**：订单状态、用户状态等
2. **类型选择**：订单类型、交易方向等
3. **排序方式**：时间、金额、名称等
4. **分类筛选**：分类、标签等

## 已应用的组件

- ✅ `components/PortfolioPage/OpenOrders` - 订单状态筛选（标准模式）
- ✅ `components/EventPage/OrderPanel` - 订单类型选择（最简模式）
- ✅ `components/MarketPage` - 排序和状态筛选（标准模式）

## 注意事项

1. **选项格式**：options 必须是 `{ label: string, value: string }[]` 格式
2. **受控组件**：value 和 onChange 必须一起使用
3. **唯一 key**：选项的 value 必须唯一
4. **菜单定位**：组件使用相对定位，确保父容器有足够空间
5. **z-index**：菜单的 z-index 为 100，避免被其他元素遮挡

## 扩展建议

如需扩展功能，可以考虑：

1. 支持多选模式
2. 支持搜索过滤
3. 支持自定义渲染项
4. 支持分组选项
5. 支持禁用选项
6. 支持键盘导航

## 相关文件

- `components/Basic/Dropdown/index.tsx` - 组件主文件
- `components/Basic/Dropdown/style.ts` - 样式定义文件
- `components/Basic/Dropdown/README.md` - 使用文档

