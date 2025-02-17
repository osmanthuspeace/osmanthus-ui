import { motion, Transition } from "motion/react";
import { useMemo } from "react";

interface WaggleProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  rotateAngle?: number;
  offsetX?: number;
  offsetY?: number;
}

const Waggle: React.FC<WaggleProps> = ({
  children,
  isActive = false,
  rotateAngle = 2,
  offsetX = 1,
  offsetY = 0.5,
}) => {
  const delay = useMemo(() => Math.random() * 2, []);
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
        transition={transitionConfig}
        style={{
          width: 100,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   borderRadius: 20,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
export default Waggle;
