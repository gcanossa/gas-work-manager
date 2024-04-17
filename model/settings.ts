import { text, RowObject } from "@gasstack/db";

export const settingsModel = {
  key: text(0),
  value: text(1),
};

export type SettingsType = RowObject<typeof settingsModel>;
