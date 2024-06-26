import { createContext } from "@gasstack/db";
import { activityTrackModel } from "@model/activity-track";
import { emittedInvoiceModel } from "@model/emitted-invoice";
import { moneyTransferModel } from "@model/money-transfer";
import { organizationModel } from "@model/organization";
import { projectModel } from "@model/project";
import { roundModel } from "@model/round";
import { serviceEnumModel, serviceModel } from "@model/service";
import { settingsModel } from "@model/settings";

export const clientOrgCtx = createContext<typeof organizationModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Clienti" },
  organizationModel,
);

export const projectCtx = createContext<typeof projectModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Progetti" },
  projectModel,
);

export const serviceCtx = createContext<typeof serviceModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Servizi" },
  serviceModel,
);

export const serviceEnumCtx = createContext<typeof serviceEnumModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "ServiziEnum" },
  serviceEnumModel,
);

export const settingsCtx = createContext<typeof settingsModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Impostazioni" },
  settingsModel,
);

export const activityCtx = createContext<typeof activityTrackModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Rendicontazione" },
  activityTrackModel,
);

export const roundCtx = createContext<typeof roundModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Round" },
  roundModel,
);

export const emittedInvoiceCtx = createContext<typeof emittedInvoiceModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "FattureEmesse" },
  emittedInvoiceModel,
);

export const moneyTransferCtx = createContext<typeof moneyTransferModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Movimenti" },
  moneyTransferModel,
);
