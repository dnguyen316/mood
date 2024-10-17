export const isAPIPath = (path: string) => {
  return path.match(new RegExp(`$\/api\/`));
};
