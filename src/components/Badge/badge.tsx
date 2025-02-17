import clsx from "clsx";
import "./badge.css";
import { Minus } from "lucide-react";

interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  placement?: "left" | "right";
}

const Badge: React.FC<BadgeProps> = ({ placement = "left", children }) => {
  return (
    <div className="badge-container">
      <sup
        className={clsx("badge", {
          left: placement === "left",
          right: placement === "right",
        })}
      >
        <Minus />
      </sup>
      {children}
    </div>
  );
};
export default Badge;
