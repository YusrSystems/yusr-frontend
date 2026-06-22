import { Cubit } from "./cubit.ts";
import { YusrApiHelper } from "../networking";
import { BaseServices } from "../services";


class ContinueWithGoogleState
{
}

export class ContinueWithGoogleCubit extends Cubit<ContinueWithGoogleState>
{
	constructor()
	{
		super(new ContinueWithGoogleState());
	}

	public async init()
	{
		const result = await YusrApiHelper.Get<{ connectedEmail: (string | undefined) }>(
			`/api/auth/external/email`
		);

		if (result.status === 200 && result.data)
		{
			this._setUserEmail(result.data.connectedEmail);
		}
	}

	public async Connect(token: string)
	{
		const result = await YusrApiHelper.Post<{ connectedEmail: string }>(
			`/api/auth/external/connect`,
			{
				provider: "google",
				token
			}
		);

		if (result.status === 200 && result.data)
		{
			this._setUserEmail(result.data.connectedEmail);
		}
	}

	public async disconnect(password: string)
	{
		await YusrApiHelper.Post(
			`/api/auth/external/disconnect`,
			{password: password}
		);
		const user = BaseServices.auth.loggedInUser;
		const metadata = user?.userMetadata;
		if (metadata)
		{
			metadata.value.connectedEmail.value = undefined;
		}

	}

	private _setUserEmail(email: string | undefined)
	{
		const user = BaseServices.auth.loggedInUser;
		const metadata = user?.userMetadata;
		console.log(metadata);
		if (metadata)
		{
			metadata.value.connectedEmail.value = email;
		}
	}
}