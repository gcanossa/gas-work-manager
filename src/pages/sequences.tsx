import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import client from "@/gas-client";
import { EditForm } from "@/components/shared/edit-form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const model = z.object({
  clients_id: z.coerce.number().min(0),
  projects_id: z.coerce.number().min(0),
});

export const Sequences: React.FC = () => {
  const settings = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      return await client?.getSequences();
    },
  });

  const form = useForm<z.infer<typeof model>>({
    resolver: zodResolver(model),
    values: { ...(settings.data?.[0] ?? { clients_id: 0, projects_id: 0 }) },
  });

  return (
    <>
      <h1>Impostazioni</h1>

      <EditForm
        form={form}
        onSave={async (values) => {
          await client!.setSequences(values);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Salva"
        successText="Impostazioni salvate con successo."
      >
        <FormField
          disabled={settings.isPending}
          control={form.control}
          name="clients_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sequenza Id Clienti</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder={
                    settings.isPending
                      ? "Caricamento..."
                      : "Sequenza Id Clienti"
                  }
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={settings.isPending}
          control={form.control}
          name="projects_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sequenza Id Progetti</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  placeholder={
                    settings.isPending
                      ? "Caricamento..."
                      : "Sequenza Id Progetti"
                  }
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </EditForm>
    </>
  );
};

export default Sequences;
