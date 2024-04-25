import { setupMocks, delayedSuccess, delayedFailure } from "@gasstack/rpc";
import { NewOrganizationType } from "@model/organization";
import { NewProjectType } from "@model/project";
import { NewServiceEnumType, ServiceEnumType } from "@model/service";
import { createServiceType } from "@server/actions/services";

const serviceTypes: ServiceEnumType[] = [
  { name: "Prova" },
  { name: "Nessuno" },
  { name: "Altro" },
];

const mocks = import.meta.env.DEV
  ? setupMocks(
      {},
      {
        appInvoke: {
          async getClients() {
            await delayedSuccess([500, 2000]);
            return [
              {
                id: 1,
                name: "uno",
                address: "",
                zipCode: "",
                city: "",
                province: "",
                country: "",
                vatNumber: "",
              },
              {
                id: 2,
                name: "due",
                address: "",
                zipCode: "",
                city: "",
                province: "",
                country: "",
                vatNumber: "",
              },
              {
                id: 3,
                name: "tre",
                address: "",
                zipCode: "",
                city: "",
                province: "",
                country: "",
                vatNumber: "",
              },
            ];
          },
          async createClient(obj: NewOrganizationType) {
            await delayedFailure([500, 2000], Error("Errore generico"));
            console.log(obj);
          },
          async createProject(obj: NewProjectType) {
            await delayedSuccess([500, 2000]);
            console.log(obj);
          },
          async getServiceTypes() {
            await delayedSuccess([500, 2000]);
            return serviceTypes;
          },
          async createServiceType(type: NewServiceEnumType) {
            await delayedSuccess([500, 2000]);
            serviceTypes.unshift(type);
          },
        },
      },
    )
  : null;

export default mocks;
