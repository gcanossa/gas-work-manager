import { read } from "@gasstack/db";
import { ServiceEnumType } from "@model/service";
import { serviceEnumCtx } from "@server/contexts";

export function getServiceTypes(): ServiceEnumType[] {
  return read(serviceEnumCtx);
}
