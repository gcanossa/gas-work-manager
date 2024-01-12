import {
  initMocks,
  delayedSuccess,
  // delayedFailure,
  GasClientApiRunMethodsMocks,
} from "@gcanossa/gas-app/mocking";
import { type appAPI } from "@server";

const mocks = import.meta.env.DEV
  ? initMocks<{}, { appInvoke: any }>(
      {},
      {
        appInvoke: {
          sum(a: number, b: number) {
            return delayedSuccess([500, 2000], a + b);
          },
          mul(a: number, b: number) {
            console.log("mul");
            return delayedSuccess([500, 2000], a * b + 1);
            // return delayedFailure(600, new Error("errore grave"));
          },
        } satisfies GasClientApiRunMethodsMocks<appAPI>,
      }
    )
  : null;

export default mocks;
