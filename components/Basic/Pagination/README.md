# Pagination Component

基于 `rc-pagination` 封装的分页组件，样式已优化以适配当前项目设计风格。

## 功能特性

- ✅ 支持自定义每页显示条数
- ✅ 显示总数和当前范围
- ✅ 自定义前进/后退图标
- ✅ 响应式设计，适配移动端
- ✅ 主题支持（使用 styled-components theme）
- ✅ 自动隐藏（当总数为 0 时）
- ✅ 支持 default 和 small 两种尺寸

## 使用方法

### 基础用法

```tsx
import Pagination from "../../Basic/Pagination";

function YourComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(100);
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Pagination
      current={currentPage}
      total={total}
      pageSize={pageSize}
      onChange={handlePageChange}
      showTotal={true}
    />
  );
}
```

### 使用 Small 尺寸

```tsx
<Pagination
  current={currentPage}
  total={total}
  pageSize={pageSize}
  onChange={handlePageChange}
  showTotal={true}
  size="small"
/>
```

## Props

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| current | number | - | 当前页码（必填） |
| total | number | - | 数据总数（必填） |
| pageSize | number | 10 | 每页显示条数 |
| onChange | (page: number, pageSize: number) => void | - | 页码改变的回调函数（必填） |
| showTotal | boolean | true | 是否显示数据范围信息 |
| className | string | "" | 自定义类名 |
| size | "default" \| "small" | "default" | 分页器尺寸 |

## 样式定制

组件使用 styled-components，会自动读取 theme 配置：

- `theme.border` - 边框颜色
- `theme.bg2` / `theme.bg3` - 背景颜色
- `theme.text1` / `theme.text2` - 文字颜色
- `theme.primary` - 当前页高亮颜色
- `theme.inputBorder` - hover 边框颜色

## 尺寸对比

| 尺寸 | 按钮大小 | 字体大小 | 内边距 | 适用场景 |
|------|---------|---------|-------|---------|
| default | 36px × 36px | 14px | 24px 16px | 常规列表页面 |
| small | 28px × 28px | 12px | 16px 12px | 空间有限的区域、弹窗内等 |

## 注意事项

1. 当 `total` 为 0 时，组件不会渲染任何内容
2. 组件已内置响应式设计，在移动端会自动调整布局
3. 使用了 `rc-pagination/assets/index.css`，确保正确导入
4. `size="small"` 会同时缩小按钮、字体、间距等所有元素，保持视觉协调性

