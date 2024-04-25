import { createContext } from "@gasstack/db";
import { organizationModel } from "@model/organization";
import { projectModel } from "@model/project";
import { serviceEnumModel, serviceModel } from "@model/service";
import { settingsModel } from "@model/settings";

export const organizationCtx = createContext<typeof organizationModel>(
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
