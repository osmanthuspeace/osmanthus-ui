export function clsx(...args: any[]) {
  let composedClassnames = "";
  for (const classname of args) {
    if (classname && typeof classname === "string") {
      composedClassnames += classname + " ";
    }
  }
  return composedClassnames.trim();
}

export default clsx;
