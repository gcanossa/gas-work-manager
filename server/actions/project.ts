import { insertFirst, insertLast, read } from "@gasstack/db";
import { getFolderByPath } from "@gasstack/fs";
import { NewProjectType } from "@model/project";
import { NewServiceType } from "@model/service";
import { DriveFoldersNames } from "@model/types";
import {
  clientOrgCtx,
  projectCtx,
  serviceCtx,
  serviceEnumCtx,
} from "@server/contexts";
import { getAppRootFolder } from "./server-utils";

export function createProject(
  obj: NewProjectType & {
    services: Omit<NewServiceType, "projectId">[];
  },
) {
  const clientEntity = read(clientOrgCtx).find((p) => p.id === obj.clientId);

  const folderRoot = getAppRootFolder();

  const projectsFolder = getFolderByPath(folderRoot, [
    DriveFoldersNames.Projects,
  ]);
  const clientProjectsFolder = getFolderByPath(folderRoot, [
    DriveFoldersNames.Clients,
    clientEntity!.name,
    DriveFoldersNames.Projects,
  ]);

  const newFolder = clientProjectsFolder!.createFolder(`${obj.name}`);
  projectsFolder!
    .createShortcut(newFolder.getId())
    .setName(`${clientEntity!.name}_${obj.name}`);

  const newProject = insertFirst(projectCtx, {
    name: obj.name,
    clientId: obj.clientId,
    driveFolder: {
      url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
      label: "Cartella",
    },
  })[0];

  const serviceEnum = read(serviceEnumCtx).map((p) => p.name);

  for (let item of obj.services) {
    if (!serviceEnum.find((p) => p === item.type)) {
      insertLast(serviceEnumCtx, { name: item.type });
      serviceEnum.push(item.type);
    }

    insertFirst(serviceCtx, {
      type: item.type,
      hourlyRate: item.hourlyRate,
      projectId: newProject.id,
    });
  }
}

export function getProjects() {
  return read(projectCtx);
}
