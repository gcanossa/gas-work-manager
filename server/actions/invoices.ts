import { createContext, insertFirst, read, updateAt } from "@gasstack/db";
import { getFolderByPath } from "@gasstack/fs";
import {
  EmittedInvoiceType,
  NewEmittedInvoiceSoldItemType,
  NewEmittedInvoiceType,
} from "@model/emitted-invoice";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { clientOrgCtx, emittedInvoiceCtx, roundCtx } from "@server/contexts";
import { getAppRootFolder } from "./server-utils";
import { getRoundActivities } from "./rounds";
import { intervalToHours, numberToPrecision } from "@/lib/utils";
import { getSettings } from "./settings";
import { reportModel } from "@model/report";
import { OrganizationType } from "@model/organization";
import { format } from "date-fns";

export function emitInvoice(invoice: NewEmittedInvoiceType) {
  const rounds = read(roundCtx);
  const roundIdx = rounds.findIndex((p) => p.id === invoice.roundId);
  const round = rounds[roundIdx];
  const settings = getSettings();
  const client = read(clientOrgCtx).find((p) => p.id === round.clientId);

  const activities = getRoundActivities(round!.id)
    .filter((p) => p.billable && invoice.activities.includes(p.id))
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

  const total = invoice.soldItems.reduce((acc, p) => acc + p.totalPrice, 0);

  const newInvoice = insertFirst(emittedInvoiceCtx, {
    roundId: invoice.roundId,
    date: new Date(invoice.date),
    total: total,
    socialSecurityFundRate: Number(
      settings[SettingsKeys.SocialSecurityFundRate],
    ),
    vatRate: Number(settings[SettingsKeys.VatRate]),
    withholdingTaxRate: Number(settings[SettingsKeys.WithholdingTaxRate]),
    driveItem: {
      url: `https://drive.google.com/drive/folders/${newFolder?.getId()}`,
      label: "Cartella",
    },
  })[0];

  updateAt(roundCtx, { end: new Date() }, roundIdx);

  //TODO: crea report
  const ssReport = SpreadsheetApp.create("Rendicontazione");
  DriveApp.getFileById(ssReport.getId()).moveTo(newFolder);
  const firstSheet = ssReport.getSheets()[0];

  const reportCtx = createContext<typeof reportModel>(
    ssReport,
    { a1NotationRange: `${firstSheet.getName()}!A2:J2` },
    reportModel,
  );

  firstSheet
    .getRange(1, 1, 1, 10)
    .setValues([
      [
        "Cliente",
        "Progetto",
        "Servizio",
        "Descrizione",
        "Inizio",
        "Fine",
        "Durata",
        "Moltiplicatore",
        "Tariffa",
        "Totale",
      ],
    ]);

  insertFirst(
    reportCtx,
    activities.map((p) => ({
      clientName: p.clientName,
      projectName: p.projectName,
      serviceName: p.serviceName,
      description: p.description,
      start: p.start,
      end: p.end,
      duration: p.duration,
      multiplier: p.multiplier,
      hourlyRate: p.hourlyRate,
      totalAmount: numberToPrecision(
        p.duration * p.hourlyRate * p.multiplier,
        2,
      ),
    })),
  );

  //TODO: create invoice xml from template
  newFolder
    .createFile(
      "Base_Fattura.xml",
      createXmlInvoice(client!, settings, invoice.soldItems, newInvoice),
    )
    .moveTo(newFolder);
}

function createXmlItemDetail(
  itemIndex: number,
  item: NewEmittedInvoiceSoldItemType,
) {
  return `<DettaglioLinee>
<NumeroLinea>${itemIndex + 1}</NumeroLinea>
<Descrizione>${item.description}</Descrizione>
<Quantita>${item.unitCount.toFixed(2)}</Quantita>
<PrezzoUnitario>${item.unitPrice.toFixed(2)}</PrezzoUnitario>
<PrezzoTotale>${(item.unitCount * item.unitPrice).toFixed(2)}</PrezzoTotale>
<AliquotaIVA>${item.vatRate.toFixed(2)}</AliquotaIVA>
</DettaglioLinee>`;
}

