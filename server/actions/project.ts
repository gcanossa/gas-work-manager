import { insertAt, read } from "@gasstack/db";
import { getFolders } from "@gasstack/fs";
import { NewProjectType } from "@model/project";
import { NewServiceType } from "@model/service";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import {
  organizationCtx,
  projectCtx,
  serviceCtx,
  serviceEnumCtx,
  settingsCtx,
} from "@server/contexts";

export function createProject(
  obj: NewProjectType & {
    services: Omit<NewServiceType, "projectId">[];
  },
) {
  const settings = read(settingsCtx);

  const driveId = settings.find(
    (p) => p.key === SettingsKeys.DriveFolder,
  )!.value;

  const folders = getFolders(driveId);

  const clientsFolder = folders.find(
    (p) => p.getName() === DriveFoldersNames.Clients,
  );
  const projectsFolder = folders.find(
    (p) => p.getName() === DriveFoldersNames.Projects,
  );

  const clientEntity = read(organizationCtx).find((p) => p.id === obj.clientId);

  const clientEntityFolder = getFolders(clientsFolder!.getId()).find(
    (p) => p.getName() === clientEntity!.name,
  );
  const clientEntityFolders = getFolders(clientEntityFolder!.getId());

  const newFolder = clientEntityFolders
    .find((p) => p.getName() === DriveFoldersNames.Projects)!
    .createFolder(`${obj.name}`);
  projectsFolder!
    .createShortcut(newFolder.getId())
    .setName(`${clientEntity!.name}_${obj.name}`);

  const newProject = insertAt(
    projectCtx,
    {
      name: obj.name,
      clientId: obj.clientId,
      driveFolder: {
        url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
        label: "Cartella",
      },
    },
    0,
  )[0];

  const serviceEnum = read(serviceEnumCtx).map((p) => p.name);

  for (let item of obj.services) {
    if (!serviceEnum.find((p) => p === item.type)) {
      insertAt(
        serviceEnumCtx,
        { name: item.type },
        serviceEnum.length - 1,
        true,
      );
      serviceEnum.push(item.type);
    }

    insertAt(
      serviceCtx,
      {
        type: item.type,
        hourlyRate: item.hourlyRate,
        projectId: newProject.id,
      },
      0,
    );
  }
}

export function getProjects() {
  return read(projectCtx);
}
