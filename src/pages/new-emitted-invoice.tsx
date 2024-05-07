import { useQuery } from "@tanstack/react-query";
import client from "@/gas-client";
import {
  NewEmittedInvoiceType,
  emittedInvoiceSchema,
} from "@model/emitted-invoice";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditForm } from "@/components/shared/edit-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActivityTable } from "@/components/shared/activity-table";
import { Spinner } from "@/components/shared/spinner";
import { activityFromSerializable } from "@server/actions/client-utils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { groupActivitiesByProject } from "@model/activity-track";

export const NewEmittedInvoice: React.FC = () => {
  const form = useForm<NewEmittedInvoiceType>({
    resolver: zodResolver(emittedInvoiceSchema),
    defaultValues: {
      date: new Date().toISOString().replace(/T.+$/, ""),
      activities: [],
    },
  });

  const rounds = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => (await client!.getRounds())[0],
  });

  const roundId = useWatch({ control: form.control, name: "roundId" });

  const roundActivities = useQuery({
    queryKey: ["roundActivities", roundId],
    queryFn: async () =>
      (await client!.getRoundActivities(roundId))[0].map(
        activityFromSerializable,
      ),
    enabled: roundId !== undefined,
  });

  useEffect(() => {
    if (roundActivities.data !== undefined) {
      form.setValue(
        "activities",
        roundActivities.data!.map((p) => p.id),
      );
    }
  }, [roundActivities.data]);

  return (
    <>
      <h1>Nuova Fattura</h1>

      <EditForm
        form={form}
        onSave={async (newInvoice: NewEmittedInvoiceType) => {
          await client!.emitInvoice(newInvoice);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Crea"
        successText="Fattura creata con successo."
      >
        <FormField
          control={form.control}
          name="roundId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Round</FormLabel>
              <Select
                onValueChange={field.onChange}
                disabled={rounds.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    {rounds.isPending ? (
                      "Caricamento..."
                    ) : (
                      <SelectValue placeholder="Seleziona un round" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {rounds.data &&
                    rounds.data.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.clientName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Attività</FormLabel>
          {!roundActivities.data ? (
            roundActivities.isFetching ? (
              <div className="flex items-center">
                <Spinner className="text-slate mx-1" /> Caricamento attività
              </div>
            ) : (
              <div>Seleziona un Round</div>
            )
          ) : (
            Object.entries(groupActivitiesByProject(roundActivities.data!)).map(
              ([k, v]) => (
                <ActivityTable
                  key={k}
                  title={`Attività - ${k}`}
                  activities={v}
                />
              ),
            )
          )}
        </FormItem>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Fattura</FormLabel>
              <FormControl>
                <Input type="date" {...field} placeholder="Data Fattura" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="socialSecurityFundRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aliquota Cassa Previdenziale</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Aliquota Cassa Previdenziale"
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vatRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aliquota IVA</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="Aliquota IVA" />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="withholdingTaxRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aliquota Ritenuta</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder="Aliquota Ritenuta"
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </EditForm>
    </>
  );
};

export default NewEmittedInvoice;
