import {
	ArrowRightLeft,
	BarChart2,
	FileSearch,
	FileText,
	LineChart,
	type LucideIcon,
	Package,
	PackageOpen,
	PackageSearch,
	Percent,
	ReceiptText,
	TrendingUp
} from "lucide-react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { AppNavigator } from "@/app/appNavigator.ts";
import { APP_NAME } from "../../../appConfig.ts";


interface Report
{
	comp: React.ReactNode;
	name: string;
	description: string;
	icon: LucideIcon;
}

interface ReportGroup
{
	label: string;
	icon: LucideIcon;
	iconColor: string;
	reports: Report[];
}

interface ReportCardProps
{
	report: Report;
	groupIconColor: string;
}

function ReportCard({report, groupIconColor}: ReportCardProps)
{
	const Icon = report.icon;

	return (
		<div
			className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30">
			<div className={ `flex h-9 w-9 items-center justify-center rounded-lg` }>
				<Icon className={ `h-5 w-5 ${ groupIconColor }` } strokeWidth={ 1.8 }/>
			</div>

			<div className="flex flex-col gap-0.5">
				<p className="text-sm font-medium text-foreground">{ report.name }</p>
				<p className="text-xs text-muted-foreground leading-relaxed">{ report.description }</p>
			</div>

			{ report.comp }
		</div>
	);
}

interface ReportGroupSectionProps
{
	group: ReportGroup;
}

function ReportGroupSection({group}: ReportGroupSectionProps)
{
	const GroupIcon = group.icon;

	return (
		<section className="flex flex-col gap-4">
			<div className="flex items-center gap-2.5">
				<div className={ "flex h-7 w-7 items-center justify-center rounded-lg" }>
					<GroupIcon className={ `h-5 w-5 ${ group.iconColor }` } strokeWidth={ 1.8 }/>
				</div>
				<h2 className="text-sm font-medium text-foreground">{ group.label }</h2>
				<div className="h-px flex-1 bg-border"/>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{ group.reports.map((report, i) => (
					<ReportCard
						key={ i }
						report={ report }
						groupIconColor={ group.iconColor }
					/>
				)) }
			</div>
		</section>
	);
}

export default function ReportsPage()
{
	const {t} = useTranslation("erpCommon");

	useEffect(() =>
	{
		Cubits.items.init();
		Cubits.stores.init();
	}, []);

	useEffect(() =>
	{
		document.title = `${ t("reports.title") } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [t]);

	const reportGroups: ReportGroup[] = [{
		label: t("reports.financial"),
		icon: BarChart2,
		iconColor: "text-blue-600",
		reports: [{
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/invoicesList") }>{ t("reports.create") }</Button>,
			name: t("reports.InvoicesList"),
			description: t("reports.InvoicesListDescription"),
			icon: ReceiptText
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/profitAndLoss") }>{ t("reports.create") }</Button>,
			name: t("reports.profitAndLoss"),
			description: t("reports.profitAndLossDescription"),
			icon: TrendingUp
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/salesProfitability") }>{ t("reports.create") }</Button>,
			name: t("reports.salesProfitability", "تقرير ربحية المبيعات"),
			description: t("reports.salesProfitabilityDescription", "عرض ربحية المبيعات مع التكاليف المباشرة"),
			icon: LineChart
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/balanceSheet") }>{ t("reports.create") }</Button>,
			name: t("reports.balanceSheet"),
			description: t("reports.balanceSheetDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/accountsList") }>{ t("reports.create") }</Button>,
			name: t("reports.accountsList"),
			description: t("reports.accountsListDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/accountStatement") }>{ t("reports.create") }</Button>,
			name: t("reports.accountStatement"),
			description: t("reports.accountStatementDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/partnerStatement") }>{ t("reports.create") }</Button>,
			name: t("reports.partnerStatement"),
			description: t("reports.partnerStatementDescription"),
			icon: FileText
		}]
	}, {
		label: t("reports.tax"),
		icon: Percent,
		iconColor: "text-amber-600",
		reports: [{
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/vatReturn") }>{ t("reports.create") }</Button>,
			name: "الإقرار الضريبي",
			description: "تقرير ضريبة القيمة المضافة الدوري",
			icon: FileText
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/taxAudit") }>{ t("reports.create") }</Button>,
			name: "تقرير المراجعة الضريبية",
			description: "تفاصيل الفواتير والضرائب للمراجعة",
			icon: FileSearch
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemsTaxStatement") }>{ t("reports.create") }</Button>,
			name: t("reports.itemsTaxStatement"),
			description: t("reports.itemsTaxStatementDescription"),
			icon: Percent
		}]
	}, {
		label: t("reports.inventory"),
		icon: Package,
		iconColor: "text-green-700",
		reports: [{
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemsList") }>{ t("reports.create") }</Button>,
			name: t("reports.itemsList"),
			description: t("reports.itemsListDescription"),
			icon: PackageSearch
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemStatement") }>{ t("reports.create") }</Button>,
			name: t("reports.itemStatement"),
			description: t("reports.itemStatementDescription"),
			icon: PackageOpen
		}, {
			comp: <Button variant="outline"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemsMovement") }>{ t("reports.create") }</Button>,
			name: t("reports.itemsMovement"),
			description: t("reports.itemsMovementDescription"),
			icon: ArrowRightLeft
		}]
	}];

	return (
		<div className="flex flex-col gap-8 p-6">
			<div>
				<h1 className="text-xl font-medium text-foreground">{ t("reports.title") }</h1>
				<p className="mt-1 text-sm text-muted-foreground">{ t("reports.subtitle") }</p>
			</div>

			{ reportGroups.map((group) => (
				<ReportGroupSection
					key={ group.label }
					group={ group }
				/>
			)) }
		</div>
	);
}