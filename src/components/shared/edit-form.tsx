import { FormProvider, UseFormReturn } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { AlertSuccess, AlertError } from "@/components/shared/alerts";

export type EditFormProp<T extends Record<string, any>> = PropsWithChildren<{
  form: UseFormReturn<T>;
  onSave: (data: T) => Promise<void>;
  onCancel: () => Promise<void>;
  saveText?: string;
  cancelText?: string;
  successText?: string;
}>;

export function EditForm<T extends Record<string, any>>({
  form,
  onSave,
  onCancel,
  saveText,
  cancelText,
  successText,
  children,
}: EditFormProp<T>) {
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: onSave,
  });

  async function onSubmit(values: T) {
    try {
      await mutation.mutateAsync(values);

      setSaved(true);
    } catch (e) {
      setSaved(true);
      setError(String(e));
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {children}
        {saved ? (
          !error ? (
            <AlertSuccess text={successText} />
          ) : (
            <AlertError error={error} />
          )
        ) : (
          <div className="flex space-x-2">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Spinner className="mr-3" />}
              {saveText ?? "Salva"}
            </Button>
            <Button
              type="reset"
              onClick={onCancel}
              className="ml-3"
              variant="destructive"
              disabled={mutation.isPending}
            >
              {cancelText ?? "Annulla"}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
