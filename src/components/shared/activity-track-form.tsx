import { useFormContext, useWatch } from "react-hook-form";
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
import { NewActivityTrackType } from "@model/activity-track";
import { ProjectType } from "@model/project";
import { ServiceType } from "@model/service";
import { Checkbox } from "@/components/ui/checkbox";

export type ActivityTrackFormProps = {
  projects: { isPending: boolean; data: ProjectType[] | undefined };
  services: { isPending: boolean; data: ServiceType[] | undefined };
};

export const ActivityTrackForm: React.FC<ActivityTrackFormProps> = ({
  projects,
  services,
}) => {
  const form = useFormContext<NewActivityTrackType>();

  const projectId = useWatch({ control: form.control, name: "projectId" });

  return (
    <>
      <FormField
        control={form.control}
        name="projectId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Progetto</FormLabel>
            <Select
              onValueChange={field.onChange}
              disabled={projects.isPending}
            >
              <FormControl>
                <SelectTrigger>
                  {projects.isPending ? (
                    "Caricamento..."
                  ) : (
                    <SelectValue placeholder="Seleziona un progetto" />
                  )}
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {projects.data &&
                  projects.data.map((p) => (
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
      {projectId && (
        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servizio</FormLabel>
              <Select
                onValueChange={field.onChange}
                disabled={services.isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    {services.isPending ? (
                      "Caricamento..."
                    ) : (
                      <SelectValue placeholder="Seleziona un servizio" />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services.data &&
                    services.data
                      .filter((p) => p.projectId === Number(projectId))
                      .map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.type}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrizione</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Descrizione dell'attività" />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="start"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Inizio</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                {...field}
                placeholder="Inizio dell'attività"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="end"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fine</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                {...field}
                placeholder="Fine dell'attività"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="multiplier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Moltiplicatore</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                placeholder="Moltiplicatore tariffa"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="billable"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  return field.onChange(checked);
                }}
              />
            </FormControl>
            <FormLabel className="text-sm font-normal">Fatturabile</FormLabel>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
