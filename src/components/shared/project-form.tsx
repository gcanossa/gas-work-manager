import { useFormContext } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { NewProjectType } from "@model/project";
import { OrganizationType } from "@model/organization";

export type ProjectFormProps = {
  clients: { isPending: boolean; data: OrganizationType[] | undefined };
};

export const ProjectForm: React.FC<ProjectFormProps> = ({ clients }) => {
  const form = useFormContext<NewProjectType>();

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
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cliente</FormLabel>
            <Select onValueChange={field.onChange} disabled={clients.isPending}>
              <FormControl>
                <SelectTrigger>
                  {clients.isPending ? (
                    "Caricamento..."
                  ) : (
                    <SelectValue placeholder="Seleziona un cliente" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {clients.data &&
                  clients.data.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
