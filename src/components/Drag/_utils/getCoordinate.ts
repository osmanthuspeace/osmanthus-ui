export const getCoordinate = (element: Element, scale?: number) => {
  // TODO
  const { x, y } = element.getBoundingClientRect();
  return {
    x: x / (scale ?? 1),
    y: y / (scale ?? 1),
  };
};

export const getCenterCoordinate = (element: Element) => {
  // TODO
  const { x, y, width, height } = element.getBoundingClientRect();
  return {
    x: x + width / 2,
    y: y + height / 2,
  };
};
