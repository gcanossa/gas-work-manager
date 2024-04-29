import {
  numeric,
  text,
  serial,
  formula,
  dateTime,
  RowObject,
  nullable,
} from "@gasstack/db";
import { z } from "zod";

export const roundStatusEnumModel = {
  name: text(0),
};

export const roundStatusEnumSchema = z.object({
  name: z.string().min(2, {
    message: "Round status must be at least 2 characters.",
  }),
});

export type RoundStatusEnumType = RowObject<typeof roundStatusEnumModel>;

export const roundModel = {
  id: serial(numeric(0)),
  clientId: numeric(1),
  clientName: formula(text(2)),
  start: dateTime(3),
  end: nullable(dateTime(4)),
  status: text(5),
};
