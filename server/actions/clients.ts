import { count, insertAt, read } from "@gasstack/db";
import { NewOrganizationType, OrganizationType } from "@model/organization";
import { getFolders } from "@gasstack/fs";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { organizationCtx, settingsCtx } from "@server/contexts";

export function createClient(obj: NewOrganizationType) {
  const newObj: OrganizationType = {
    ...obj,
    id: 0,
    driveFolder: { url: "https://" },
  };
  const settings = read(settingsCtx);

  const driveId = settings.find(
    (p) => p.key === SettingsKeys.DriveFolder,
  )!.value;

  const folders = getFolders(driveId);
  const clientsFolder = folders.find(
    (p) => p.getName() === DriveFoldersNames.Clients,
  );

  const newFolder = clientsFolder?.createFolder(`${newObj.name}`);

  newObj.driveFolder = {
    url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
    label: "Cartella",
  };
  const newIndex = count(organizationCtx);
  insertAt(organizationCtx, newObj, newIndex - 1, true);

  newFolder?.createFolder(DriveFoldersNames.Contracts);
  newFolder?.createFolder(DriveFoldersNames.Projects);
  newFolder?.createFolder(DriveFoldersNames.EmittedInvoices);
}

export function getClients() {
  return read(organizationCtx);
}
