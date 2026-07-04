import { Signal, signal } from "@preact/signals-react";
import { AuthConstants, User, UserDto } from "../index";


export abstract class AuthService
{
	public systemPermissions: Signal<string[]> = signal([]);
	private _isAuthenticatedSignal: Signal<boolean> = signal(false);
	private _loggedInUserSignal: Signal<User | undefined> = signal(undefined);

	get loggedInUser(): User | undefined
	{
		if (!this._loggedInUserSignal.value)
		{
			this._loggedInUserSignal.value = this.readLoggedInUserFromStorage();
		}
		return this._loggedInUserSignal.value;
	}

	get isAuthenticated(): boolean
	{
		this._isAuthenticatedSignal.value = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
		return this._isAuthenticatedSignal.value;
	}

	setLoggedInUser(user: UserDto)
	{
		if (user.id === this._loggedInUserSignal.value?.id.value)
		{
			this._loggedInUserSignal.value = User.load(user);
		}
	}

	FormatFunc = (resource: string, action: string) =>
	{
		return `${ resource }.${ action }`;
	};

	readonly hasAuth = (resource: string, action: string): boolean =>
	{
		const formattedPermissions = AuthConstants.FormatFunc(resource, action);
		if (this.loggedInUser == undefined)
		{
			return false;
		}
		return this.loggedInUser?.role.value.permissions.includes(formattedPermissions);
	};

	protected readonly baseLogin = (user: User) =>
	{
		this._isAuthenticatedSignal.value = true;
		this._loggedInUserSignal.value = user;

		localStorage.setItem(AuthConstants.AuthCheckStorageItemName, "true");
		localStorage.setItem(AuthConstants.LoggedInUserStorageItemName, JSON.stringify(user.toJson()));
	};

	protected readonly baseLogout = () =>
	{
		this._isAuthenticatedSignal.value = false;
		this._loggedInUserSignal.value = undefined;

		localStorage.removeItem(AuthConstants.AuthCheckStorageItemName);
		localStorage.removeItem(AuthConstants.LoggedInUserStorageItemName);
	};

	protected readonly baseSyncFromStorage = () =>
	{
		this._isAuthenticatedSignal.value = localStorage.getItem(AuthConstants.AuthCheckStorageItemName) === "true";
		this._loggedInUserSignal.value = this.readLoggedInUserFromStorage();
	};

	private readLoggedInUserFromStorage(): User | undefined
	{
		const storedItemString = localStorage.getItem(AuthConstants.LoggedInUserStorageItemName);
		const storedItem: UserDto | undefined = storedItemString ? JSON.parse(storedItemString) : undefined;
		return storedItem ? new User(storedItem) : undefined;
	}
}
