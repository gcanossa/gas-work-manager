import { setupMocks, delayedSuccess, delayedFailure } from "@gasstack/rpc";
import { NewOrganizationType } from "@model/organization";

const mocks = import.meta.env.DEV
  ? setupMocks(
      {},
      {
        appInvoke: {
          async createClient(obj: NewOrganizationType) {
            await delayedFailure([500, 2000], Error("Errore generico"));
            console.log(obj);
          },
        },
      },
    )
  : null;

export default mocks;
