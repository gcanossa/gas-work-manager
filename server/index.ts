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
    .addToUi();
}

function viewOpenReact(route?: string) {
  var template = HtmlService.createTemplateFromFile("ui/app/index");

  template.initialRoute = route ?? undefined;

  var html = template.evaluate();
  SpreadsheetApp.getUi().showSidebar(html);
}

export function view_newClient() {
  viewOpenReact("new-client");
}

export function view_newProject() {
  viewOpenReact("new-project");
}
