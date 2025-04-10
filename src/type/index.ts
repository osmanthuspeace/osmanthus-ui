export interface Position {
  row: number;
  column: number;
}
export interface Coordinate {
  x: number;
  y: number;
}
export interface LocationInfo extends Position, Coordinate {}

export interface ClientRectangle {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
  x: number; //x与y和left与top是一样的
  y: number;
}
export type Id = string|null;
