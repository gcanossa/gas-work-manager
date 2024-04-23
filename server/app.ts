import { ServerRunMethods } from "@gasstack/rpc";
import { createClient, getClients } from "@server/actions/clients";
import { createProject } from "@server/actions/project";
import { getServiceTypes } from "@server/actions/services";

const app = {
  createClient,
  getClients,
  createProject,
  getServiceTypes,
} satisfies ServerRunMethods;

export default app;
