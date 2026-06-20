import { Account, type AccountDto } from "@/core/data/account";
import { BaseApiService } from "yusr-ui";


export default class AccountApiService extends BaseApiService<Account, AccountDto>
{
	routeName: string = "Accounts";

	override createEntity(dto: AccountDto): Account
	{
		return new Account(dto);
	}

}
