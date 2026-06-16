import { AuthConstants } from "./index.ts";


interface AuthActions
{
	logout: () => any;
	syncFromStorage: () => any;
}

export const setupAuthListeners = (actions: AuthActions) =>
{
	window.addEventListener(AuthConstants.AuthCheckStorageItemName, () =>
	{
		actions.syncFromStorage();
	});

	window.addEventListener(AuthConstants.UnauthorizedEventName, () =>
	{
		actions.logout();
	});
};
