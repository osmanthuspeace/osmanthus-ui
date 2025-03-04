import { useState } from "react";
import "./App.css";

import { SortableItem } from "./components/Sortable/sortableItem";
import { SortContainer } from "./components/Sortable/sortContainer";
import { SortableItems } from "./components/Sortable/interface";

function App() {
  const [isEditing, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isEditing);
  };

  const [sortableItems, setSortableItems] = useState<SortableItems>([
    { id: "1", children: "app1" },
    { id: "2", children: "app2" },
    { id: "3", children: "component3" },
    { id: "4", children: "test4" },
    { id: "5", children: "test5" },
  ]);
  const handleOrderChange = (newOrderIds: string[]) => {
    const orderedItems = newOrderIds.map(
      (id) => sortableItems.find((item) => item.id === id)!
    );
    setSortableItems(orderedItems);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>编辑</button>
        <SortContainer
          isActive={isEditing}
          className="drag-container"
          onOrderChange={handleOrderChange}
          onDragStart={() => console.log("drag start")}
          onDrag={() => console.log("drag")}
          onDragEnd={() => console.log("drag end")}
        >
          {sortableItems.map((item) => {
            return (
              <SortableItem key={item.id} id={item.id}>
                {item.children}
              </SortableItem>
            );
          })}
        </SortContainer>
      </section>
    </>
  );
}

export default App;
