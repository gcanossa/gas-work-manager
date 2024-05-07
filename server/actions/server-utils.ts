import { read } from "@gasstack/db";
import { SettingsKeys } from "@model/types";
import { settingsCtx } from "@server/contexts";

export function getAppRootFolder() {
  const settings = read(settingsCtx);

  const driveId = settings.find(
    (p) => p.key === SettingsKeys.DriveFolder,
  )!.value;

  return DriveApp.getFolderById(driveId);
}
