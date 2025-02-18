import { useState } from "react";
import "./App.css";

import SortableItem from "./components/Drag/sortableItem";
import SortContainer from "./components/Drag/sortContainer";

function App() {
  const [isEditing, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isEditing);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>添加</button>
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
