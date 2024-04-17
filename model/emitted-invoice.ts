import {
  numeric,
  text,
  serial,
  formula,
  hyperLink,
  dateTime,
} from "@gasstack/db";

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
