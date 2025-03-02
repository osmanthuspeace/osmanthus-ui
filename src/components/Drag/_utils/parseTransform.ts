export const parseTransform = (transform: string) => {
  let translateX = 0;
  let translateY = 0;
  const regex = /translateX\(([-\d.]+)px\)|translateY\(([-\d.]+)px\)/g;
  while (true) {
    const match = regex.exec(transform);
    if (match === null) {
      break;
    }
    if (match[1]) {
      translateX = parseFloat(match[1]);
    } else if (match[2]) {
      translateY = parseFloat(match[2]);
    }
  }
  return [translateX, translateY];
};
