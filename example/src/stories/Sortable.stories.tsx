import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SortableItems } from "../../../src/components/SortableItem/interface";
import { SortableProvider } from "../../../src/components/SortableProvider/SortableProvider";
import { SortableContainer } from "../../../src/components/SortableContainer/sortableContainer";
import { SortableItem } from "../../../src/components/SortableItem/sortableItem";
import { CrossInfo, CrossMap } from "../../../src/components/SortableProvider/interface";

// 基础元数据定义
const meta: Meta<{ children: React.ReactNode }> = {
  title: "Components/Sortable", // 故事分类路径
  component: SortableProvider, // 主组件
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicSort: Story = {
  render: () => {
    const [items, setItems] = useState<SortableItems>(
      Array.from({ length: 5 }, (_, i) => ({
        id: `item-${i}`,
        children: `Item ${i}`,
      }))
    );

    const handleOrderChange = (newOrderIds: string[]) => {
      const newItems = newOrderIds.map(
        (id) => items.find((item) => item.id === id)!
      );
      setItems(newItems);
    };

    return (
      <SortableProvider>
        <SortableContainer
          id="basic-container"
          onOrderChange={handleOrderChange}
          unitSize={100}
          height={400}
          gridTemplateColumns={3}
        >
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.children}
            </SortableItem>
          ))}
        </SortableContainer>
      </SortableProvider>
    );
  },
};

// 跨容器拖拽场景
export const CrossContainerSort: Story = {
  render: () => {
    const [isEditing, setIsActive] = useState(false);

  const [sortableItems, setSortableItems] = useState<SortableItems>(
    Array.from({ length: 100 }).map((_, index) => {
      return { id: `store2-${index}`, children: "test" + index };
    })
  );

  const [storedItems, setStoredItems] = useState<SortableItems>(
    Array.from({ length: 7 }).map((_, index) => {
      return { id: `store-${index}`, children: "test" + index };
    })
  );

  const crossMap: CrossMap = {
    "sort-container111": [storedItems, setStoredItems],
    "222": [sortableItems, setSortableItems],
  };

  const handleOrderChange = (newOrderIds: string[]) => {
    const orderedItems = newOrderIds.map(
      (id) => storedItems.find((item) => item.id === id)!
    );
    setStoredItems(orderedItems);
  };
  const handleOrderChange2 = (newOrderIds: string[]) => {
    const orderedItems = newOrderIds.map(
      (id) => sortableItems.find((item) => item.id === id)!
    );
    setSortableItems(orderedItems);
  };
  const handleCrossContainer = (source: CrossInfo, target: CrossInfo) => {
    const [sourceItems, setSourceItems] = crossMap[source.containerId];
    const [targetItems, setTargetItems] = crossMap[target.containerId];

    const newSource = [...sourceItems];
    const newTarget = [...targetItems];

    const [movedItem] = newSource.splice(source.index, 1);
    newTarget.splice(target.index, 0, movedItem);
    setSourceItems(newSource);
    setTargetItems(newTarget);
  };
  // useEffect(() => {
  //   console.log("sortableItems", sortableItems);
  //   console.log("storedItems", storedItems);
  // }, [sortableItems, storedItems]);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      <div
        style={{
          minWidth: "100px",
        }}
      >
        sider
      </div>
      <section
        className="main-container"
        style={{
          flex: 1,
          border: "1px solid red",
          // maxWidth: "calc(100vw - 100px)",
          // height: "200px",
          // minHeight: "200px",
          padding: "10px",
          // overflow: "scroll",
        }}
      >
        {/* <button onClick={handleClick}>编辑</button> */}
        <SortableProvider onCross={handleCrossContainer}>
          <SortableContainer
            id="sort-container111"
            enableDnd={isEditing}
            className="drag-container-user"
            onOrderChange={handleOrderChange}
            unitSize={100}
            // width={600}
            height={600}
            gridTemplateColumns={4}
            style={{
              border: "1px solid red",
            }}
            // onDragStart={() => console.log("drag start")}
            // onAnyDrag={() => console.log("drag")}
            // onDragEnd={() => console.log("drag end")}
          >
            {storedItems.map((item) => {
              return (
                <SortableItem key={item.id} id={item.id}>
                  {item.children}
                </SortableItem>
              );
            })}
          </SortableContainer>
          <SortableContainer
            className="drag-container"
            id="222"
            // width={600}
            height={600}
            unitSize={100}
            onOrderChange={handleOrderChange2}
            gridTemplateColumns={4}
          >
            {sortableItems.map((item) => {
              return (
                <SortableItem
                  key={item.id}
                  id={item.id}
                >
                  {item.children}
                </SortableItem>
              );
            })}
          </SortableContainer>
        </SortableProvider>
      </section>
    </div>
  );
  },
};
