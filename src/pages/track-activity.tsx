import { EditForm } from "@/components/shared/edit-form";
import client from "@/gas-client";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewActivityTrackType,
  activityTrackSchema,
} from "@model/activity-track";
import { ActivityTrackForm } from "@/components/shared/activity-track-form";

const schema = activityTrackSchema;

export const TrackActivity: React.FC = () => {
  const form = useForm<NewActivityTrackType>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: "",
      start: "",
      end: "",
      multiplier: 1,
    },
  });

  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await client!.getProjects())[0],
  });
  const services = useQuery({
    queryKey: ["services"],
    queryFn: async () => (await client!.getServices())[0],
  });

  return (
    <>
      <h1>Registra Attività</h1>

      <EditForm
        form={form}
        onSave={async (activity: NewActivityTrackType) => {
          await client!.trackActivity(activity);

          setTimeout(() => window.google.script.host.close(), 2000);
        }}
        onCancel={async () => window.google.script.host.close()}
        saveText="Registra"
        successText="Attività registrata con successo."
      >
        <ActivityTrackForm
          projects={{ isPending: projects.isPending, data: projects.data }}
          services={{ isPending: services.isPending, data: services.data }}
        />
      </EditForm>
    </>
  );
};

export default TrackActivity;
