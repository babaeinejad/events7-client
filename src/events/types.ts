export enum ExtendedEvnet7Types {
  CROSPROMO = "CROSPROMO",
  LIVEOPS = "LIVEOPS",
  APP = "APP",
  ADS = "ADS",
}

export enum Evnet7Types {
  CROSPROMO = "CROSPROMO",
  LIVEOPS = "LIVEOPS",
  APP = "APP",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasIdProperty(obj: any): obj is { id: string } {
  return obj && typeof obj === "object" && "id" in obj;
}
