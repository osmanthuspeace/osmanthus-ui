export const parseTransform = (transform: string) => {
  const regex = /translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/;
  const matrix = transform.match(regex);
  if (!matrix) return [0, 0];
  const translateX = parseFloat(matrix[1]);
  const translateY = parseFloat(matrix[2]);
  return [translateX, translateY];
};
