import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewOrganizationType } from "@model/organization";

export const OrganizationForm: React.FC = () => {
  const form = useFormContext<NewOrganizationType>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nome del cliente" />
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
              <Input {...field} placeholder="Indirizzo del cliente" />
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
              <Input {...field} placeholder="CAP del cliente" />
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
              <Input {...field} placeholder="Città del cliente" />
            </FormControl>
            <FormDescription>Città del cliente</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Provincia</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Sigla della provincia" />
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
            <FormLabel>Stato</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Sigla dello stato" />
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
              <Input {...field} placeholder="P.IVA del cliente" />
            </FormControl>
            <FormDescription>P.IVA del cliente</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
