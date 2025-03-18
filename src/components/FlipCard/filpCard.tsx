import "./flipCard.css";

export interface FilpCardProps {
  back: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
const FilpCard = (props: FilpCardProps) => {
  const { back, children, className, style } = props;
  return (
    <div className="flipper-container">
      <div className="modal-overlay"></div>

      <div className="flipper">
        <div className="front">{children}</div>
        <div className="back">{back}</div>
      </div>
    </div>
  );
};
export { FilpCard };
