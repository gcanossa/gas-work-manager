import {
  numeric,
  text,
  serial,
  RowObject,
  hyperLink,
  Link,
} from "@gasstack/db";
import { z } from "zod";

export const organizationModel = {
  id: serial(numeric(0)),
  name: text(1),
  address: text(2),
  zipCode: text(3),
  city: text(4),
  province: text(5),
  country: text(6),
  vatNumber: text(7),
  driveFolder: hyperLink(8),
};

export const organizationSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  address: z
    .string()
    .min(2, {
      message: "Address must be at least 2 characters.",
    })
    .regex(/^.+,.+$/, {
      message:
        "Address must have a comma (,) separating street name and number",
    }),
  zipCode: z.string().length(5, {
    message: "ZipCode must be 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  province: z.string().length(2, {
    message: "Province must be 2 characters.",
  }),
  country: z.string().length(2, {
    message: "Country must be 2 characters.",
  }),
  vatNumber: z.string().regex(/^[0-9]{9,12}$/, {
    message: "VAT must be only digit and at least 9 character long.",
  }),
});

export type OrganizationType = RowObject<typeof organizationModel>;
export type NewOrganizationType = z.infer<typeof organizationSchema> & {
  driveFolder: Link;
};
