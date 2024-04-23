import { count, insertAt, read } from "@gasstack/db";
import { getFolders } from "@gasstack/fs";
import { NewProjectType } from "@model/project";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { organizationCtx, settingsCtx } from "@server/contexts";

export function createProject(obj: NewProjectType) {
  console.log(obj);
  // const settings = read(settingsCtx);

  // const driveId = settings.find(
  //   (p) => p.key === SettingsKeys.DriveFolder,
  // )!.value;

  // const folders = getFolders(driveId);
  // const clientsFolder = folders.find(
  //   (p) => p.getName() === DriveFoldersNames.Clients,
  // );

  // const newFolder = clientsFolder?.createFolder(`${obj.name}`);

  // obj.driveFolder = {
  //   url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
  //   label: "Cartella",
  // };
  // const newClient = insertAt(organizationCtx, obj, 0, true)[0];

  // newFolder?.createFolder(DriveFoldersNames.Contracts);
  // newFolder?.createFolder(DriveFoldersNames.Projects);
  // newFolder?.createFolder(DriveFoldersNames.EmittedInvoices);
}
