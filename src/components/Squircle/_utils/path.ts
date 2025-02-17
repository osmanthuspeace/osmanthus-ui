export const iOSPreset = {
  r1: 0.0586,
  r2: 0.332,
};

export function getSquirclePath(w: number, h: number, r1: number, r2: number) {
  r1 = Math.min(r1, r2);
  //M为移动到指定坐标，L为画直线，C为画曲线
  const path = `
      M 0,${r2}
      C 0,${r1} ${r1},0 ${r2},0
      L ${w - r2},0
      C ${w - r1},0 ${w},${r1} ${w},${r2}
      L ${w},${h - r2}
      C ${w},${h - r1} ${w - r1},${h} ${w - r2},${h}
      L ${r2},${h}
      C ${r1},${h} 0,${h - r1} 0,${h - r2}
      L 0,${r2}
    `
    .trim()
    .replace(/\n/g, " "); //整理路径字符串，移除多余空格与换行，使输出更紧凑

  return path;
}
export function convertSvgToDataUri(data: string) {
  return `data:image/svg+xml,${data
    .replace(/"/g, "'")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent)}`; //对特定的特殊字符进行 URI 编码
}
//得到路径数据后，该函数将路径包装到一个带有 clipPath 的 SVG 中
export function getSquircleMaskAsDataUri(
  w: number,
  h: number,
  r1: number,
  r2: number
) {
  const id = `squircle-${w}-${h}-${r1}-${r2}`;
  const path = getSquirclePath(w, h, r1, r2);

  const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <clipPath id="${id}"><path d="${path}"/></clipPath>
        </defs>
        <g clip-path="url(#${id})">
          <rect width="${w}" height="${h}" fill="#000"/>
        </g>
      </svg>
    `
    .trim()
    .replace(/\n| {2,}/g, "");

  return convertSvgToDataUri(svg);
}

//边框的svg数据
export function getSquircleBorderAsDataUri(
  w: number,
  h: number,
  r1: number,
  r2: number,
  strokeWidth: number = 2
) {
  const path = getSquirclePath(w, h, r1, r2);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <path 
        d="${path}" 
        fill="none" 
        stroke="blue" 
        stroke-width="${strokeWidth}" 
        stroke-linejoin="round"
      />
    </svg>
  `
    .trim()
    .replace(/\n| {2,}/g, "");

  return convertSvgToDataUri(svg);
}
