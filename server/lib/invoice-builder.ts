import {
  EmittedInvoiceType,
  NewEmittedInvoiceSoldItemType,
} from "@model/emitted-invoice";
import { OrganizationType } from "@model/organization";
import { SettingsKeys } from "@model/types";
import { format } from "date-fns";

export function createXmlItemDetail(
  itemIndex: number,
  item: NewEmittedInvoiceSoldItemType,
) {
  return `
  <DettaglioLinee>
    <NumeroLinea>${itemIndex + 1}</NumeroLinea>
    <Descrizione>${item.description}</Descrizione>
    <Quantita>${item.unitCount.toFixed(2)}</Quantita>
    <PrezzoUnitario>${item.unitPrice.toFixed(2)}</PrezzoUnitario>
    <PrezzoTotale>${(item.unitCount * item.unitPrice).toFixed(2)}</PrezzoTotale>
    <AliquotaIVA>${item.vatRate.toFixed(2)}</AliquotaIVA>
  </DettaglioLinee>`;
}

export function createXmlInvoice(
  client: OrganizationType,
  settings: Record<string, string>,
  soldItems: NewEmittedInvoiceSoldItemType[],
  invoice: EmittedInvoiceType,
) {
  return `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <ns2:FatturaElettronica xmlns:ns2="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" versione="FPR12">
    <FatturaElettronicaHeader>
      <DatiTrasmissione>
        <IdTrasmittente>
          <IdPaese>${settings[SettingsKeys.Nation].toUpperCase()}</IdPaese>
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
          <Data>${format(invoice.date, "yyyy-MM-dd")}</Data>
          <Numero>${invoice.invoiceNumber}</Numero>
          <DatiRitenuta>
            <TipoRitenuta>RT01</TipoRitenuta>
            <ImportoRitenuta>${invoice.withholdingTaxAmount.toFixed(2)}</ImportoRitenuta>
            <AliquotaRitenuta>${Number(settings[SettingsKeys.WithholdingTaxRate]) * 100}</AliquotaRitenuta>
            <CausalePagamento>A</CausalePagamento>
          </DatiRitenuta>
          <DatiCassaPrevidenziale>
            <TipoCassa>TC22</TipoCassa>
            <AlCassa>${Number(settings[SettingsKeys.SocialSecurityFundRate]) * 100}</AlCassa>
            <ImportoContributoCassa>${invoice.socialSecurityFundAmount.toFixed(2)}</ImportoContributoCassa>
            <AliquotaIVA>${Number(settings[SettingsKeys.VatRate]) * 100}</AliquotaIVA>
            <Ritenuta>SI</Ritenuta>
          </DatiCassaPrevidenziale>
          <ImportoTotaleDocumento>${invoice.total.toFixed()}</ImportoTotaleDocumento>
        </DatiGeneraliDocumento>
      </DatiGenerali>
      <DatiBeniServizi>
        ${soldItems.map((p, idx) => createXmlItemDetail(idx, p)).join("")}
        <DatiRiepilogo>
          <AliquotaIVA>${Number(settings[SettingsKeys.VatRate]) * 100}</AliquotaIVA>
          <ImponibileImporto>${invoice.taxableAmount.toFixed(2)}</ImponibileImporto>
          <Imposta>${invoice.vatAmount.toFixed(2)}</Imposta>
        </DatiRiepilogo>
      </DatiBeniServizi>
      <DatiPagamento>
        <CondizioniPagamento>TP02</CondizioniPagamento>
        <DettaglioPagamento>
          <ModalitaPagamento>MP05</ModalitaPagamento>
          <DataRiferimentoTerminiPagamento>${format(invoice.date, "yyyy-MM-dd")}</DataRiferimentoTerminiPagamento>
          <ImportoPagamento>${invoice.dueAmount.toFixed(2)}</ImportoPagamento>
        </DettaglioPagamento>
      </DatiPagamento>
    </FatturaElettronicaBody>
  </ns2:FatturaElettronica>`;
}
