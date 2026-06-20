import { router } from "@/app/router";


export class AppNavigator
{
	static async navigate(path: string, replace = false)
	{
		await router.navigate(path, {replace});
	}
}
