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
import { serviceSchema } from "@model/service";

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
  services: z
    .array(
      serviceSchema.extend({
        id: z.number(),
      }),
    )
    .nonempty("Scegli almeno un servizio"),
});

export type ProjectType = RowObject<typeof projectModel>;
export type NewProjectType = z.infer<typeof projectSchema>;
