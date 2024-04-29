import { read } from "@gasstack/db";
import { ServiceEnumType } from "@model/service";
import { serviceCtx, serviceEnumCtx } from "@server/contexts";

export function getServiceTypes(): ServiceEnumType[] {
  return read(serviceEnumCtx);
}

export function getServices() {
  return read(serviceCtx);
}
