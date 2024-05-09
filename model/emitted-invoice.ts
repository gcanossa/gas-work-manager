import {
  numeric,
  serial,
  formula,
  hyperLink,
  dateTime,
  RowObject,
} from "@gasstack/db";
import { z } from "zod";

export const emittedInvoiceModel = {
  id: serial(numeric(0)),
  roundId: numeric(1),
  date: dateTime(2),
  total: numeric(3),
  socialSecurityFundRate: numeric(4),
  socialSecurityFundAmount: formula(numeric(5)),
  taxableAmount: formula(numeric(6)),
  vatRate: numeric(7),
  vatAmount: formula(numeric(8)),
  withholdingTaxRate: numeric(9),
  withholdingTaxAmount: formula(numeric(10)),
  invoiceAmount: formula(numeric(11)),
  dueAmount: formula(numeric(12)),
  driveItem: hyperLink(13),
};

export type EmittedInvoiceType = RowObject<typeof emittedInvoiceModel>;

export const soldItemSchema = z.object({
  description: z.string().min(10),
  unitCount: z.number().min(1),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  vatRate: z.number().positive().default(22),
});

export type NewEmittedInvoiceSoldItemType = z.infer<typeof soldItemSchema>;

export const emittedInvoiceSchema = z.object({
  roundId: z.coerce.number().positive(),
  date: z.string().refine((p) => !isNaN(new Date(p).getTime()), {
    message: "Invalid date",
  }),
  activities: z.array(z.number().min(0)),
  soldItems: z.array(soldItemSchema),
});

export type NewEmittedInvoiceType = z.infer<typeof emittedInvoiceSchema>;
