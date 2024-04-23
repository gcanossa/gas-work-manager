import { EditFormModel } from "@/components/shared/edit-form";
import {
  numeric,
  text,
  serial,
  formula,
  hyperLink,
  RowObject,
  Link,
} from "@gasstack/db";
import { z } from "zod";

export const projectModel = {
  id: serial(numeric(0)),
  name: text(1),
  clientId: numeric(2),
  clientName: formula(text(3)),
  driveFolder: hyperLink(4),
};

export const projectSchema = z.object({
  name: z.string().min(2, {
    message: "Project must be at least 2 characters.",
  }),
  clientId: z.coerce.number().int().positive({
    message: "Project id must be positive.",
  }),
});

export type ProjectType = RowObject<typeof projectModel>;
export type NewProjectType = z.infer<typeof projectSchema> & {
  driveFolder: Link;
};
