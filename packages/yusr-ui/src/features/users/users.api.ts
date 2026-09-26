import { createSimpleListResource } from "#/api";
import { UserDto } from "#/entities";


export const usersApi = createSimpleListResource<UserDto>("Users");