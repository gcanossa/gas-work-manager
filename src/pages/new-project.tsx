import { EditForm } from "@/components/shared/edit-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewProjectType, projectSchema } from "@model/project";
import { useFieldArray, useForm } from "react-hook-form";
import client from "@/gas-client";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "@/components/shared/project-form";
import { SubServiceForm } from "@/components/shared/sub-service-form";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export const NewProject: React.FC = () => {
  const form = useForm<NewProjectType>({
    resolver: zodResolver(projectSchema),
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

  return (
    <>
      <h1>Nuovo Progetto</h1>

      <EditForm
        form={form}
        onSave={async (newProject: NewProjectType) => {
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
          type="button"
          onClick={() =>
            serviceArray.prepend({
              id: 0,
              type: "",
              projectId: 0,
              hourlyRate: 0,
            })
          }
        >
          <PlusIcon />
          Aggiungi Servizio
        </Button>
        {serviceArray.fields.map((field, index) => (
          <SubServiceForm
            index={index}
            key={field.id}
            addServiceType={async (data) => {
              await client!.createServiceType(data);
              await serviceTypes.refetch();
            }}
            serviceTypes={serviceTypes}
          />
        ))}
      </EditForm>
    </>
  );
};

export default NewProject;
