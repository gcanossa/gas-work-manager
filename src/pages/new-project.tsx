import { EditForm } from "@/components/shared/edit-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewProjectType, projectSchema } from "@model/project";
import { useForm } from "react-hook-form";
import client from "@/gas-client";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "@/components/shared/project-form";

export const NewProject: React.FC = () => {
  const form = useForm<NewProjectType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
    },
  });

  const clients = useQuery({
    queryKey: ["clients"],
    queryFn: async () => (await client!.getClients())[0],
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
        <ProjectForm clients={clients} />
      </EditForm>
    </>
  );
};

export default NewProject;
