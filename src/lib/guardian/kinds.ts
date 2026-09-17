import type { SessionKind } from "./types";

export const SESSION_KINDS: {
  id: SessionKind;
  title: string;
  blurb: string;
  defaultDestination: string;
}[] = [
  {
    id: "date",
    title: "Guardian Date",
    blurb: "Meeting someone. Expected duration and a check-in window.",
    defaultDestination: "West 7th, Fort Worth",
  },
  {
    id: "ride",
    title: "Guardian Ride",
    blurb: "Rideshare or transit. Preserve route, vehicle, and drop-off.",
    defaultDestination: "DFW Terminal D",
  },
  {
    id: "showing",
    title: "Guardian Showing",
    blurb: "Property visit. Agent, address, and expected walkthrough.",
    defaultDestination: "1841 Fairmount Ave",
  },
  {
    id: "travel",
    title: "Guardian Stay",
    blurb: "Hotel or trip. Check-in at arrival and overnight.",
    defaultDestination: "The Sinclair, Fort Worth",
  },
  {
    id: "nightlife",
    title: "Nightlife",
    blurb: "Out for the evening. Route home and missed-response protocol.",
    defaultDestination: "Near Southside",
  },
  {
    id: "work",
    title: "Worker Guardian",
    blurb: "Shift, delivery, or field visit. Expected end of window.",
    defaultDestination: "South Main warehouse",
  },
  {
    id: "custom",
    title: "Custom session",
    blurb: "Name the window. Guardian records only what you authorize.",
    defaultDestination: "",
  },
];

export function kindTitle(kind: SessionKind): string {
  return SESSION_KINDS.find((k) => k.id === kind)?.title ?? "Guardian Session";
}
