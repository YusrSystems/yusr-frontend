import { useTranslation } from "react-i18next";
import {
	Avatar,
	AvatarFallback,
	Badge,
	Button,
	Card,
	FieldGroup,
	Separator,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "../components/pure";
import { ArrowDownRight, ArrowUpRight, Check, Moon, Palette, Pipette, SlidersHorizontal, Sun } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { themeSettings, type ThemeSettings } from "./theme.signals.ts";
import { FieldsSection, SelectField, TextField } from "../components/custom";


type ThemeModeColors = NonNullable<ThemeSettings["light"]>;

interface ThemePreset
{
	label: string;
	theme: ThemeSettings | undefined;
}

interface PresetGroup
{
	label: string;
	keys: string[];
}

function hslToHex(h: number, s: number, l: number): string
{
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = (n: number) =>
	{
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, "0");
	};
	return `#${ f(0) }${ f(8) }${ f(4) }`.toUpperCase();
}

function modePair(hue: number, saturation: number, radius: string): ThemeSettings
{
	return {
		radius,
		light: {
			primary: hslToHex(hue, saturation, 45),
			primaryForeground: "#FAFAFA",
			background: hslToHex(hue, Math.min(saturation, 20), 98),
			foreground: "#252525",
			card: "#FFFFFF",
			cardForeground: "#252525",
			ring: hslToHex(hue, saturation, 45)
		},
		dark: {
			primary: hslToHex(hue, saturation, 65),
			primaryForeground: "#252525",
			background: hslToHex(hue, Math.min(saturation, 25), 8),
			foreground: "#FAFAFA",
			card: hslToHex(hue, Math.min(saturation, 25), 12),
			cardForeground: "#FAFAFA",
			ring: hslToHex(hue, saturation, 65)
		}
	};
}

function pickForeground(hex: string): string
{
	const clean = hex.replace("#", "");
	if (clean.length !== 6) return "#FAFAFA";
	const r = parseInt(clean.slice(0, 2), 16);
	const g = parseInt(clean.slice(2, 4), 16);
	const b = parseInt(clean.slice(4, 6), 16);
	const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luma > 0.6 ? "#252525" : "#FAFAFA";
}

// ─── ALIGNED DIRECTLY WITH OKLCH TAILWIND DESIGN CODES ───
const DEFAULT_THEME_COLORS: ThemeModeColors = {
	primary: "#343434",           // oklch(0.205 0 0)
	primaryForeground: "#FAFAFA", // oklch(0.985 0 0)
	background: "#FFFFFF",        // oklch(1 0 0)
	foreground: "#252525",        // oklch(0.145 0 0)
	card: "#FFFFFF",              // oklch(1 0 0)
	cardForeground: "#252525",    // oklch(0.145 0 0)
	ring: "#343434"
};

const DEFAULT_DARK: ThemeModeColors = {
	primary: "#DCDCDC",           // oklch(0.87 0 0)
	primaryForeground: "#343434", // oklch(0.205 0 0)
	background: "#252525",        // oklch(0.145 0 0)
	foreground: "#FAFAFA",        // oklch(0.985 0 0)
	card: "#343434",              // oklch(0.205 0 0)
	cardForeground: "#FAFAFA",    // oklch(0.985 0 0)
	ring: "#DCDCDC"
};

const PRESETS: Record<string, ThemePreset> = {
	default: {label: "theme.preset.default", theme: undefined},
	slate: {label: "theme.preset.slate", theme: modePair(220, 10, "0.5rem")},
	graphite: {label: "theme.preset.graphite", theme: modePair(0, 0, "0.375rem")},
	paper: {label: "theme.preset.paper", theme: modePair(40, 10, "0.75rem")},
	ocean: {label: "theme.preset.ocean", theme: modePair(210, 80, "0.5rem")},
	steel: {label: "theme.preset.steel", theme: modePair(200, 30, "0.375rem")},
	navy: {label: "theme.preset.navy", theme: modePair(230, 60, "0.25rem")},
	sky: {label: "theme.preset.sky", theme: modePair(200, 90, "1rem")},
	emerald: {label: "theme.preset.emerald", theme: modePair(150, 70, "0.5rem")},
	sage: {label: "theme.preset.sage", theme: modePair(120, 30, "0.625rem")},
	mint: {label: "theme.preset.mint", theme: modePair(160, 70, "1rem")},
	forest: {label: "theme.preset.forest", theme: modePair(140, 50, "0.25rem")},
	sunset: {label: "theme.preset.sunset", theme: modePair(20, 90, "1.5rem")},
	amber: {label: "theme.preset.amber", theme: modePair(40, 90, "0.625rem")},
	clay: {label: "theme.preset.clay", theme: modePair(15, 50, "0.5rem")},
	rose: {label: "theme.preset.rose", theme: modePair(340, 70, "1rem")},
	indigo: {label: "theme.preset.indigo", theme: modePair(250, 70, "0.5rem")},
	violet: {label: "theme.preset.violet", theme: modePair(270, 70, "0.75rem")},
	crimson: {label: "theme.preset.crimson", theme: modePair(350, 80, "0.375rem")},
	ink: {label: "theme.preset.ink", theme: modePair(260, 20, "0rem")}
};

