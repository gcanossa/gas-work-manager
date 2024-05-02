import { useQuery } from "@tanstack/react-query";
import client from "@/gas-client";
import { Spinner } from "@/components/shared/spinner";
import {
  NewEmittedInvoiceType,
  emittedInvoiceSchema,
} from "@model/emitted-invoice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditForm } from "@/components/shared/edit-form";
import { InvoiceForm } from "@/components/shared/invoice-form";

export const NewInvoice: React.FC = () => {
  const form = useForm<NewEmittedInvoiceType>({
    resolver: zodResolver(emittedInvoiceSchema),
    defaultValues: {
      date: new Date().toISOString(),
      socialSecurityFundRate: 4,
      vatRate: 22,
      withholdingTaxRate: 20,
    },
  });

  const rounds = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => (await client!.getRounds())[0],
  });

  return (
    <>
      <h1>Nuovo Cliente</h1>

      <EditForm
        form={form}
        onSave={async (newInvoice: NewEmittedInvoiceType) => {
          // await client!.createClient(newInvoice);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Crea"
        successText="Fattura creata con successo."
      >
        <InvoiceForm
          rounds={{
            isPending: rounds.isPending,
            data: rounds.data?.map((p) => ({
              ...p,
              start: new Date(p.start!),
              end: p.end === null ? null : new Date(p.end!),
            })),
          }}
        />
      </EditForm>
    </>
  );
};

export default NewInvoice;
