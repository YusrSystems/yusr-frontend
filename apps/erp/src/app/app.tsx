import { Services } from "@/core/services/services";
import type { i18n } from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RouterProvider } from "react-router-dom";
import {
  BaseApiService,
  NumbertoWordsService,
  setupAuthListeners,
  ThemeProvider,
  Toaster,
  TooltipProvider,
  Validators,
  YusrApiHelper
} from "yusr-ui";
import { AppNavigator } from "./appNavigator";
import { router } from "./router";


function App()
{
	const {t, i18n} = useTranslation("common");

	useEffect(() =>
	{
		NumbertoWordsService.init(t, i18n.language);
		YusrApiHelper.init(t, i18n.language);
		BaseApiService.init(t);
		Validators.init(t);
	}, [t, i18n.language]);

	return <AppBody i18n={ i18n }/>;
}

function AppBody({i18n}: { i18n: i18n; })
{
	return (
		<TooltipProvider>
			<ThemeProvider defaultTheme="dark" storageKey="ui-theme">
				<RouterProvider router={ router }/>
				<Toaster richColors closeButton position="top-center" dir={ i18n.dir() }/>
			</ThemeProvider>
		</TooltipProvider>
	);
}

setupAuthListeners({
	logout: () =>
	{
		Services.auth.logout();
		AppNavigator.navigate("/login");
	},
	syncFromStorage: () => Services.auth.syncFromStorage()
});

export default App;
