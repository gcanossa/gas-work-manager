import { createGasAppBridge } from "@gcanossa/gas-app";
import { type appAPI } from "@server";
import mocks from "@/app-mock";

mocks;

const bridge = (window as any).google
  ? createGasAppBridge<appAPI>("appInvoke")
  : null;
export default bridge;
