import { ServerRunMethods } from "@gasstack/rpc";
import { createClient } from "./actions/clients";

const app = {
  createClient,
} satisfies ServerRunMethods;

export default app;
