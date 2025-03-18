import { useState } from "react";
import "./App.css";

import { SortableItem } from "./components/Sortable/sortableItem";
import { SortContainer } from "./components/Sortable/sortContainer";
import { SortableItems } from "./components/Sortable/interface";
import { FilpCard } from "./components/FlipCard/filpCard";

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

  const [storedItems, setStoredItems] = useState<SortableItems>(
    Array.from({ length: 10 }).map((_, index) => {
      return { id: index.toString(), children: "test" + index };
    })
  );

  const handleOrderChange = (newOrderIds: string[]) => {
    const orderedItems = newOrderIds.map(
      (id) => storedItems.find((item) => item.id === id)!
    );
    setStoredItems(orderedItems);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>编辑</button>
        <SortContainer
          isActive={isEditing}
          className="drag-container"
          onOrderChange={handleOrderChange}
          width={600}
          height={1200}
          gridTemplateColumns={4}
          // onDragStart={() => console.log("drag start")}
          // onDrag={() => console.log("drag")}
          // onDragEnd={() => console.log("drag end")}
        >
          {storedItems.map((item) => {
            return (
              <SortableItem key={item.id} id={item.id}>
                {item.children}
              </SortableItem>
            );
          })}
        </SortContainer>
        <FilpCard back={<>背面</>}>
          <SortableItem></SortableItem>
        </FilpCard>
      </section>
    </>
  );
}

export default App;
