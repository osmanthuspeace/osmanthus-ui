import { useState } from "react";
import "./App.css";
import Waggle from "./components/Waggle/waggle";
import Badge from "./components/Badge/badge";
import Squircle from "./components/Squircle/squircle";

function App() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };
  return (
    <>
      <section className="main-container">
        <button onClick={handleClick}>添加</button>
        <button onClick={handleClick}>编辑</button>
        <Waggle isActive={isActive}>
          <Badge>
            <Squircle width={100} height={100} radius={"auto"} roundness={0}>
              1
            </Squircle>
          </Badge>
        </Waggle>
      </section>
    </>
  );
}

export default App;
