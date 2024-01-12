import { createGasApp } from "@gcanossa/gas-app/server";
import appConfig from "./app";

const app = createGasApp(appConfig);
export type appAPI = typeof appConfig;

export function appInvoke(name: string, ...params: any[]): any {
  return app.invoke(name, ...params);
}

export function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu("Partita IVA")
    .addItem("Carica Fattura Emessa", "loadEmittedInvoice_view")
    .addToUi();
}

export function loadEmittedInvoice_view() {
  var template = HtmlService.createTemplateFromFile("ui/app/index");

  var html = template.evaluate().setWidth(500).setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, "Aggiungi");
}
