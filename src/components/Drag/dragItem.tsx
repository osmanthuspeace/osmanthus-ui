interface DragItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: number;
  index: number;
  scope: React.RefObject<HTMLDivElement>;
  containerRect: DOMRect | undefined;
}
const DragItemInternal = (props: DragItemProps) => {
    return(<></>);
}