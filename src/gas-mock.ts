import { setupMocks, delayedSuccess, delayedFailure } from "@gasstack/rpc";
import { NewOrganizationType } from "@model/organization";
import { NewProjectType } from "@model/project";
import {
  NewServiceEnumType,
  NewServiceType,
  ServiceEnumType,
} from "@model/service";

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
          async createProject(
            obj: NewProjectType & {
              services: Omit<NewServiceType, "projectId">[];
            },
          ) {
            await delayedSuccess([500, 2000]);
            console.log(obj);
          },
          async getServiceTypes() {
            await delayedSuccess([500, 2000]);
            return serviceTypes;
          },
        },
      },
    )
  : null;

export default mocks;
