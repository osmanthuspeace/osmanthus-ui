# Osmanthus-UI
## A drag & drop & sort component library for React with better animation

### Introduction
This drag-and-drop sorting component library simulates an iOS-style desktop layout, supporting component dragging and sorting functions. It provides a flexible drag-and-drop interface, aiming to offer a simple and intuitive API while maintaining high performance and smooth animations.

### Features
- Drag-and-Drop Sorting : Components can be dragged and reordered within the layout, supporting cross-container interactions.
- Simple and Intuitive : Zero-configuration setup with default parameters for easy start.
- Customizable Layout : Flexible container and component styling to match the look and feel of your project.
- Responsive Design : Dynamically calculates grid layout based on the parent element's size.

### Installation
```bash
npm install osmanthus-ui
```
### Usage
Here's a complete example with two drag-and-drop containers (supporting cross-container dragging):
```tsx
import { useState } from "react";
import { SortableProvider, SortableContainer, SortableItem } from "osmanthus-ui";
import type { SortableItems, CrossMap, CrossInfo } from "osmanthus-ui";

function App() {
  // 管理当前显示的组件列表
  const [sortableItems, setSortableItems] = useState<SortableItems>([
    { id: "1", children: "组件1" },
    { id: "2", children: "组件2" },
  ]);

  // 管理存储区的组件列表
  const [storedItems, setStoredItems] = useState<SortableItems>([
    { id: "store-1", children: "存储项1" },
    { id: "store-2", children: "存储项2" },
  ]);

  // 跨容器映射配置（key为容器ID，value为[状态, 状态更新函数]）
  const crossMap: CrossMap = {
    "main-container": [sortableItems, setSortableItems],
    "storage-container": [storedItems, setStoredItems],
  };

  // 处理同容器内排序变化
  const handleOrderChange = (newOrderIds: string[], containerId: string) => {
    const [items, setItems] = crossMap[containerId];
    const newItems = newOrderIds.map(id => items.find(item => item.id === id)!);
    setItems(newItems);
  };

  // 处理跨容器拖拽
  const handleCrossContainer = (source: CrossInfo, target: CrossInfo) => {
    const [sourceItems, setSourceItems] = crossMap[source.containerId];
    const [targetItems, setTargetItems] = crossMap[target.containerId];

    const [movedItem] = sourceItems.splice(source.index, 1);
    targetItems.splice(target.index, 0, movedItem);
    setSourceItems([...sourceItems]);
    setTargetItems([...targetItems]);
  };

  return (
    <SortableProvider onCross={handleCrossContainer}>
      {/* 主容器 */}
      <SortableContainer
        id="main-container"
        className="main-container"
        onOrderChange={(ids) => handleOrderChange(ids, "main-container")}
        unitSize={100}  {/* 单个组件尺寸（px） */}
        gridTemplateColumns={4}  {/* 网格列数 */}
        height={600}  {/* 容器高度 */}
      >
        {sortableItems.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.children}
          </SortableItem>
        ))}
      </SortableContainer>

      {/* 存储容器 */}
      <SortableContainer
        id="storage-container"
        className="storage-container"
        onOrderChange={(ids) => handleOrderChange(ids, "storage-container")}
        unitSize={100}
        gridTemplateColumns={3}
        height={300}
      >
        {storedItems.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.children}
          </SortableItem>
        ))}
      </SortableContainer>
    </SortableProvider>
  );
}

export default App;
```

## 仿ios桌面布局组件库

### 简介

这个拖拽排序组件库模拟了 ios 风格的桌面布局，支持组件的拖动和排序功能。它提供了一个灵活的拖拽界面，旨在提供简洁、直观的 API 的同时保持高性能和丝滑的动画。

### 特性

- **拖动排序**：组件可以在布局中拖动并重新排序，支持跨容器的交互。
- **简洁直观**：使用默认参数可以零配置轻松上手。
- **可定制布局**：灵活的容器和组件样式，以匹配您项目的外观和感觉。
- **响应式设计**：根据父元素的尺寸动态计算网格布局。

