import { GridLayout } from "../../SortableContainer/interface";
import { ContainerInfo } from "../../SortableProvider/interface";
import { calculateCoordianteByIndex } from "./calculateCoordianteByIndex";

export const getFinalTransform = (
  originIndex: number,
  originContainerInfo: ContainerInfo,
  newIndex: number,
  newContainerInfo: ContainerInfo,
  gridLayout: GridLayout,
  unitSize: number
): { x: number; y: number } => {
  const originContainerCoordinate = {
    x: originContainerInfo.rect.left,
    y: originContainerInfo.rect.top,
  };
  const newContainerCoordinate = {
    x: newContainerInfo.rect.left,
    y: newContainerInfo.rect.top,
  };
  const originCoord = calculateCoordianteByIndex(
    originIndex,
    gridLayout,
    unitSize,
    originContainerCoordinate
  );

  const newCoord = calculateCoordianteByIndex(
    newIndex,
    gridLayout,
    unitSize,
    newContainerCoordinate
  );
  const x = newCoord.x - originCoord.x;
  const y = newCoord.y - originCoord.y;
  console.log("x", x, "y", y);

  return {
    x: x,
    y: y,
  };
};
