import { motion, Transition } from "motion/react";
import { useContext, useMemo } from "react";
import SortableContext from "../Sortable/sortableContext";

interface WaggleProps extends React.HTMLAttributes<HTMLDivElement> {
  rotateAngle?: number;
  offsetX?: number;
  offsetY?: number;
}

const Waggle: React.FC<WaggleProps> = ({
  children,
  rotateAngle = 2,
  offsetX = 1,
  offsetY = 0.5,
}) => {
  const delay = useMemo(() => Math.random() * 2, []);
  const { isActive, width, height } = useContext(SortableContext);

  const initialConfig = {
    rotate: 0,
    translateX: 0,
    translateY: 0,
  };
  const animationConfig = {
    rotate: [-rotateAngle, rotateAngle, -rotateAngle],
    translateX: [-offsetX, offsetX, -offsetX],
    translateY: [offsetY, -offsetY, offsetY],
  };
  const transitionConfig: Transition = {
    duration: 0.3,
    repeat: Infinity,
    repeatType: "mirror",
    delay: -delay,
  };

  return (
    <>
      <motion.div
        className="waggle-item"
        initial={initialConfig}
        animate={isActive ? animationConfig : {}}
        transition={isActive ? transitionConfig : undefined}
        style={{
          width: width,
          height: height,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
export default Waggle;
