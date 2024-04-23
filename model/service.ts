import { numeric, text, serial, formula, RowObject } from "@gasstack/db";
import { z } from "zod";

export const serviceEnumModel = {
  name: text(0),
};

export const serviceEnumSchema = z.object({
  name: z.string().min(2, {
    message: "ServiceType must be at least 2 characters.",
  }),
});

export type ServiceEnumType = RowObject<typeof serviceEnumModel>;
export type NewServiceEnumType = z.infer<typeof serviceEnumSchema>;

export const serviceModel = {
  id: serial(numeric(0)),
  name: text(1),
  projectId: numeric(2),
  clientName: formula(text(3)),
  hourlyRate: numeric(4),
};

export const serviceSchema = z.object({
  name: z.string().min(2, {
    message: "Service must be at least 2 characters.",
  }),
  projectId: z.number().positive({
    message: "Project id must be positive.",
  }),
  hourlyRate: z.number().positive({
    message: "Hourly rate must be positive.",
  }),
});

export type ServiceType = RowObject<typeof serviceModel>;
export type NewServiceType = z.infer<typeof serviceSchema>;
