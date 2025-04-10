import { motion, Transition } from "motion/react";
import { useContext, useMemo } from "react";
import SortableContext from "../SortableContext/sortableContext";

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
  const delay = useMemo(() => Math.random() * 3, []);
  const { enableDnd, unitSize } = useContext(SortableContext);

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
        animate={enableDnd ? animationConfig : {}}
        transition={enableDnd ? transitionConfig : undefined}
        style={{
          width: unitSize,
          height: unitSize,
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
export { Waggle };
