import { Coordinate } from "../../../type";
import { GridLayout } from "../../Sortable/interface";
import { calculateCoordianteByIndex } from "./calculate";

export const getFinalTransform = (
  originIndex: number,
  newIndex: number,
  containerCoordinate: Coordinate,
  gridLayout: GridLayout,
  unitSize: number
): { x: number; y: number } => {
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
