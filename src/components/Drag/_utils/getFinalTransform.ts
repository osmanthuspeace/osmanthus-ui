import { GridLayout } from "../../SortableItem/interface";
import { ContainerInfo } from "../../SortableProvider/interface";
import { calculateCoordianteByIndex } from "./calculateCoordianteByIndex";

export const getFinalTransform = (
  originIndex: number,
  newIndex: number,
  containerInfo: ContainerInfo,
  gridLayout: GridLayout,
  unitSize: number
): { x: number; y: number } => {
  const containerCoordinate = {
    x: containerInfo.rect.left,
    y: containerInfo.rect.top,
  };
  const originCoord = calculateCoordianteByIndex(
    originIndex,
    gridLayout,
    unitSize,
    containerCoordinate
  );

  const newCoord = calculateCoordianteByIndex(
    newIndex,
    gridLayout,
    unitSize,
    containerCoordinate
  );
  const x = newCoord.x - originCoord.x;
  const y = newCoord.y - originCoord.y;
  // console.log("x", x, "y", y);

  return {
    x: x,
    y: y,
  };
};
