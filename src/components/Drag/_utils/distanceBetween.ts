import { Coordinate } from "../../../type";

/**
 * Returns the distance between two points
 */
export function distanceBetween(p1: Coordinate, p2: Coordinate) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
