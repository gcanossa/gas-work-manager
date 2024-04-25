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
import { NewServiceEnumType, ServiceEnumType } from "@model/service";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ServiceTypeControl } from "./service-type-control";
import { useState } from "react";
import { toast } from "sonner";
import { NewProjectType } from "@model/project";

export type SubServiceFormProps = {
  index: number;
  serviceTypes: { isPending: boolean; data: ServiceEnumType[] | undefined };
  addServiceType: (type: NewServiceEnumType) => Promise<void>;
};

export const SubServiceForm: React.FC<SubServiceFormProps> = ({
  index,
  serviceTypes,
  addServiceType,
}) => {
  const form = useFormContext<NewProjectType>();

  const [addingServiceType, setAddingServiceType] = useState(false);

  return (
    <>
      <FormField
        control={form.control}
        name={`services.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo</FormLabel>
            <Select
              onValueChange={field.onChange}
              disabled={
                serviceTypes.isPending || (serviceTypes.data?.length ?? 0) === 0
              }
            >
              <FormControl>
                <div className="flex items-center space-x-2">
                  <SelectTrigger>
                    {serviceTypes.isPending ? (
                      "Caricamento..."
                    ) : (
                      <SelectValue placeholder="Seleziona un servizio" />
                    )}
                  </SelectTrigger>
                  <Button
                    type="button"
                    onClick={() => setAddingServiceType(true)}
                    disabled={addingServiceType}
                  >
                    <PlusIcon />
                  </Button>
                </div>
              </FormControl>
              <SelectContent>
                {serviceTypes.data &&
                  serviceTypes.data.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
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
      {addingServiceType && (
        <ServiceTypeControl
          typeNames={serviceTypes.data?.map((p) => p.name)}
          handleCancel={() => setAddingServiceType(false)}
          handleSave={async (data) => {
            await addServiceType(data);
            setAddingServiceType(false);
            toast.success("Tipo servizio aggiunto.");
          }}
        />
      )}
    </>
  );
};