### 安装
```bash
npm install osmanthus-ui
```
### 使用
以下是一个包含两个拖拽容器（支持跨容器拖拽）的完整示例：
```tsx
import { useState } from "react";
import { SortableProvider, SortableContainer, SortableItem } from "osmanthus-ui";
import type { SortableItems, CrossMap, CrossInfo } from "osmanthus-ui";

function App() {
  // 管理当前显示的组件列表
  const [sortableItems, setSortableItems] = useState<SortableItems>([
    { id: "1", children: "组件1" },
    { id: "2", children: "组件2" },
  ]);

  // 管理存储区的组件列表
  const [storedItems, setStoredItems] = useState<SortableItems>([
    { id: "store-1", children: "存储项1" },
    { id: "store-2", children: "存储项2" },
  ]);

  // 跨容器映射配置（key为容器ID，value为[状态, 状态更新函数]）
  const crossMap: CrossMap = {
    "main-container": [sortableItems, setSortableItems],
    "storage-container": [storedItems, setStoredItems],
  };

  // 处理同容器内排序变化
  const handleOrderChange = (newOrderIds: string[], containerId: string) => {
    const [items, setItems] = crossMap[containerId];
    const newItems = newOrderIds.map(id => items.find(item => item.id === id)!);
    setItems(newItems);
  };

  // 处理跨容器拖拽
  const handleCrossContainer = (source: CrossInfo, target: CrossInfo) => {
    const [sourceItems, setSourceItems] = crossMap[source.containerId];
    const [targetItems, setTargetItems] = crossMap[target.containerId];

    const [movedItem] = sourceItems.splice(source.index, 1);
    targetItems.splice(target.index, 0, movedItem);
    setSourceItems([...sourceItems]);
    setTargetItems([...targetItems]);
  };

  return (
    <SortableProvider onCross={handleCrossContainer}>
      {/* 主容器 */}
      <SortableContainer
        id="main-container"
        className="main-container"
        onOrderChange={(ids) => handleOrderChange(ids, "main-container")}
        unitSize={100}  {/* 单个组件尺寸（px） */}
        gridTemplateColumns={4}  {/* 网格列数 */}
        height={600}  {/* 容器高度 */}
      >
        {sortableItems.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.children}
          </SortableItem>
        ))}
      </SortableContainer>

      {/* 存储容器 */}
      <SortableContainer
        id="storage-container"
        className="storage-container"
        onOrderChange={(ids) => handleOrderChange(ids, "storage-container")}
        unitSize={100}
        gridTemplateColumns={3}
        height={300}
      >
        {storedItems.map(item => (
          <SortableItem key={item.id} id={item.id}>
            {item.children}
          </SortableItem>
        ))}
      </SortableContainer>
    </SortableProvider>
  );
}

export default App;
```
核心组件说明
1. SortableProvider 根级上下文提供者，用于管理全局拖拽状态（只有一个SortableContainer时也需要有）。
   
   - onCross : 跨容器拖拽回调（参数为 {source: CrossInfo, target: CrossInfo} ）
2. SortableContainer 拖拽容器组件，定义可拖拽区域的布局规则。
   
   - id : 容器唯一标识（必传）
   - onOrderChange : 容器内排序变化回调（参数为新顺序的id数组）
   - unitSize : 单个组件的尺寸（px，必传）
   - gridTemplateColumns : 网格布局列数（必传）
   - height : 容器高度（必传）
   - enableDnd : 是否启用拖拽（默认 true ）
3. SortableItem 可拖拽的子组件。
   
   - id : 组件唯一标识（必传）
   - children : 组件内容（必传）
   - enableFlip : 是否启用翻转效果（可选，需配合 flipBack 属性）
   - flipBack : 翻转后的内容（当 enableFlip 为 true 时必传）