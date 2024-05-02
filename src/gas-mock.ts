import { setupMocks, delayedSuccess, delayedFailure } from "@gasstack/rpc";
import { NewActivityTrackType } from "@model/activity-track";
import { NewOrganizationType } from "@model/organization";
import { NewProjectType } from "@model/project";
import { NewServiceType, ServiceEnumType } from "@model/service";

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
          async getProjects() {
            return [
              { id: 1, name: "Uno" },
              { id: 2, name: "Due" },
              { id: 3, name: "Tre" },
            ];
          },
          async getServiceTypes() {
            await delayedSuccess([500, 2000]);
            return serviceTypes;
          },
          async getServices() {
            return [
              { type: "Uno", projectId: 1, id: 1 },
              { type: "Due", projectId: 1, id: 2 },
              { type: "Tre", projectId: 2, id: 3 },
            ];
          },
          async trackActivity(obj: NewActivityTrackType) {
            await delayedSuccess([500, 2000]);
            console.log(obj);
          },
          async getRounds() {
            await delayedSuccess([500, 2000]);
            return [
              {
                id: 1,
                clientId: 1,
                clientName: "uno",
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                status: "Attivo",
              },
            ];
          },
          async getRoundTotalAmount(roundId: number) {
            await delayedSuccess([500, 2000]);
            return 1234.53;
          },
          async getRoundActivities(roundId: number) {
            await delayedSuccess([500, 2000]);
            return [
              {
                id: 1,
                clientName: "Cliente",
                serviceName: "Servizio",
                description: "Descrizione di cosa è stato fatto",
                start: new Date().toISOString(),
                end: new Date().toISOString(),
                multiplier: 1,
                billable: true,
                hourlyRate: 10,
              },
            ];
          },
        },
      },
    )
  : null;

export default mocks;
