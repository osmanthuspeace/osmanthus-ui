export const getCoordinate = (element: Element) => {
  // TODO
  const { x, y } = element.getBoundingClientRect();
  return {
    x,
    y,
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
