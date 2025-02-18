import { useState } from "react";
import "./App.css";
import Waggle from "./components/Waggle/waggle";
import Badge from "./components/Badge/badge";
import Squircle from "./components/Squircle/squircle";
import DraggableItem from "./components/Drag/draggableItem";

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
        <Waggle isActive={isEditing}>
          {isEditing ? (
            <DraggableItem>
              <Badge>
                <Squircle
                  width={100}
                  height={100}
                  radius={"auto"}
                  roundness={0}
                  enableBorder={true}
                >
                  1
                </Squircle>
              </Badge>
            </DraggableItem>
          ) : (
            <>
              <Squircle
                width={100}
                height={100}
                radius={"auto"}
                roundness={0}
                enableBorder={true}
              >
                1
              </Squircle>
            </>
          )}
        </Waggle>
      </section>
    </>
  );
}

export default App;
