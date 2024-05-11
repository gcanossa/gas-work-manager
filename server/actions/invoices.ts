import {
  createContext,
  insertFirst,
  querySortedRange,
  read,
  updateAt,
} from "@gasstack/db";
import { getFolderByPath } from "@gasstack/fs";
import { NewEmittedInvoiceType } from "@model/emitted-invoice";
import { DriveFoldersNames, SettingsKeys } from "@model/types";
import { clientOrgCtx, emittedInvoiceCtx, roundCtx } from "@server/contexts";
import { getAppRootFolder } from "./server-utils";
import { getRoundActivities } from "./rounds";
import { intervalToHours, numberToPrecision } from "@/lib/utils";
import { getSettings } from "./settings";
import { reportModel } from "@model/report";
import { createXmlInvoice } from "../lib/invoice-builder";

export function emitInvoice(invoice: NewEmittedInvoiceType) {
  const rounds = read(roundCtx);
  const roundIdx = rounds.findIndex((p) => p.id === invoice.roundId);
  const round = rounds[roundIdx];
  const settings = getSettings();
  const client = read(clientOrgCtx).find((p) => p.id === round.clientId);

  const now = new Date();
  const invoiceCount = querySortedRange(
    emittedInvoiceCtx,
    "date",
    {
      min: new Date(now.getFullYear(), 0),
      max: new Date(new Date(now.getFullYear() + 1, 0).getTime() - 1),
    },
    "desc",
  ).length;
  const invoiceNumber = `${invoiceCount + 1}_${now.getFullYear()}`;

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
    `${round!.id}@${invoiceNumber}`,
  );

  emittedInvoicesFolder!
    .createShortcut(newFolder.getId())
    .setName(`${round!.clientName}_${newFolder.getName()}`);

  const total = invoice.soldItems.reduce((acc, p) => acc + p.totalPrice, 0);

  const newInvoice = insertFirst(emittedInvoiceCtx, {
    invoiceNumber: invoiceNumber,
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
    ])
    .setBackground("gray")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

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
  // const downloadUrl = newFolder
  //   .createFile(
  //     "Base_Fattura.xml",
  //     createXmlInvoice(client!, settings, invoice.soldItems, newInvoice),
  //   )
  //   .moveTo(newFolder)
  //   .getDownloadUrl();

  // return { url: downloadUrl, name: "Base_Fattura.xml" };
}
