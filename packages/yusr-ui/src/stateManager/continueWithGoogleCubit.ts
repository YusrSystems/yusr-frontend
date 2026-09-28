import { Cubit } from "./cubit.ts";
import { apiClient } from "#/api";
import { UserMetadata, UserMetadataDto } from "#/entities";
import { signal, type Signal } from "@preact/signals-react";


export class ContinueWithGoogleInitialState
{
}

export class ContinueWithGoogleLoadingState extends ContinueWithGoogleInitialState
{
}

export class ContinueWithGoogleLoadedState extends ContinueWithGoogleInitialState
{
}

export class ContinueWithGoogleErrorState extends ContinueWithGoogleInitialState
{
}

export type ContinueWithGoogleState =
	ContinueWithGoogleLoadingState
	| ContinueWithGoogleLoadedState
	| ContinueWithGoogleErrorState;

export class ContinueWithGoogleCubit extends Cubit<ContinueWithGoogleState>
{
	public userMetadata: Signal<UserMetadata> = signal<UserMetadata>(new UserMetadata());

	constructor()
	{
		super(new ContinueWithGoogleInitialState());
	}

	public async init()
	{
		this.emit(new ContinueWithGoogleLoadingState());
		const result = await apiClient.get<UserMetadataDto>(
			"/api/auth/external/email"
		);

		if (result.ok && result.data)
		{
			this._setUserMetaData(result.data);
			this.emit(new ContinueWithGoogleLoadedState());
			return;
		}

		this.emit(new ContinueWithGoogleErrorState());
	}

	public async Connect(token: string)
	{
		this.emit(new ContinueWithGoogleLoadingState());
		const result = await apiClient.post<UserMetadataDto>(
			"/api/auth/external/connect",
			{
				provider: "google",
				token
			}
		);

		if (result.ok && result.data)
		{
			this._setUserMetaData(result.data);
			this.emit(new ContinueWithGoogleLoadedState());
			return;
		}

		this.emit(new ContinueWithGoogleErrorState());
	}

	public async disconnect(password: string)
	{
		this.emit(new ContinueWithGoogleLoadingState());
		const result = await apiClient.post(
			"/api/auth/external/disconnect",
			{password}
		);

		if (result.ok)
		{
			this.userMetadata.value.connectedEmail.value = undefined;
			this.userMetadata.value.picture.value = undefined;

			this.emit(new ContinueWithGoogleLoadedState());
			return;
		}

		this.emit(new ContinueWithGoogleErrorState());
	}

	private _setUserMetaData(metadata: UserMetadataDto)
	{
		this.userMetadata.value.connectedEmail.value = metadata.connectedEmail;
		this.userMetadata.value.picture.value = metadata.picture;
	}
}