function createXmlInvoice(
  client: OrganizationType,
  settings: Record<string, string>,
  soldItems: NewEmittedInvoiceSoldItemType[],
  invoice: EmittedInvoiceType,
) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <ns2:FatturaElettronica xmlns:ns2="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" versione="FPR12">
    <FatturaElettronicaHeader>
      <DatiTrasmissione>
        <IdTrasmittente>
          <IdPaese>${client.country.toUpperCase()}</IdPaese>
          <IdCodice>${settings[SettingsKeys.FiscalCode]}</IdCodice>
        </IdTrasmittente>
        <ProgressivoInvio></ProgressivoInvio>
        <FormatoTrasmissione>FPR12</FormatoTrasmissione>
        <CodiceDestinatario></CodiceDestinatario>
      </DatiTrasmissione>
      <CedentePrestatore>
        <DatiAnagrafici>
          <IdFiscaleIVA>
            <IdPaese>${settings[SettingsKeys.Nation]}</IdPaese>
            <IdCodice>${settings[SettingsKeys.VatNumber]}</IdCodice>
          </IdFiscaleIVA>
          <CodiceFiscale>${settings[SettingsKeys.FiscalCode]}</CodiceFiscale>
          <Anagrafica>
            <Nome>${settings[SettingsKeys.Name]}</Nome>
            <Cognome>${settings[SettingsKeys.Surname]}</Cognome>
          </Anagrafica>
          <RegimeFiscale>${settings[SettingsKeys.TaxRegime]}</RegimeFiscale>
        </DatiAnagrafici>
        <Sede>
          <Indirizzo>${settings[SettingsKeys.Address]}</Indirizzo>
          <NumeroCivico>${settings[SettingsKeys.CivicNumber]}</NumeroCivico>
          <CAP>${settings[SettingsKeys.ZipCode]}</CAP>
          <Comune>${settings[SettingsKeys.City]}</Comune>
          <Provincia>${settings[SettingsKeys.Province]}</Provincia>
          <Nazione>${settings[SettingsKeys.Nation]}</Nazione>
        </Sede>
      </CedentePrestatore>
      <CessionarioCommittente>
        <DatiAnagrafici>
          <IdFiscaleIVA>
            <IdPaese>${client.country}</IdPaese>
            <IdCodice>${client.vatNumber}</IdCodice>
          </IdFiscaleIVA>
          <CodiceFiscale>${client.vatNumber}</CodiceFiscale>
          <Anagrafica>
            <Denominazione>${client.name}</Denominazione>
          </Anagrafica>
        </DatiAnagrafici>
        <Sede>
          <Indirizzo>${client.address}</Indirizzo>
          <CAP>${client.zipCode}</CAP>
          <Comune>${client.city}</Comune>
          <Provincia>${client.province}</Provincia>
          <Nazione>${client.country}</Nazione>
        </Sede>
      </CessionarioCommittente>
    </FatturaElettronicaHeader>
    <FatturaElettronicaBody>
      <DatiGenerali>
        <DatiGeneraliDocumento>
          <TipoDocumento>TD06</TipoDocumento>
          <Divisa>EUR</Divisa>
          <Data>${format(invoice.date, "YYYY-MM-dd")}</Data>
          <Numero>${invoice.id}/${format(invoice.date, "YYYY")}</Numero>
          <DatiRitenuta>
            <TipoRitenuta>RT01</TipoRitenuta>
            <ImportoRitenuta>${invoice.withholdingTaxAmount}</ImportoRitenuta>
            <AliquotaRitenuta>${settings[SettingsKeys.WithholdingTaxRate]}</AliquotaRitenuta>
            <CausalePagamento>A</CausalePagamento>
          </DatiRitenuta>
          <DatiCassaPrevidenziale>
            <TipoCassa>TC22</TipoCassa>
            <AlCassa>${settings[SettingsKeys.SocialSecurityFundRate]}</AlCassa>
            <ImportoContributoCassa>${invoice.socialSecurityFundAmount}</ImportoContributoCassa>
            <AliquotaIVA>${settings[SettingsKeys.VatRate]}</AliquotaIVA>
            <Ritenuta>SI</Ritenuta>
          </DatiCassaPrevidenziale>
          <ImportoTotaleDocumento>${invoice.total}</ImportoTotaleDocumento>
        </DatiGeneraliDocumento>
      </DatiGenerali>
      <DatiBeniServizi>
        ${soldItems.map((p, idx) => createXmlItemDetail(idx, p)).join("")}
        <DatiRiepilogo>
          <AliquotaIVA>${settings[SettingsKeys.VatRate]}</AliquotaIVA>
          <ImponibileImporto>${invoice.taxableAmount}</ImponibileImporto>
          <Imposta>${invoice.vatAmount}</Imposta>
        </DatiRiepilogo>
      </DatiBeniServizi>
      <DatiPagamento>
        <CondizioniPagamento>TP02</CondizioniPagamento>
        <DettaglioPagamento>
          <ModalitaPagamento>MP05</ModalitaPagamento>
          <DataRiferimentoTerminiPagamento>${format(invoice.date, "YYYY-MM-dd")}</DataRiferimentoTerminiPagamento>
          <ImportoPagamento>${invoice.dueAmount}</ImportoPagamento>
        </DettaglioPagamento>
      </DatiPagamento>
    </FatturaElettronicaBody>
  </ns2:FatturaElettronica>`;
}
