import { Button } from "@/components/ui/button";
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

const NewClient: React.FC = () => {
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
    await mutation.mutateAsync(values);
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
          <div className="flex">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Crea
            </Button>
            <Button
              type="reset"
              onClick={() => window.google.script.host.close()}
              className="ml-3"
              variant="destructive"
              disabled={mutation.isPending}
            >
              Annulla
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default NewClient;
