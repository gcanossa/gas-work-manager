import {
  numeric,
  serial,
  formula,
  hyperLink,
  dateTime,
  RowObject,
  text,
} from "@gasstack/db";
import { z } from "zod";

export const emittedInvoiceModel = {
  id: serial(numeric(0)),
  invoiceNumber: text(1),
  roundId: numeric(2),
  date: dateTime(3),
  total: numeric(4),
  socialSecurityFundRate: numeric(5),
  socialSecurityFundAmount: formula(numeric(6)),
  taxableAmount: formula(numeric(7)),
  vatRate: numeric(8),
  vatAmount: formula(numeric(9)),
  withholdingTaxRate: numeric(10),
  withholdingTaxAmount: formula(numeric(11)),
  invoiceAmount: formula(numeric(12)),
  dueAmount: formula(numeric(13)),
  driveItem: hyperLink(14),
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
