import { Cog, Home, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/pure";
import { i18n } from "../locales";


/**
 * Add these keys to your common.json translation file:
 *
 * "maintenance": {
 *   "title": "System Under Maintenance",
 *   "description": "We're performing scheduled upgrades to the ERP system. All your records, transactions, and data remain safe — we'll be back shortly.",
 *   "retry": "Try Again",
 *   "goHome": "Go Home",
 *   "eta": "Estimated completion in ~{{minutes}} min"
 * }
 */



const EQUATIONS = [
	{text: "EOQ = √(2DS / H)", x: 2, y: 9, dur: 5.2, delay: 0.0},
	{text: "NPV = Σ Ct / (1+r)ᵗ", x: 73, y: 7, dur: 4.7, delay: 0.8},
	{text: "COGS = BI + P − EI", x: 4, y: 77, dur: 5.8, delay: 1.4},
	{text: "ROI = (NI / Cost) × 100", x: 62, y: 73, dur: 4.4, delay: 0.5},
	{text: "DSO = (AR / Rev) × 365", x: 35, y: 2, dur: 6.1, delay: 2.0},
	{text: "ITR = COGS / Avg.Inv", x: 1, y: 44, dur: 5.5, delay: 1.1},
	{text: "WC = CA − CL", x: 82, y: 40, dur: 4.9, delay: 1.7},
	{text: "D&A = (Cost − SV) / UL", x: 43, y: 87, dur: 5.3, delay: 0.3},
	{text: "GP = (Rev − COGS) / Rev", x: 15, y: 52, dur: 4.6, delay: 1.9},
	{text: "EBITDA = NI + T + I + D", x: 65, y: 27, dur: 5.7, delay: 0.6},
	{text: "Z = 1.2X₁ + 1.4X₂ + 3.3X₃", x: 26, y: 17, dur: 6.3, delay: 1.3},
	{text: "ΔWC = ΔCA − ΔCL", x: 69, y: 63, dur: 4.8, delay: 2.2}
] as const;

const KEYFRAMES = `
  @keyframes maintenance-float {
    0%, 100% { transform: translateY(0);     opacity: 0.14; }
    35%       { transform: translateY(-16px); opacity: 0.24; }
    65%       { transform: translateY(8px);   opacity: 0.07; }
  }
  @keyframes maintenance-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes maintenance-spin-reverse {
    from { transform: rotate(360deg); }
    to   { transform: rotate(0deg);   }
  }
  @keyframes maintenance-rise {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes maintenance-pulse {
    0%, 100% { opacity: 1;    }
    50%      { opacity: 0.38; }
  }
`;

export function MaintenanceFallback()
{

	const [progress, setProgress] = useState(0);
	const [mounted, setMounted] = useState(false);

	useEffect(() =>
	{
		setMounted(true);
		const id = setInterval(() =>
		{
			setProgress(p => (p >= 100 ? 0 : p + 0.4));
		}, 50);
		return () => clearInterval(id);
	}, []);

	// const etaMin = Math.max(1, Math.ceil((100 - progress) * (estimatedMinutes / 100)));

	return (
		<>
			{/* Scoped keyframe animations — unique prefixes avoid global collisions */ }
			<style dangerouslySetInnerHTML={ {__html: KEYFRAMES} }/>

			<div className="flex min-h-screen w-full items-center justify-center p-6 relative overflow-hidden">

				{/* ── Floating ERP equations background ── */ }
				{ mounted && EQUATIONS.map((eq, i) => (
					<div
						key={ i }
						className="absolute font-mono text-xs text-muted-foreground pointer-events-none select-none whitespace-nowrap"
						style={ {
							left: `${ eq.x }%`,
							top: `${ eq.y }%`,
							opacity: 0.14,
							animation: `maintenance-float ${ eq.dur }s ease-in-out infinite`,
							animationDelay: `${ eq.delay }s`
						} }
					>
						{ eq.text }
					</div>
				)) }

				{/* ── Main card ── */ }
				<Card
					className="relative z-10 max-w-md overflow-hidden border-amber-300/30 bg-amber-500/5 text-center shadow-lg backdrop-blur-sm"
					style={ {animation: mounted ? "maintenance-rise 0.7s cubic-bezier(0.22,1,0.36,1) both" : "none"} }
				>
					{/* Looping progress stripe */ }
					<div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/20">
						<div
							className="h-full bg-amber-500"
							style={ {
								width: `${ progress }%`,
								transition: "width 50ms linear"
							} }
						/>
					</div>

					<CardHeader>
						{/* Dual-gear icon cluster */ }
						<div className="mx-auto mb-4 relative" style={ {width: 68, height: 68} }>
							<div
								className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-amber-500/10 text-amber-600">
								<Cog
									className="h-[34px] w-[34px]"
									style={ {animation: "maintenance-spin 7s linear infinite"} }
								/>
							</div>
							<div
								className="absolute flex items-center justify-center rounded-full bg-amber-500/10 text-amber-600"
								style={ {top: -7, right: -8, width: 30, height: 30, animation: "none"} }
							>
								<Cog
									className="h-[18px] w-[18px]"
									style={ {animation: "maintenance-spin-reverse 3.5s linear infinite"} }
								/>
							</div>
						</div>

						<CardTitle className="text-2xl font-bold tracking-tight text-foreground">
							{ i18n.t("maintenance.title") }
						</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4">
						<p className="text-muted-foreground leading-relaxed">
							{ i18n.t("maintenance.description") }
						</p>

						{/* Pulsing ETA indicator */ }
						<div
							className="flex items-center justify-center gap-2"
							style={ {animation: "maintenance-pulse 2.6s ease-in-out infinite"} }
						>
							<span className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500"/>
							<span className="text-sm text-muted-foreground">
                                {/* {t("maintenance.eta", { minutes: etaMin })} */ }
                            </span>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
						<Button
							variant="default"
							onClick={ () => window.location.reload() }
							className="gap-2 px-8 border border-amber-300/30 bg-amber-500/10 text-amber-700 shadow-none hover:bg-amber-500/20"
						>
							<RotateCcw className="h-4 w-4"/>
							{ i18n.t("maintenance.retry") }
						</Button>
						<Button
							variant="outline"
							asChild
							className="gap-2 border-amber-300/30 hover:bg-amber-500/10"
						>
							<a href="/">
								<Home className="ml-2 h-4 w-4"/>
								{ i18n.t("maintenance.goHome") }
							</a>
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}