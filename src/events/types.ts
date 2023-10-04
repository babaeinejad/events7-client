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

export interface Events7 {
  id: string;
  priority: number;
  name: string;
  description: string;
  type: ExtendedEvnet7Types | Evnet7Types;
}
