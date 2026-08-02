import { effect, signal } from "@preact/signals-react";


export interface ThemeColors
{
	background?: string;
	foreground?: string;
	card?: string;
	cardForeground?: string;
	popover?: string;
	popoverForeground?: string;
	primary?: string;
	primaryForeground?: string;
	secondary?: string;
	secondaryForeground?: string;
	muted?: string;
	mutedForeground?: string;
	accent?: string;
	accentForeground?: string;
	destructive?: string;
	border?: string;
	input?: string;
	ring?: string;
	chart1?: string;
	chart2?: string;
	chart3?: string;
	chart4?: string;
	chart5?: string;
	sidebar?: string;
	sidebarForeground?: string;
	sidebarPrimary?: string;
	sidebarPrimaryForeground?: string;
	sidebarAccent?: string;
	sidebarAccentForeground?: string;
	sidebarBorder?: string;
	sidebarRing?: string;
}

export interface ThemeSettings
{
	radius?: string;
	light?: ThemeColors;
	dark?: ThemeColors;
}

export const themeSettings = signal<ThemeSettings | undefined>(undefined);

const VAR_MAP: Record<keyof ThemeColors, string> = {
	background: "--background",
	foreground: "--foreground",
	card: "--card",
	cardForeground: "--card-foreground",
	popover: "--popover",
	popoverForeground: "--popover-foreground",
	primary: "--primary",
	primaryForeground: "--primary-foreground",
	secondary: "--secondary",
	secondaryForeground: "--secondary-foreground",
	muted: "--muted",
	mutedForeground: "--muted-foreground",
	accent: "--accent",
	accentForeground: "--accent-foreground",
	destructive: "--destructive",
	border: "--border",
	input: "--input",
	ring: "--ring",
	chart1: "--chart-1",
	chart2: "--chart-2",
	chart3: "--chart-3",
	chart4: "--chart-4",
	chart5: "--chart-5",
	sidebar: "--sidebar",
	sidebarForeground: "--sidebar-foreground",
	sidebarPrimary: "--sidebar-primary",
	sidebarPrimaryForeground: "--sidebar-primary-foreground",
	sidebarAccent: "--sidebar-accent",
	sidebarAccentForeground: "--sidebar-accent-foreground",
	sidebarBorder: "--sidebar-border",
	sidebarRing: "--sidebar-ring"
};

effect(() =>
{
	const theme = themeSettings.value;
	if (!theme)
	{
		const existingTag = document.getElementById("yusr-custom-theme");
		if (existingTag) existingTag.remove();
		return;
	}

	let cssRules = "";

	if (theme.radius)
	{
		// Added !important to guarantee it overrides globals.css
		cssRules += `html, :root { --radius: ${ theme.radius } !important; }\n`;
	}

	if (theme.light)
	{
		// Added 'html' for higher specificity
		cssRules += `html, :root {\n`;
		(Object.keys(theme.light) as Array<keyof ThemeColors>).forEach((key) =>
		{
			if (theme.light![key]) cssRules += `  ${ VAR_MAP[key] }: ${ theme.light![key] } !important;\n`;
		});
		cssRules += `}\n`;
	}

	if (theme.dark)
	{
		// Added 'html.dark' for higher specificity
		cssRules += `html.dark, .dark {\n`;
		(Object.keys(theme.dark) as Array<keyof ThemeColors>).forEach((key) =>
		{
			if (theme.dark![key]) cssRules += `  ${ VAR_MAP[key] }: ${ theme.dark![key] } !important;\n`;
		});
		cssRules += `}\n`;
	}

	let styleTag = document.getElementById("yusr-custom-theme");
	if (!styleTag)
	{
		styleTag = document.createElement("style");
		styleTag.id = "yusr-custom-theme";
		document.head.appendChild(styleTag);
	}
	styleTag.innerHTML = cssRules;
});