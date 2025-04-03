import { useState } from "react";
import "./App.css";

import { SortableItem } from "../../src/components/Sortable/sortableItem";
import { SortContainer } from "../../src/components/Sortable/sortContainer";
import { SortableItems } from "../../src/components/Sortable/interface";
import { CrossContainer } from "../../src/components/CrossContainer/CrossContainer";
import {
  CrossInfo,
  CrossMap,
} from "../../src/components/CrossContainer/interface";
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
    Array.from({ length: 80 }).map((_, index) => {
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
    console.log("handleCrossContainer");

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
    <>
      <section className="main-container">
        <button onClick={handleClick}>编辑</button>
        {/* <CrossContainer onCross={handleCrossContainer}> */}
          <SortContainer
            id="sort-container111"
            enableDnd={isEditing}
            className="drag-container"
            onOrderChange={handleOrderChange}
            width={600}
            height={300}
            gridTemplateColumns={4}
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
          </SortContainer>
          {/* <SortContainer
            className="drag-container"
            id="222"
            width={600}
            height={300}
            onOrderChange={handleOrderChange2}
            gridTemplateColumns={4}
          >
            {sortableItems.map((item) => {
              return (
                <SortableItem key={item.id} id={item.id}>
                  {item.children}
                </SortableItem>
              );
            })}
          </SortContainer> */}
        {/* </CrossContainer> */}
      </section>
    </>
  );
}

export default App;
