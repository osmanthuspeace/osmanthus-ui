import { useState } from "react";
import "./App.css";

import { SortableItem } from "./components/Sortable/sortableItem";
import { SortContainer } from "./components/Sortable/sortContainer";

function App() {
  const [isEditing, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isEditing);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>编辑</button>
        <SortContainer isActive={isEditing} className="drag-container">
          <SortableItem>app1</SortableItem>
          <SortableItem>app2</SortableItem>
          <SortableItem>component3</SortableItem>
          <SortableItem>test4</SortableItem>
          <SortableItem>test5</SortableItem>
        </SortContainer>
      </section>
    </>
  );
}

export default App;
