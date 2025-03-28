import clsx from "../../utils/clsx";
import "./badge.css";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14"></path>
        </svg>
      </sup>
      {children}
    </div>
  );
};
export { Badge };
