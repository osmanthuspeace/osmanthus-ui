import { ClientRectangle, Coordinate } from "../../../type";

/**
 * Returns the coordinates of the center of a given ClientRect
 * 返回相对于页面左上角的中心坐标
 */
const centerOfRect = (rect: ClientRectangle): Coordinate => {
  return {
    x: rect.left + rect.width * 0.5,
    y: rect.top + rect.height * 0.5,
  };
};
export default centerOfRect;
