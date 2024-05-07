import { createEndpoint } from "@gasstack/rpc";
import serverApi from "./app";

const endpoint = createEndpoint(serverApi);
export type ServerApiType = typeof serverApi;

export function appInvoke(fnName: string, ...params: any[]): any {
  return endpoint.invoke(fnName, ...params);
}

export function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu("Partita IVA")
    .addItem("Nuovo Cliente", "view_newClient")
    .addItem("Nuovo Progetto", "view_newProject")
    .addItem("Rendiconta Attività", "view_trackActivity")
    .addItem("Emetti Fattura", "view_newEmittedInvoice")
    .addSeparator()
    .addItem("Resetta Sequenze", "view_sequences")
    .addToUi();
}

function viewOpenReact(route?: string) {
  var template = HtmlService.createTemplateFromFile("ui/app/index");

  template.initialRoute = route ?? undefined;

  var html = template.evaluate();
  SpreadsheetApp.getUi().showSidebar(html);
}

function viewOpenWindow(
  title: string,
  width: number,
  height: number,
  route?: string,
) {
  var template = HtmlService.createTemplateFromFile("ui/app/index");

  template.initialRoute = route ?? undefined;

  var html = template.evaluate();

  SpreadsheetApp.getUi().showModalDialog(
    html.setHeight(height).setWidth(width),
    title,
  );
}

export function view_newClient() {
  viewOpenReact("new-client");
}

export function view_newProject() {
  viewOpenReact("new-project");
}

export function view_trackActivity() {
  viewOpenReact("track-activity");
}

export function view_sequences() {
  viewOpenReact("sequences");
}
export function view_newEmittedInvoice() {
  viewOpenWindow("Emetti Fattura", (16 * 800) / 9, 800, "new-emitted-invoice");
}
