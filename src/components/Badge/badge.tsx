import clsx from "clsx";
import "./badge.css";
import { Minus } from "lucide-react";

interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  placement?: "left" | "right";
  visible?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  placement = "left",
  visible = false,
  children,
}) => {
  return (
    <div className="badge-container">
      <sup
        className={clsx("badge", {
          left: placement === "left",
          right: placement === "right",
        })}
        style={{ display: visible ? "flex" : "none" }}
      >
        <Minus />
      </sup>
      {children}
    </div>
  );
};
export default Badge;
