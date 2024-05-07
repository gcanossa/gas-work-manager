import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberToPrecision(value: number, precision: number): number {
  const pow = Math.pow(10, precision);
  return Math.round(value * pow) / pow;
}

export function intervalToHours(
  start: Date,
  end: Date,
  precision?: number,
): number {
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  return precision === undefined ? hours : numberToPrecision(hours, precision);
}
