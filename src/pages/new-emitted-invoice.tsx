import { useQuery } from "@tanstack/react-query";
import client from "@/gas-client";
import {
  NewEmittedInvoiceType,
  emittedInvoiceSchema,
} from "@model/emitted-invoice";
import {
  UseFormReturn,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ActivityTable } from "@/components/shared/activity-table";
import { Spinner } from "@/components/shared/spinner";
import { activityFromSerializable } from "@server/actions/client-utils";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { activitiesToSoldItems } from "@model/activity-track";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type SoldItemInputProps = {
  index: number;
  form: UseFormReturn<NewEmittedInvoiceType>;
};

const SoldItemInput: React.FC<SoldItemInputProps> = ({ index, form }) => {
  return (
    <div className="flex space-x-2">
      <FormField
        control={form.control}
        name={`soldItems.${index}.description`}
        render={({ field }) => (
          <FormItem className="flex-grow">
            <FormLabel>Descrizione</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Descrizione" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`soldItems.${index}.unitCount`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantità</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Quantità" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`soldItems.${index}.unitPrice`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo Unitario</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Prezzo Unitario" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`soldItems.${index}.totalPrice`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prezzo Totale</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Prezzo Totale" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`soldItems.${index}.vatRate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aliquota IVA</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Aliquota IVA" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export const NewEmittedInvoice: React.FC = () => {
  const form = useForm<NewEmittedInvoiceType>({
    resolver: zodResolver(emittedInvoiceSchema),
    defaultValues: {
      date: new Date().toISOString().replace(/T.+$/, ""),
      activities: [],
    },
  });

  const soldItems = useFieldArray({ control: form.control, name: "soldItems" });
  const rounds = useQuery({
    queryKey: ["rounds"],
    queryFn: async () => (await client!.getRounds())[0].filter((p) => !p.end),
  });

  const roundId = useWatch({ control: form.control, name: "roundId" });

  const roundActivities = useQuery({
    queryKey: ["roundActivities", roundId],
    queryFn: async () =>
      (await client!.getRoundActivities(Number(roundId)))[0].map(
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

      const soldItems = activitiesToSoldItems(roundActivities.data!);
      form.setValue(
        "soldItems",
        soldItems.map((p) => ({ ...p, vatRate: 22 })),
      );
    }
  }, [roundActivities.data]);

  return (
    <>
      <h1>Nuova Fattura</h1>

      <EditForm
        form={form}
        onSave={async (newInvoice: NewEmittedInvoiceType) => {
          const [result] = await client!.emitInvoice(newInvoice);

          window.open(result.url, "_blank");

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
            soldItems.fields.map((field, index) => (
              <div
                key={field.id}
                className={cn(
                  "border rounded p-3",
                  field.totalPrice === 0 && "bg-slate-100",
                )}
              >
                <SoldItemInput form={form} index={index} />
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span>Dettaglio</span>
                      <CaretSortIcon className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-3">
                      <ActivityTable
                        title={`Attività`}
                        activities={(field as any).activities}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))
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