const PRESET_GROUPS: PresetGroup[] = [
	{label: "Neutral", keys: ["default", "slate", "graphite", "paper"]},
	{label: "Blue", keys: ["ocean", "steel", "navy", "sky"]},
	{label: "Green", keys: ["emerald", "sage", "mint", "forest"]},
	{label: "Warm", keys: ["sunset", "amber", "clay", "rose"]},
	{label: "Bold", keys: ["indigo", "violet", "crimson", "ink"]}
];

const RADIUS_OPTIONS = ["0rem", "0.3rem", "0.5rem", "0.75rem", "1rem", "1.5rem"];

const COLOR_FIELD_CONFIG: { key: keyof ThemeModeColors; label: string; swatches: string[] }[] = [
	{
		key: "primary",
		label: "Primary",
		swatches: ["#343434", "#185FA5", "#D85A30", "#534AB7", "#1D9E75", "#D4537E", "#854F0B"]
	},
	{
		key: "background",
		label: "Background",
		swatches: ["#FFFFFF", "#FAFAFA", "#F4F4F4", "#FDF8F3", "#F7F9FB", "#252525"]
	},
	{key: "card", label: "Card", swatches: ["#FFFFFF", "#FAFAFA", "#F7F7F7", "#FDFDFB", "#F5F6F8", "#343434"]},
	{key: "ring", label: "Ring", swatches: ["#343434", "#185FA5", "#D85A30", "#534AB7", "#1D9E75", "#D4537E"]}
];

const VAR_MAP: Partial<Record<keyof ThemeModeColors, string>> = {
	primary: "--primary",
	primaryForeground: "--primary-foreground",
	background: "--background",
	foreground: "--foreground",
	card: "--card",
	cardForeground: "--card-foreground",
	ring: "--ring"
};

const activePresetSignal = signal<string>("default");
const customModeSignal = signal<"light" | "dark">("light");

function ColorFieldRow({label, value, swatches, onChange}: {
	label: string;
	value: string;
	swatches: string[];
	onChange: (value: string) => void;
})
{
	const isCustomActive = !swatches.some((s) => s.toLowerCase() === value.toLowerCase());
	const [showAdvanced, setShowAdvanced] = useState(isCustomActive);

	useEffect(() =>
	{
		setShowAdvanced(isCustomActive);
	}, [isCustomActive]);

	return (
		<div className="space-y-2">
			<p className="text-sm font-medium">{ label }</p>
			<div className="flex flex-wrap items-center gap-2">
				{ swatches.map((swatch) =>
				{
					const selected = !showAdvanced && swatch.toLowerCase() === value.toLowerCase();
					return (
						<button
							key={ swatch }
							type="button"
							title={ swatch }
							onClick={ () =>
							{
								setShowAdvanced(false);
								onChange(swatch);
							} }
							style={ {background: swatch} }
							className={ `h-6 w-6 rounded-full border transition-shadow ${ selected ? "ring-2 ring-offset-2 ring-primary" : "border-border" }` }
						/>
					);
				}) }

				<button
					type="button"
					title="Custom color"
					onClick={ () => setShowAdvanced(true) }
					className={ `flex h-6 w-6 items-center justify-center rounded-full border border-dashed transition-colors ${ showAdvanced ? "border-primary bg-primary/10" : "border-muted-foreground/40 bg-muted/30" }` }
				>
					<Pipette className="h-3 w-3"/>
				</button>
			</div>

			{ showAdvanced && (
				<div className="flex items-center gap-2 pt-1">
					<input
						type="color"
						value={ value }
						onChange={ (e) => onChange(e.target.value) }
						className="h-8 w-9 cursor-pointer rounded border p-0.5"
					/>
					<input
						type="text"
						value={ value }
						onChange={ (e) => onChange(e.target.value) }
						spellCheck={ false }
						className="h-8 w-28 rounded-md border bg-background px-2 text-sm font-mono uppercase"
					/>
				</div>
			) }
		</div>
	);
}

