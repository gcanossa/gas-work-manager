import { useFormContext, useWatch } from "react-hook-form";
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
import { RoundType } from "@model/round";
import { NewEmittedInvoiceType } from "@model/emitted-invoice";

export type InvoiceFormProps = {
  rounds: { isPending: boolean; data: RoundType[] | undefined };
};

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ rounds }) => {
  const form = useFormContext<NewEmittedInvoiceType>();

  const roundId = useWatch({ control: form.control, name: "roundId" });

  return (
    <>
      <FormField
        control={form.control}
        name="roundId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Round</FormLabel>
            <Select onValueChange={field.onChange} disabled={rounds.isPending}>
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
      {roundId && "ho il round"}
    </>
  );
};
