import { router } from "@/app/router";


export class AppNavigator
{
	static async navigate(path: string, replace = false)
	{
		await router.navigate(path, {replace});
	}

	static openInNewTab(path: string)
	{
		window.open(path, "_blank", "noopener,noreferrer");
	}
}