function PresetCard({theme, isActive, onSelect}: {
	labelKey: string;
	theme: ThemeSettings | undefined;
	isActive: boolean;
	onSelect: () => void;
})
{
	// const {t} = useTranslation("common");
	const swatch = theme?.light ?? {primary: "#343434", background: "#FFFFFF", card: "#FFFFFF"};
	const radius = theme?.radius ?? "0.625rem";

	return (
		<button
			type="button"
			onClick={ onSelect }
			style={ {borderRadius: radius} }
			className={ `relative flex flex-col gap-2 border p-2.5 text-start transition-colors hover:border-primary/50 ${ isActive ? "border-primary ring-1 ring-primary" : "border-border" }` }
		>
			{ isActive && (
				<span
					className="absolute top-1.5 end-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-2 w-2" strokeWidth={ 3 }/>
             </span>
			) }
			<div className="flex gap-1.5">
				<span className="h-3.5 w-3.5 rounded-full border" style={ {background: swatch.primary} }/>
				<span className="h-3.5 w-3.5 rounded-full border" style={ {background: swatch.background} }/>
				<span className="h-3.5 w-3.5 rounded-full border" style={ {background: swatch.card} }/>
			</div>
			{/*<span className="text-sm font-medium">{ t(labelKey) }</span>*/ }
		</button>
	);
}

function getPreviewStyleObject(theme: ThemeSettings | undefined, mode: "light" | "dark"): React.CSSProperties
{
	const safeTheme = theme || {radius: "0.625rem", light: DEFAULT_THEME_COLORS, dark: DEFAULT_DARK};
	const style: Record<string, string> = {};

	if (safeTheme.radius)
	{
		style["--radius"] = safeTheme.radius;
	}

	const colors = safeTheme[mode];
	if (colors)
	{
		(Object.keys(VAR_MAP) as Array<keyof typeof VAR_MAP>).forEach(key =>
		{
			const cssVar = VAR_MAP[key];
			const colorVal = colors[key];
			if (cssVar && colorVal) style[cssVar] = colorVal;
		});
	}
	return style as React.CSSProperties;
}

