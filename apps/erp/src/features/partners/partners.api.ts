import { createCrudResource } from "yusr-ui";
import { type PartnerDto } from "@/core/data/partner";

export const partnersApi = createCrudResource<PartnerDto>("Partners");