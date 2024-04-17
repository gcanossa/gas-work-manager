import { createContext } from "@gasstack/db";
import { organizationModel } from "@model/organization";
import { settingsModel } from "@model/settings";

export const organizationCtx = createContext<typeof organizationModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Clienti" },
  organizationModel,
);

export const settingsCtx = createContext<typeof settingsModel>(
  SpreadsheetApp.getActive(),
  { rangeName: "Impostazioni" },
  settingsModel,
);
