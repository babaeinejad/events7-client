/* eslint-disable @typescript-eslint/no-explicit-any */
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

export function hasIdProperty(obj: any): obj is { id: string } {
  return obj && typeof obj === "object" && "id" in obj;
}

export function hasData(obj: any): obj is { data: any } {
  return obj && typeof obj === "object" && "data" in obj;
}

export function hasEvents(obj: any): obj is { events: any } {
  return obj && typeof obj === "object" && "events" in obj;
}

export function hasNextPage(obj: any): obj is { nextPageAvailable: boolean } {
  return obj && typeof obj === "object" && "nextPageAvailable" in obj;
}
