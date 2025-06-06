import { RefObject } from "react";

export enum TimepickerType {
  Hour = "hour",
  Minute = "minute",
}

export type RefMap = { [key: string]: RefObject<HTMLButtonElement> };
