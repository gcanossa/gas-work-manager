import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import client from "@/gas-client";
import { NewOrganizationType, organizationSchema } from "@model/organization";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import FormControls from "@/components/shared/form-control";

const NewClient: React.FC = () => {
  const [status, setStatus] = useState({
    submitted: false,
    error: null as string | null,
  });

  const form = useForm<NewOrganizationType>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      address: "",
      zipCode: "",
      city: "",
      province: "",
      country: "",
      vatNumber: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (newClient: NewOrganizationType) => {
      await client!.createClient(newClient);
    },
  });

  async function onSubmit(values: NewOrganizationType) {
    try {
      await mutation.mutateAsync(values);

      setStatus({ submitted: true, error: null });
      setTimeout(() => window.google.script.host.close(), 2000);
    } catch (e) {
      setStatus({ submitted: true, error: String(e) });
      setTimeout(() => window.google.script.host.close(), 2000);
    }
  }

  return (
    <>
      <h1>Nuovo Cliente</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome cliente" {...field} />
                </FormControl>
                <FormDescription>Nome del cliente</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indirizzo</FormLabel>
                <FormControl>
                  <Input placeholder="Indirizzo" {...field} />
                </FormControl>
                <FormDescription>Indirizzo del cliente</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CAP</FormLabel>
                <FormControl>
                  <Input placeholder="CAP" {...field} />
                </FormControl>
                <FormDescription>CAP del cliente</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Città</FormLabel>
                <FormControl>
                  <Input placeholder="Città" {...field} />
                </FormControl>
                <FormDescription>Città</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia (Sigla)</FormLabel>
                <FormControl>
                  <Input placeholder="Sigla della provincia" {...field} />
                </FormControl>
                <FormDescription>Sigla della provincia</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stato (Sigla)</FormLabel>
                <FormControl>
                  <Input placeholder="Sigla dello stato" {...field} />
                </FormControl>
                <FormDescription>Sigla dello stato</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>P.IVA</FormLabel>
                <FormControl>
                  <Input placeholder="P.IVA" {...field} />
                </FormControl>
                <FormDescription>P.IVA del cliente</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormControls
            submitted={status.submitted}
            error={status.error}
            isPending={mutation.isPending}
            submitText="Crea"
            cancelText="Annulla"
            successText="Cliente creato con successo."
          />
        </form>
      </Form>
    </>
  );
};

export default NewClient;
