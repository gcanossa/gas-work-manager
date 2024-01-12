import { createGasAppBridge } from "@gcanossa/gas-app";
import { type appAPI } from "@server";
import mocks from "@/app-mock";

mocks;

const bridge = createGasAppBridge<appAPI>("appInvoke");
export default bridge;
