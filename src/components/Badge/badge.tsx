import clsx from "clsx";
import "./badge.css";

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
        -
      </sup>
      {children}
    </div>
  );
};
export default Badge;
