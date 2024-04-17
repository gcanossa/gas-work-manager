import { count, insertAt, read } from "@gasstack/db";
import { NewOrganizationType } from "@model/organization";
import { getFolders } from "@gasstack/fs";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { organizationCtx, settingsCtx } from "@server/contexts";

export function createClient(obj: NewOrganizationType) {
  const newClient = insertAt(
    organizationCtx,
    obj,
    count(organizationCtx),
    true,
  )[0];

  const settings = read(settingsCtx);

  const driveId = settings.find(
    (p) => p.key === SettingsKeys.DriveFolder,
  )!.value;

  const folders = getFolders(driveId);
  const clientsFolder = folders.find(
    (p) => p.getName() === DriveFoldersNames.Clients,
  );

  const newFolder = clientsFolder?.addFolder(
    DriveApp.createFolder(`${newClient.id}_${newClient.name}`),
  );

  newFolder?.addFolder(DriveApp.createFolder(DriveFoldersNames.Contracts));
  newFolder?.addFolder(DriveApp.createFolder(DriveFoldersNames.Projects));
  newFolder?.addFolder(
    DriveApp.createFolder(DriveFoldersNames.EmittedInvoices),
  );
}
