// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasData(obj: any): obj is { data: any } {
  return obj && typeof obj === "object" && "data" in obj;
}
