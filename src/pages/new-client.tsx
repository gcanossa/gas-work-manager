import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import client from "@/gas-client";
import { NewOrganizationType, organizationSchema } from "@model/organization";
import { EditForm } from "@/components/shared/edit-form";
import { OrganizationForm } from "@/components/shared/organization-form";

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

  return (
    <>
      <h1>Nuovo Cliente</h1>

      <EditForm
        form={form}
        onSave={async (newClient: NewOrganizationType) => {
          await client!.createClient(newClient);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Crea"
        successText="Cliente creato con successo."
      >
        <OrganizationForm />
      </EditForm>
    </>
  );
};

export default NewClient;
