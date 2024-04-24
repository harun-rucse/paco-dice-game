import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date, format = "MMM D, YYYY") {
  return dayjs(date).format(format);
}

export function formatTime(date, format = "hh:mm:ss A") {
  return dayjs(date).format(format);
}

export function todaysDay() {
  return dayjs();
}

export function addDay(date) {
  return dayjs(date).add(1, "day");
}

export function subtractDay(date) {
  return dayjs(date).subtract(1, "day");
}
