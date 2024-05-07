import { insertFirst, read, updateAt } from "@gasstack/db";
import { getFolderByPath } from "@gasstack/fs";
import { NewEmittedInvoiceType } from "@model/emitted-invoice";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { emittedInvoiceCtx, roundCtx } from "@server/contexts";
import { getAppRootFolder } from "./server-utils";
import { getRoundActivities } from "./rounds";
import { intervalToHours } from "@/lib/utils";
import {
  ActivityTrackType,
  groupActivitiesByProject,
} from "@model/activity-track";
import { OrganizationType } from "@model/organization";
import { SettingsType } from "@model/settings";

export function emitInvoice(invoice: NewEmittedInvoiceType) {
  const rounds = read(roundCtx);
  const roundIdx = rounds.findIndex((p) => p.id === invoice.roundId);
  const round = rounds[roundIdx];

  const activities = getRoundActivities(round!.id)
    .filter((p) => invoice.activities.includes(p.id))
    .map((p) => ({
      ...p,
      start: new Date(p.start),
      end: new Date(p.end),
      duration: intervalToHours(new Date(p.start), new Date(p.end), 2),
    }));

  const folderRoot = getAppRootFolder();

  const clientEmitteInvoicesFolder = getFolderByPath(folderRoot, [
    DriveFoldersNames.Clients,
    round!.clientName,
    DriveFoldersNames.EmittedInvoices,
  ]);
  const emittedInvoicesFolder = getFolderByPath(folderRoot, [
    DriveFoldersNames.EmittedInvoices,
  ]);

  const newFolder = clientEmitteInvoicesFolder!.createFolder(
    `${new Date().toISOString().replace(/T.+$/, "")} / ${round!.id}`,
  );

  emittedInvoicesFolder!
    .createShortcut(newFolder.getId())
    .setName(`${round!.clientName} / ${newFolder.getName()}`);

  const total = activities.reduce(
    (acc, p) => acc + p.multiplier * p.hourlyRate * p.duration,
    0,
  );

  const newInvoice = insertFirst(emittedInvoiceCtx, {
    roundId: invoice.roundId,
    date: new Date(invoice.date),
    total: total,
    socialSecurityFundRate: invoice.socialSecurityFundRate,
    vatRate: invoice.vatRate,
    withholdingTaxRate: invoice.withholdingTaxRate,
    driveItem: {
      url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
      label: "Cartella",
    },
  })[0];

  updateAt(roundCtx, { end: new Date() }, roundIdx);

  //TODO: crea report

  // const groups = groupActivitiesByProject(activities);

  //TODO: create invoice xml from template

  //TODO: dividere in beni...
}

// function createXmlItemDetail(
//   itemIndex: number,
//   units: { count: number; price: number },
//   vatRate: number,
//   description: string,
// ) {
//   return `<DettaglioLinee>
// <NumeroLinea>${itemIndex + 1}</NumeroLinea>
// <Descrizione>${description}</Descrizione>
// <Quantita>${unitCount.toFixed(2)}</Quantita>
// <PrezzoUnitario>${unitPrice.toFixed(2)}</PrezzoUnitario>
// <PrezzoTotale>${(unitCount * unitPrice).toFixed(2)}</PrezzoTotale>
// <AliquotaIVA>${vatRate.toFixed(2)}</AliquotaIVA>
// </DettaglioLinee>`;
// }

