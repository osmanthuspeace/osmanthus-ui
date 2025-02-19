import { useState } from "react";
import "./App.css";

import SortableItem from "./components/Sortable/sortableItem";
import SortContainer from "./components/Sortable/sortContainer";
import useSortableStore from "./temp-store/useSortableStore";

function App() {
  const [isEditing, setIsActive] = useState(false);

  const { items,addItem,removeItem,setActiveId } = useSortableStore();
  const handleClick = () => {
    setIsActive(!isEditing);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>编辑</button>
        <SortContainer className="drag-container">
          <SortableItem isActive={isEditing}>1</SortableItem>
          <SortableItem isActive={isEditing}>2</SortableItem>
          <SortableItem isActive={isEditing}>3</SortableItem>
        </SortContainer>
      </section>
    </>
  );
}

export default App;
