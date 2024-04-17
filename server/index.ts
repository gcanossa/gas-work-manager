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
    .addToUi();
}

export function view_newClient() {
  var template = HtmlService.createTemplateFromFile("ui/app/index");

  template.initialRoute = "new-client";

  var html = template.evaluate().setWidth(500);
  SpreadsheetApp.getUi().showSidebar(html);
}