// function createXmlInvoice(
//   client: OrganizationType,
//   settings: Record<string, string>,
//   groups: Record<string, ActivityTrackType[]>,
// ) {
//   return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
//   <ns2:FatturaElettronica xmlns:ns2="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" versione="FPR12">
//     <FatturaElettronicaHeader>
//       <DatiTrasmissione>
//         <IdTrasmittente>
//           <IdPaese>${client.country.toUpperCase()}</IdPaese>
//           <IdCodice>${settings[SettingsKeys.FiscalCode]}</IdCodice>
//         </IdTrasmittente>
//         <ProgressivoInvio></ProgressivoInvio>
//         <FormatoTrasmissione>FPR12</FormatoTrasmissione>
//         <CodiceDestinatario></CodiceDestinatario>
//       </DatiTrasmissione>
//       <CedentePrestatore>
//         <DatiAnagrafici>
//           <IdFiscaleIVA>
//             <IdPaese>${settings[SettingsKeys.Nation]}</IdPaese>
//             <IdCodice>${settings[SettingsKeys.VatNumber]}</IdCodice>
//           </IdFiscaleIVA>
//           <CodiceFiscale>${settings[SettingsKeys.FiscalCode]}</CodiceFiscale>
//           <Anagrafica>
//             <Nome>${settings[SettingsKeys.Name]}</Nome>
//             <Cognome>${settings[SettingsKeys.Surname]}</Cognome>
//           </Anagrafica>
//           <RegimeFiscale>${settings[SettingsKeys.TaxRegime]}</RegimeFiscale>
//         </DatiAnagrafici>
//         <Sede>
//           <Indirizzo>${settings[SettingsKeys.Address]}</Indirizzo>
//           <NumeroCivico>${settings[SettingsKeys.CivicNumber]}</NumeroCivico>
//           <CAP>${settings[SettingsKeys.ZipCode]}</CAP>
//           <Comune>${settings[SettingsKeys.City]}</Comune>
//           <Provincia>${settings[SettingsKeys.Province]}</Provincia>
//           <Nazione>IT</Nazione>
//         </Sede>
//       </CedentePrestatore>
//       <CessionarioCommittente>
//         <DatiAnagrafici>
//           <IdFiscaleIVA>
//             <IdPaese>${client.country}</IdPaese>
//             <IdCodice>${client.vatNumber}</IdCodice>
//           </IdFiscaleIVA>
//           <CodiceFiscale>${client.vatNumber}</CodiceFiscale>
//           <Anagrafica>
//             <Denominazione>${client.name}</Denominazione>
//           </Anagrafica>
//         </DatiAnagrafici>
//         <Sede>
//           <Indirizzo>${client.address}</Indirizzo>
//           <CAP>${client.zipCode}</CAP>
//           <Comune>${client.city}</Comune>
//           <Provincia>${client.province}</Provincia>
//           <Nazione>${client.country}</Nazione>
//         </Sede>
//       </CessionarioCommittente>
//     </FatturaElettronicaHeader>
//     <FatturaElettronicaBody>
//       <DatiGenerali>
//         <DatiGeneraliDocumento>
//           <TipoDocumento>TD06</TipoDocumento>
//           <Divisa>EUR</Divisa>
//           <Data>2023-04-03</Data>
//           <Numero>02/2023</Numero>
//           <DatiRitenuta>
//             <TipoRitenuta>RT01</TipoRitenuta>
//             <ImportoRitenuta>517.92</ImportoRitenuta>
//             <AliquotaRitenuta>20.00</AliquotaRitenuta>
//             <CausalePagamento>A</CausalePagamento>
//           </DatiRitenuta>
//           <DatiCassaPrevidenziale>
//             <TipoCassa>TC22</TipoCassa>
//             <AlCassa>4.00</AlCassa>
//             <ImportoContributoCassa>99.60</ImportoContributoCassa>
//             <AliquotaIVA>22.00</AliquotaIVA>
//             <Ritenuta>SI</Ritenuta>
//           </DatiCassaPrevidenziale>
//           <ImportoTotaleDocumento>3159.31</ImportoTotaleDocumento>
//         </DatiGeneraliDocumento>
//       </DatiGenerali>
//       <DatiBeniServizi>
//         ${Object.entries(groups)
//           .map(([k, v], idx) => createXmlItemDetail(idx, v.map(t => ({count:t.d}))))
//           .join("")}
//         <DettaglioLinee>
//           <NumeroLinea>1</NumeroLinea>
//           <Descrizione>Servizi di consulenza informatica e di formazione dal 01/01/2023 al 31/03/2023 per un numero di ore pari a 86:45:00</Descrizione>
//           <Quantita>28.00</Quantita>
//           <PrezzoUnitario>45.00</PrezzoUnitario>
//           <PrezzoTotale>1260.00</PrezzoTotale>
//           <AliquotaIVA>22.00</AliquotaIVA>
//         </DettaglioLinee>
//         <DettaglioLinee>
//           <NumeroLinea>2</NumeroLinea>
//           <Descrizione>Attività di analisi e sviluppo di software di visualizzazione dati per monitoraggio gestione commesse</Descrizione>
//           <Quantita>1.00</Quantita>
//           <PrezzoUnitario>600.00</PrezzoUnitario>
//           <PrezzoTotale>600.00</PrezzoTotale>
//           <AliquotaIVA>22.00</AliquotaIVA>
//         </DettaglioLinee>
//         <DettaglioLinee>
//           <NumeroLinea>3</NumeroLinea>
//           <Descrizione>Serivizi di consulenza, analisi, progettazione, stesura documentazione e sviluppo di strumenti automatici per l'applicazioni di regole del controllo di accesso ai dati aziendali</Descrizione>
//           <Quantita>14.00</Quantita>
//           <PrezzoUnitario>45.00</PrezzoUnitario>
//           <PrezzoTotale>630.00</PrezzoTotale>
//           <AliquotaIVA>22.00</AliquotaIVA>
//         </DettaglioLinee>
//         <DatiRiepilogo>
//           <AliquotaIVA>22.00</AliquotaIVA>
//           <ImponibileImporto>2589.60</ImponibileImporto>
//           <Imposta>569.71</Imposta>
//         </DatiRiepilogo>
//       </DatiBeniServizi>
//       <DatiPagamento>
//         <CondizioniPagamento>TP02</CondizioniPagamento>
//         <DettaglioPagamento>
//           <ModalitaPagamento>MP05</ModalitaPagamento>
//           <DataRiferimentoTerminiPagamento>2023-04-03</DataRiferimentoTerminiPagamento>
//           <ImportoPagamento>2641.40</ImportoPagamento>
//         </DettaglioPagamento>
//       </DatiPagamento>
//     </FatturaElettronicaBody>
//   </ns2:FatturaElettronica>`;
// }
