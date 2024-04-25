import { EditForm } from "@/components/shared/edit-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewProjectType, projectSchema } from "@model/project";
import { useFieldArray, useForm } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import client from "@/gas-client";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "@/components/shared/project-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { serviceSchema } from "@model/service";
import { useEffect } from "react";
import { Spinner } from "@/components/shared/spinner";

const newProjectServiceSchema = serviceSchema.omit({ projectId: true });
type NewProjectService = z.infer<typeof newProjectServiceSchema>;

const schema = projectSchema.extend({
  services: z
    .array(newProjectServiceSchema)
    .nonempty("Scegli almeno un servizio"),
});

type NewProjectFormType = NewProjectType & { services: NewProjectService[] };

export const NewProject: React.FC = () => {
  const form = useForm<NewProjectFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const serviceArray = useFieldArray({
    control: form.control,
    name: "services",
  });

  const clients = useQuery({
    queryKey: ["clients"],
    queryFn: async () => (await client!.getClients())[0],
  });
  const serviceTypes = useQuery({
    queryKey: ["serviceTypes"],
    queryFn: async () => (await client!.getServiceTypes())[0],
  });

  useEffect(() => {
    if (!!serviceTypes.data) {
      for (let item of serviceTypes.data.filter(
        (p) => !serviceArray.fields.find((t) => t.type === p.name),
      )) {
        serviceArray.append({ type: item.name, hourlyRate: 0 });
      }
    }
  }, [serviceTypes.data]);

  return (
    <>
      <h1>Nuovo Progetto</h1>

      <EditForm
        form={form}
        onSave={async (newProject: NewProjectFormType) => {
          await client!.createProject(newProject);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Crea"
        successText="Progetto creato con successo."
      >
        <ProjectForm
          clients={{ isPending: clients.isPending, data: clients.data }}
        />
        <Button
          disabled={serviceTypes.isPending}
          type="button"
          onClick={() =>
            serviceArray.prepend({
              type: "",
              hourlyRate: 0,
            })
          }
        >
          {serviceTypes.isPending ? <Spinner className="mr-2" /> : <PlusIcon />}
          Aggiungi Servizio
        </Button>
        {serviceTypes.isPending && <Spinner />}
        {serviceArray.fields.map((field, index) => (
          <div key={field.id} className="flex w-full space-x-2 items-center">
            <FormField
              control={form.control}
              name={`services.${index}.type`}
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tipo di Servizio" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`services.${index}.hourlyRate`}
              render={({ field }) => (
                <FormItem className="grow">
                  <FormLabel>Tariffa Oraria</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        {...field}
                        placeholder="Tariffa oraria"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => serviceArray.remove(index)}
                      >
                        <Cross2Icon />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
      </EditForm>
    </>
  );
};

export default NewProject;
