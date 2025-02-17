import { useEffect, useRef, useState } from "react";

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef();

  useEffect(() => {
    const updateMousePosition = (ev) => {
      const rect = ref.current.getBoundingClientRect();
      setMousePosition({ x: ev.clientX - rect.x, y: ev.clientY - rect.y });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return {
    mousePosition,
    ref,
  };
};
export default useMousePosition;