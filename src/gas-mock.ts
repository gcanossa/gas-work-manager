import { setupMocks, delayedSuccess } from "@gasstack/rpc";
import { NewOrganizationType } from "@model/organization";

const mocks = import.meta.env.DEV
  ? setupMocks(
      {},
      {
        appInvoke: {
          async createClient(obj: NewOrganizationType) {
            await delayedSuccess([500, 2000]);
            console.log(obj);
          },
        },
      },
    )
  : null;

export default mocks;
