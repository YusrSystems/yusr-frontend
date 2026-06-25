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

// themeSettings.value = {
// 	radius: "0.5rem",
// 	light: {
// 		background: "oklch(0.98 0.01 240)",
// 		foreground: "oklch(0.15 0.03 240)",
// 		card: "oklch(1 0 0)",
// 		cardForeground: "oklch(0.15 0.03 240)",
// 		popover: "oklch(1 0 0)",
// 		popoverForeground: "oklch(0.15 0.03 240)",
// 		primary: "oklch(0.50 0.15 250)",
// 		primaryForeground: "oklch(0.98 0 0)",
// 		secondary: "oklch(0.92 0.04 240)",
// 		secondaryForeground: "oklch(0.20 0.10 250)",
// 		muted: "oklch(0.95 0.02 240)",
// 		mutedForeground: "oklch(0.50 0.03 240)",
// 		accent: "oklch(0.92 0.04 240)",
// 		accentForeground: "oklch(0.20 0.10 250)",
// 		destructive: "oklch(0.60 0.20 25)",
// 		border: "oklch(0.88 0.03 240)",
// 		input: "oklch(0.88 0.03 240)",
// 		ring: "oklch(0.50 0.15 250)",
// 		chart1: "oklch(0.60 0.15 250)",
// 		chart2: "oklch(0.65 0.12 210)",
// 		chart3: "oklch(0.70 0.10 180)",
// 		chart4: "oklch(0.75 0.08 150)",
// 		chart5: "oklch(0.80 0.06 120)",
// 		sidebar: "oklch(0.96 0.02 240)",
// 		sidebarForeground: "oklch(0.15 0.03 240)",
// 		sidebarPrimary: "oklch(0.50 0.15 250)",
// 		sidebarPrimaryForeground: "oklch(0.98 0 0)",
// 		sidebarAccent: "oklch(0.90 0.05 240)",
// 		sidebarAccentForeground: "oklch(0.20 0.10 250)",
// 		sidebarBorder: "oklch(0.88 0.03 240)",
// 		sidebarRing: "oklch(0.50 0.15 250)"
// 	},
// 	dark: {
// 		background: "oklch(0.15 0.03 250)",
// 		foreground: "oklch(0.98 0.01 240)",
// 		card: "oklch(0.20 0.04 250)",
// 		cardForeground: "oklch(0.98 0.01 240)",
// 		popover: "oklch(0.20 0.04 250)",
// 		popoverForeground: "oklch(0.98 0.01 240)",
// 		primary: "oklch(0.70 0.15 250)",
// 		primaryForeground: "oklch(0.15 0.05 250)",
// 		secondary: "oklch(0.25 0.05 250)",
// 		secondaryForeground: "oklch(0.90 0.05 240)",
// 		muted: "oklch(0.22 0.04 250)",
// 		mutedForeground: "oklch(0.70 0.03 250)",
// 		accent: "oklch(0.25 0.05 250)",
// 		accentForeground: "oklch(0.90 0.05 240)",
// 		destructive: "oklch(0.60 0.20 25)",
// 		border: "oklch(0.30 0.05 250)",
// 		input: "oklch(0.30 0.05 250)",
// 		ring: "oklch(0.70 0.15 250)",
// 		chart1: "oklch(0.70 0.15 250)",
// 		chart2: "oklch(0.75 0.12 210)",
// 		chart3: "oklch(0.80 0.10 180)",
// 		chart4: "oklch(0.85 0.08 150)",
// 		chart5: "oklch(0.90 0.06 120)",
// 		sidebar: "oklch(0.18 0.04 250)",
// 		sidebarForeground: "oklch(0.98 0.01 240)",
// 		sidebarPrimary: "oklch(0.70 0.15 250)",
// 		sidebarPrimaryForeground: "oklch(0.15 0.05 250)",
// 		sidebarAccent: "oklch(0.25 0.05 250)",
// 		sidebarAccentForeground: "oklch(0.90 0.05 240)",
// 		sidebarBorder: "oklch(0.30 0.05 250)",
// 		sidebarRing: "oklch(0.70 0.15 250)"
// 	}
// };

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
	logout: async () =>
	{
		Services.auth.logout();
		await AppNavigator.navigate("/login");
	},
	syncFromStorage: () => Services.auth.syncFromStorage()
});

export default App;