export function ThemeSection({draftTheme}: { draftTheme: Signal<ThemeSettings | undefined> })
{
	useSignals();
	const {t, i18n} = useTranslation("common");
	const selectOption = useMemo(() => signal(1), []);

	useEffect(() =>
	{
		if (draftTheme.value === undefined)
		{
			draftTheme.value = themeSettings.value;
		}

		if (themeSettings.value === undefined)
		{
			activePresetSignal.value = "default";
		}
		else
		{
			const match = Object.keys(PRESETS).find(key => PRESETS[key]!.theme === themeSettings.value);
			activePresetSignal.value = match || "";
		}
	}, []);

	const updateCustomField = (mode: "light" | "dark", key: keyof ThemeModeColors, value: string) =>
	{
		activePresetSignal.value = "";
		const foregroundPatch = key === "primary" && value.startsWith("#") ? {primaryForeground: pickForeground(value)} : {};

		const currentLight = draftTheme.value?.light || DEFAULT_THEME_COLORS;
		const currentDark = draftTheme.value?.dark || DEFAULT_DARK;
		const currentRadius = draftTheme.value?.radius || "0.625rem";

		if (mode === "light")
		{
			draftTheme.value = {
				radius: currentRadius,
				dark: currentDark,
				light: {...currentLight, [key]: value, ...foregroundPatch}
			};
		}
		else
		{
			draftTheme.value = {
				radius: currentRadius,
				light: currentLight,
				dark: {...currentDark, [key]: value, ...foregroundPatch}
			};
		}
	};

	const updateCustomRadius = (radius: string) =>
	{
		activePresetSignal.value = "";
		draftTheme.value = {
			light: draftTheme.value?.light || DEFAULT_THEME_COLORS,
			dark: draftTheme.value?.dark || DEFAULT_DARK,
			radius
		};
	};

	const applyPreset = (theme: ThemeSettings | undefined, presetName: string) =>
	{
		draftTheme.value = theme;
		activePresetSignal.value = presetName;
	};

	const customMode = customModeSignal.value;
	const activeColors = draftTheme.value?.[customMode] ?? (customMode === "light" ? DEFAULT_THEME_COLORS : DEFAULT_DARK);
	const activeRadius = draftTheme.value?.radius ?? "0.625rem";

	return (
		<div className="space-y-6" dir={ i18n.dir() }>
			<div className="grid lg:grid-cols-10 gap-6 items-start">
				<FieldGroup className="lg:col-span-4">
					<FieldsSection title={ t("theme.appearance", "Appearance") } columns={ 1 }>
						<Tabs defaultValue="presets" className="w-full" dir={ i18n.dir() }>
							<div className="flex items-center justify-between gap-3 mb-1">
								<TabsList className="grid w-full max-w-65 grid-cols-2">
									<TabsTrigger value="presets" className="gap-1.5">
										<Palette className="h-3.5 w-3.5"/>
										{ t("theme.presets", "Presets") }
									</TabsTrigger>
									<TabsTrigger value="custom" className="gap-1.5">
										<SlidersHorizontal className="h-3.5 w-3.5"/>
										{ t("theme.custom", "Custom") }
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="presets" className="mt-5 space-y-4" dir={ i18n.dir() }>
								{ PRESET_GROUPS.map((group) => (
									<div key={ group.label }>
										<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
											{ t(`theme.group.${ group.label.toLowerCase() }`, group.label) }
										</p>
										<div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
											{ group.keys.map((key) => (
												<PresetCard
													key={ key }
													labelKey={ PRESETS[key]!.label }
													theme={ PRESETS[key]!.theme }
													isActive={ activePresetSignal.value === key }
													onSelect={ () => applyPreset(PRESETS[key]!.theme, key) }
												/>
											)) }
										</div>
									</div>
								)) }
							</TabsContent>

							<TabsContent value="custom" className="mt-5 space-y-5" dir={ i18n.dir() }>
								<div className="grid sm:grid-cols-2 gap-x-6 gap-y-5">
									{ COLOR_FIELD_CONFIG.map((field) =>
									{
										const fieldValue = activeColors[field.key] ?? "#000000";
										return (
											<ColorFieldRow
												key={ `${ customMode }-${ field.key }-${ fieldValue }` }
												label={ t(`theme.field.${ field.key }`, field.label) }
												value={ fieldValue }
												swatches={ field.swatches }
												onChange={ (value) => updateCustomField(customMode, field.key, value) }
											/>
										);
									}) }
								</div>

								<Separator/>

								<div className="space-y-2">
									<p className="text-sm font-medium">{ t("theme.radius", "Corner radius") }</p>
									<div className="flex flex-wrap items-center gap-2">
										{ RADIUS_OPTIONS.map((r) => (
											<button key={ r } type="button" title={ r }
											        onClick={ () => updateCustomRadius(r) } style={ {borderRadius: r} }
											        className={ `h-8 w-8 border-2 bg-muted transition-colors ${ activeRadius === r ? "border-primary" : "border-border" }` }/>
										)) }
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</FieldsSection>
				</FieldGroup>

				{/* LIVE PREVIEW */ }
				<FieldGroup className="lg:col-span-6" dir={ i18n.dir() }>
					<FieldsSection title={ t("theme.livePreview", "Preview") } columns={ 1 }>
						<Tabs
							value={ customMode }
							onValueChange={ (val) => customModeSignal.value = val as "light" | "dark" }
							className="w-full"
							dir={ i18n.dir() }
						>
							<TabsList className="grid w-full max-w-50 grid-cols-2">
								<TabsTrigger value="light" className="gap-1.5">
									<Sun className="h-3.5 w-3.5"/>
									{ t("theme.light", "Light") }
								</TabsTrigger>
								<TabsTrigger value="dark" className="gap-1.5">
									<Moon className="h-3.5 w-3.5"/>
									{ t("theme.dark", "Dark") }
								</TabsTrigger>
							</TabsList>

							<TabsContent value={ customMode } className="mt-4">
								<div
									id="theme-preview-container"
									className={ `rounded-lg border overflow-hidden transition-colors duration-300 ${ customMode === "dark" ? "dark bg-background text-foreground" : "bg-background text-foreground" }` }
									style={ getPreviewStyleObject(draftTheme.value, customMode) }
								>
									<div className="flex items-center gap-2 border-b bg-muted/40 px-3 py-2">
										<div className="flex gap-1.5">
											<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30"/>
											<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30"/>
											<span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30"/>
										</div>
										<div
											className="flex-1 truncate rounded-sm bg-background px-2.5 py-1 text-xs text-muted-foreground">
											erp.yusrsys.com/dashboard
										</div>
									</div>

									<div className="p-4 space-y-4">
										<div className="grid grid-cols-3 gap-2.5">
											<Card className="p-3">
												<p className="text-xs text-muted-foreground">{ t("theme.previewRevenue", "Revenue") }</p>
												<p className="text-lg font-semibold mt-0.5">SAR 48,290</p>
												<p className="flex items-center gap-0.5 text-xs text-emerald-600 mt-1">
													<ArrowUpRight className="h-3 w-3"/>12.4%
												</p>
											</Card>
											<Card className="p-3">
												<p className="text-xs text-muted-foreground">{ t("theme.previewInvoices", "Invoices") }</p>
												<p className="text-lg font-semibold mt-0.5">214</p>
												<p className="flex items-center gap-0.5 text-xs text-rose-600 mt-1">
													<ArrowDownRight className="h-3 w-3"/>3.1%
												</p>
											</Card>
											<Card className="p-3">
												<p className="text-xs text-muted-foreground">{ t("theme.previewVat", "VAT due") }</p>
												<p className="text-lg font-semibold mt-0.5">SAR 6,140</p>
											</Card>
										</div>

										<Card>
											<div className="flex items-center justify-between border-b p-4">
												<div>
													<h4 className="font-semibold">{ t("theme.mockTitle", "Recent invoices") }</h4>
													<p className="text-sm text-muted-foreground mt-0.5">{ t("theme.mockSubtitle", "Updates live as you edit.") }</p>
												</div>
												<Badge variant="secondary">{ t("theme.previewLive", "Live") }</Badge>
											</div>
											<div className="p-4 space-y-3">
												{ [{
													name: "Acme Trading",
													amount: "SAR 3,250",
													status: "Paid"
												}, {
													name: "Al Faisal",
													amount: "SAR 1,180",
													status: "Pending"
												}].map((row) => (
													<div key={ row.name }
													     className="flex items-center justify-between gap-3">
														<div className="flex items-center gap-2.5">
															<Avatar className="h-7 w-7">
																<AvatarFallback className="text-xs">
																	{ row.name.slice(0, 2).toUpperCase() }
																</AvatarFallback>
															</Avatar>
															<span className="text-sm">{ row.name }</span>
														</div>
														<div className="flex items-center gap-2">
                                              <span
												  className="text-sm text-muted-foreground">{ row.amount }</span>
															<Badge
																variant={ row.status === "Paid" ? "default" : "secondary" }
																className="text-xs">
																{ row.status }
															</Badge>
														</div>
													</div>
												)) }
											</div>
											<Separator/>
											<div className="p-4 space-y-3">
												<TextField label={ t("theme.sampleInput", "Customer name") }
												           value="Acme Trading Co." readOnly/>
												<SelectField label={ t("theme.sampleSelect", "Payment terms") }
												             options={ [{label: "Net 30", value: 1}] }
												             value={ selectOption }/>
												<div className="flex items-center justify-between pt-1">
                                        <span
											className="text-sm">{ t("theme.previewAutoRemind", "Send automatic reminders") }</span>
													<Switch defaultChecked/>
												</div>
											</div>
											<div className="flex gap-2 p-4 pt-0">
												<Button size="sm"
												        className="w-full">{ t("theme.primaryBtn", "Confirm") }</Button>
												<Button size="sm" variant="outline"
												        className="w-full">{ t("theme.secondaryBtn", "Cancel") }</Button>
											</div>
										</Card>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</FieldsSection>
				</FieldGroup>
			</div>
		</div>
	);
}