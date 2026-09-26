import { PartnerDto } from "@/core/data/partner";
import { createCrudResource } from "#/api";


export const partnersApi = createCrudResource<PartnerDto>("Partners");