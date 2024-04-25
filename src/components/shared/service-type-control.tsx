import { Input } from "@/components/ui/input";
import {
  CheckIcon,
  CornerBottomLeftIcon,
  Cross2Icon,
  CrossCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { NewServiceEnumType } from "@model/service";
import { useState } from "react";
import { Spinner } from "./spinner";
import { cn } from "@/lib/utils";

export type ServiceTypeControlProps = {
  className?: string;
  handleSave: (data: NewServiceEnumType) => Promise<void>;
  handleCancel: () => void;
  typeNames?: string[];
};

export const ServiceTypeControl: React.FC<ServiceTypeControlProps> = ({
  className,
  handleSave,
  handleCancel,
  typeNames,
}) => {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <div className={cn("flex flex-col w-full space-y-2", className)}>
      <div className="flex w-full items-center">
        <CornerBottomLeftIcon className="mx-2" />
        <Input
          disabled={saving}
          type="text"
          placeholder="Nome del servizio"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Button
          className="mx-2"
          disabled={saving}
          type="button"
          onClick={async () => {
            try {
              if (name.length < 3)
                throw Error("The name must be at least 3 character long.");
              if (typeNames && typeNames.includes(name))
                throw Error("The service type already exists.");
              setSaving(true);
              await handleSave({ name });
              setSaving(false);
            } catch (e) {
              setError(String(e));
              setSaving(false);
            }
          }}
        >
          {saving ? <Spinner className="ml-0" /> : <CheckIcon />}
        </Button>
        <Button
          disabled={saving}
          type="button"
          variant="destructive"
          onClick={handleCancel}
        >
          <Cross2Icon />
        </Button>
      </div>
      <p className="text-[0.8rem] font-medium text-destructive">{error}</p>
    </div>
  );
};
