import {
  numberCol,
  stringCol,
  serial,
  formula,
  linkCol,
  dateCol,
} from "@gcanossa/gas-db/orm";

export const organizationModel = {
  id: serial(numberCol(0)),
  name: stringCol(1),
  address: stringCol(2),
  zipCode: stringCol(3),
  city: stringCol(4),
  province: stringCol(5),
  country: stringCol(6),
  vatNumber: stringCol(7),
};

export const contractModel = {
  id: serial(numberCol(0)),
  clientId: numberCol(1),
  clientName: formula(stringCol(2)),
  driveFolder: linkCol(3),
};

export const projectModel = {
  id: serial(numberCol(0)),
  name: stringCol(1),
  clientId: numberCol(2),
  clientName: formula(stringCol(3)),
  hourlyRate: numberCol(4),
};

export const serviceModel = {
  id: serial(numberCol(0)),
  name: stringCol(1),
  contractId: numberCol(2),
  clientName: formula(stringCol(3)),
  hourlyRate: numberCol(4),
};

export const roundModel = {
  id: serial(numberCol(0)),
  clientId: numberCol(1),
  clientName: formula(stringCol(2)),
  start: dateCol(3),
  end: dateCol(4),
  status: stringCol(5),
};

export const activityTrackModel = {
  id: serial(numberCol(0)),
  roundId: numberCol(1),
  projectId: numberCol(2),
  serviceId: numberCol(3),
  clientName: formula(stringCol(4)),
  serviceName: formula(stringCol(5)),
  description: stringCol(6),
  start: dateCol(7),
  end: dateCol(8),
  multiplier: numberCol(9),
  hourlyRate: numberCol(10),
};

export const moneyTransferModel = {
  id: serial(numberCol(0)),
  clientId: numberCol(1),
  providerId: numberCol(2),
  clientName: formula(stringCol(3)),
  providerName: formula(stringCol(4)),
  expense: numberCol(5),
  earning: numberCol(6),
  date: dateCol(7),
  roundId: numberCol(8),
};

export const emittedInvoiceModel = {
  id: serial(numberCol(0)),
  roundId: numberCol(1),
  date: dateCol(2),
  total: numberCol(3),
  socialSecurityFundRate: numberCol(4),
  socialSecurityFundAmount: formula(numberCol(5)),
  taxableAmount: formula(numberCol(6)),
  vatRate: numberCol(7),
  vatAmount: formula(numberCol(8)),
  withholdingTaxRate: numberCol(9),
  withholdingTaxAmount: formula(numberCol(10)),
  invoiceAmount: formula(numberCol(11)),
  dueAmount: formula(numberCol(12)),
  driveItem: linkCol(13),
};

export const receivedInvoiceModel = {
  id: serial(numberCol(0)),
  providerId: numberCol(1),
  date: dateCol(2),
  dueAmount: numberCol(3),
  driveItem: linkCol(4),
};

export const settingsModel = {
  key: stringCol(0),
  value: stringCol(1),
};
