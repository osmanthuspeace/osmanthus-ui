import { Coordinate } from "../../../type";

export const getFinalTransform = (
  newIndex: number,
  currentCoordinate: Coordinate,
  containerCoordinate: {
    containerX: number;
    containerY: number;
  },
  gridLayout: {
    columns: number;
    gap: number;
  },
  unitSize: number
): { x: number; y: number } => {
  //   console.log(
  //     "newIndex",
  //     newIndex,
  //     "currentCoordinate",
  //     currentCoordinate,
  //     "gridLayout",
  //     gridLayout,
  //     "unitSize",
  //     unitSize,
  //     "getFinalTransform"
  //   );

  const targetRow = Math.floor(newIndex / gridLayout.columns);
  const targetCol = newIndex % gridLayout.columns;

  const targetX =
    targetCol * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    unitSize / 2 +
    containerCoordinate.containerX;
  const targetY =
    targetRow * (unitSize + gridLayout.gap) +
    gridLayout.gap +
    unitSize / 2 +
    containerCoordinate.containerY;

  const currentCenterX = currentCoordinate.x + unitSize / 2;
  const currentCenterY = currentCoordinate.y + unitSize / 2;

  console.log(
    "currentCenterX",
    currentCenterX,
    "targetX",
    targetX,
    "currentCenterY",
    currentCenterY,
    "targetY",
    targetY,
    "getFinalTransform"
  );

  const x = currentCenterX - targetX;
  const y = currentCenterY - targetY;
  // console.log("x", x, "y", y);

  return {
    x: x,
    y: y,
  };
};
