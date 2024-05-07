import { setupMocks, delayedSuccess, delayedFailure } from "@gasstack/rpc";
import { NewActivityTrackType } from "@model/activity-track";
import { NewEmittedInvoiceType } from "@model/emitted-invoice";
import { NewOrganizationType } from "@model/organization";
import { NewProjectType } from "@model/project";
import { NewServiceType, ServiceEnumType } from "@model/service";
import { SequencesValues, getSequences } from "@server/actions/settings";

const serviceTypes: ServiceEnumType[] = [
  { name: "Prova" },
  { name: "Nessuno" },
  { name: "Altro" },
];

const sequences: SequencesValues = {
  clients_id: 0,
  projects_id: 10,
};

const mocks = import.meta.env.DEV
  ? setupMocks(
      {},
      {
        appInvoke: {
          async getSequences() {
            await delayedSuccess([500, 2000]);
            return sequences;
          },
          async setSequences(values: Partial<SequencesValues>) {
            await delayedSuccess([500, 2000]);
            Object.entries(values).forEach(([k, v]) => {
              (sequences as any)[k] = v;
            });
            console.log(values);
          },
          async getSettings() {
            await delayedSuccess([500, 2000]);
            return {
              "Aliquota Cassa": "0.04",
              "Aliquota IVA": "0.22",
              "Aliquota ritenuta": "0.2",
            };
          },
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
                projectName: "Progetto",
                serviceName: "Servizio",
                description: "Descrizione di cosa è stato fatto",
                start: new Date("2024-05-10 12:00"),
                end: new Date("2024-05-10 13:30"),
                multiplier: 1,
                billable: true,
                hourlyRate: 10,
              },
              {
                id: 2,
                clientName: "Cliente",
                projectName: "Progetto",
                serviceName: "Servizio",
                description: "Descrizione di cosa è stato fatto",
                start: new Date("2024-05-9 12:00"),
                end: new Date("2024-05-9 13:30"),
                multiplier: 3,
                billable: true,
                hourlyRate: 10,
              },
              {
                id: 3,
                clientName: "Cliente",
                projectName: "Progetto",
                serviceName: "Servizio",
                description: "Descrizione di cosa è stato fatto",
                start: new Date("2024-05-8 12:00"),
                end: new Date("2024-05-8 13:45"),
                multiplier: 1,
                billable: false,
                hourlyRate: 10,
              },
              ...new Array(10).fill(0).map((_, i) => ({
                id: 3 + i + 1,
                clientName: "Cliente",
                projectName: i % 2 == 0 ? "Progetto" : "Altro",
                serviceName: "Servizio",
                description: "Descrizione di cosa è stato fatto",
                start: new Date("2024-05-8 12:00"),
                end: new Date("2024-05-8 13:45"),
                multiplier: 1,
                billable: i % 3 == 0,
                hourlyRate: 10,
              })),
            ];
          },
          async emitInvoice(invoice: NewEmittedInvoiceType) {
            await delayedSuccess([500, 2000]);
            console.log(invoice);
          },
        },
      },
    )
  : null;

export default mocks;
