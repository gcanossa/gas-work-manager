import { createScopedClient } from "@gasstack/rpc";
import { type ServerApiType } from "@server";
import mocks from "@/gas-mock";

mocks;

const client = window.google
  ? createScopedClient<ServerApiType>("appInvoke")
  : null;
export default client;
