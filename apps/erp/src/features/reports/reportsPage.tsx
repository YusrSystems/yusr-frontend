import {
	AlertTriangle,
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
			className="flex flex-col h-full gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30">
			<div className={ `flex h-9 w-9 items-center justify-center rounded-lg` }>
				<Icon className={ `h-5 w-5 ${ groupIconColor }` } strokeWidth={ 1.8 }/>
			</div>
			<div className="flex flex-col gap-0.5">
				<p className="text-sm font-medium text-foreground">{ report.name }</p>
				<p className="text-xs text-muted-foreground leading-relaxed">{ report.description }</p>
			</div>
			<div className="mt-auto pt-2">
				{ report.comp }
			</div>
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

	const formatDate = (d: Date) =>
	{
		return `${ d.getFullYear() }-${ String(d.getMonth() + 1).padStart(2, "0") }-${ String(d.getDate()).padStart(2, "0") }`;
	};

	const getThisWeek = () =>
	{
		const now = new Date();
		const first = now.getDate() - now.getDay();
		const start = new Date(now.getFullYear(), now.getMonth(), first);
		const end = new Date(now.getFullYear(), now.getMonth(), first + 6);
		return {fromDate: formatDate(start), toDate: formatDate(end)};
	};

	const getThisMonth = () =>
	{
		const now = new Date();
		const start = new Date(now.getFullYear(), now.getMonth(), 1);
		const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return {fromDate: formatDate(start), toDate: formatDate(end)};
	};

	const getThisYear = () =>
	{
		const now = new Date();
		const start = new Date(now.getFullYear(), 0, 1);
		const end = new Date(now.getFullYear(), 11, 31);
		return {fromDate: formatDate(start), toDate: formatDate(end)};
	};

	const getQuarter = (q: number) =>
	{
		const now = new Date();
		const startMonth = (q - 1) * 3;
		const start = new Date(now.getFullYear(), startMonth, 1);
		const end = new Date(now.getFullYear(), startMonth + 3, 0);
		return {fromDate: formatDate(start), toDate: formatDate(end)};
	};

	const getToday = () => formatDate(new Date());

	const getEndOfLastMonth = () =>
	{
		const now = new Date();
		return formatDate(new Date(now.getFullYear(), now.getMonth(), 0));
	};

	const getEndOfLastYear = () =>
	{
		const now = new Date();
		return formatDate(new Date(now.getFullYear() - 1, 11, 31));
	};

	// Three buttons side-by-side using grid
	const renderDateShortcuts = (path: string) => (
		<div className="grid grid-cols-3 gap-2">
			<Button variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
			{
				const dates = getThisWeek();
				await AppNavigator.navigate(`${ path }?fromDate=${ dates.fromDate }&toDate=${ dates.toDate }`);
			} }>{ t("shortcuts.thisWeek", "هذا الأسبوع") }</Button>
			<Button variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
			{
				const dates = getThisMonth();
				await AppNavigator.navigate(`${ path }?fromDate=${ dates.fromDate }&toDate=${ dates.toDate }`);
			} }>{ t("shortcuts.thisMonth", "هذا الشهر") }</Button>
			<Button variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
			{
				const dates = getThisYear();
				await AppNavigator.navigate(`${ path }?fromDate=${ dates.fromDate }&toDate=${ dates.toDate }`);
			} }>{ t("shortcuts.thisYear", "هذا العام") }</Button>
		</div>
	);

	// Today takes full row, last month/year take second row
	const renderAsOfDateShortcuts = (path: string) => (
		<div className="grid grid-cols-2 gap-2">
			<Button variant="outline" size="sm" className="col-span-2 w-full h-8 text-xs" onClick={ async () =>
			{
				const asOfDate = getToday();
				await AppNavigator.navigate(`${ path }?asOfDate=${ asOfDate }`);
			} }>{ t("shortcuts.today", "اليوم") }</Button>
			<Button variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
			{
				const asOfDate = getEndOfLastMonth();
				await AppNavigator.navigate(`${ path }?asOfDate=${ asOfDate }`);
			} }>{ t("shortcuts.endOfLastMonth", "نهاية الشهر الماضي") }</Button>
			<Button variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
			{
				const asOfDate = getEndOfLastYear();
				await AppNavigator.navigate(`${ path }?asOfDate=${ asOfDate }`);
			} }>{ t("shortcuts.endOfLastYear", "نهاية العام الماضي") }</Button>
		</div>
	);

	// Q1, Q2, Q3, Q4 in 2x2 grid, This Year spanning full width
	const qTitles = ["الربع الأول", "الربع الثاني", "الربع الثالث", "الربع الرابع"];
	const renderQuarterShortcuts = (path: string) => (
		<div className="grid grid-cols-2 gap-2">
			{ [1, 2, 3, 4].map(q => (
				<Button key={ q } variant="outline" size="sm" className="w-full h-8 text-[11px] px-0" onClick={ async () =>
				{
					const dates = getQuarter(q);
					await AppNavigator.navigate(`${ path }?fromDate=${ dates.fromDate }&toDate=${ dates.toDate }`);
				} }>{ qTitles[q - 1] }</Button>
			)) }
			<Button variant="outline" size="sm" className="col-span-2 w-full h-8 text-xs" onClick={ async () =>
			{
				const dates = getThisYear();
				await AppNavigator.navigate(`${ path }?fromDate=${ dates.fromDate }&toDate=${ dates.toDate }`);
			} }>{ t("shortcuts.thisYear", "هذا العام") }</Button>
		</div>
	);

	const reportGroups: ReportGroup[] = [{
		label: t("reports.financial"),
		icon: BarChart2,
		iconColor: "text-blue-600",
		reports: [{
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/invoicesList") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.InvoicesList"),
			description: t("reports.InvoicesListDescription"),
			icon: ReceiptText
		}, {
			comp: renderDateShortcuts("/reports/profitAndLoss"),
			name: t("reports.profitAndLoss"),
			description: t("reports.profitAndLossDescription"),
			icon: TrendingUp
		}, {
			comp: renderDateShortcuts("/reports/salesProfitability"),
			name: t("reports.salesProfitability", "تقرير ربحية المبيعات"),
			description: t("reports.salesProfitabilityDescription", "عرض ربحية المبيعات مع التكاليف المباشرة"),
			icon: LineChart
		}, {
			comp: renderAsOfDateShortcuts("/reports/balanceSheet"),
			name: t("reports.balanceSheet"),
			description: t("reports.balanceSheetDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/accountsList") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.accountsList"),
			description: t("reports.accountsListDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/vouchersList") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.vouchersList", "قائمة السندات"),
			description: t("reports.vouchersListDescription", "عرض قائمة بسندات القبض والصرف الفردية وحالاتها"),
			icon: FileText
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/accountStatement") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.accountStatement"),
			description: t("reports.accountStatementDescription"),
			icon: FileText
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/partnerStatement") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.partnerStatement"),
			description: t("reports.partnerStatementDescription"),
			icon: FileText
		}]
	}, {
		label: t("reports.tax"),
		icon: Percent,
		iconColor: "text-amber-600",
		reports: [{
			comp: renderQuarterShortcuts("/reports/vatReturn"),
			name: "الإقرار الضريبي",
			description: "تقرير ضريبة القيمة المضافة الدوري",
			icon: FileText
		}, {
			comp: renderDateShortcuts("/reports/taxAudit"),
			name: "تقرير المراجعة الضريبية",
			description: "تفاصيل الفواتير والضرائب للمراجعة",
			icon: FileSearch
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemsTaxStatement") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.itemsTaxStatement"),
			description: t("reports.itemsTaxStatementDescription"),
			icon: Percent
		}]
	}, {
		label: t("reports.inventory"),
		icon: Package,
		iconColor: "text-green-700",
		reports: [{
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemsList") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.itemsList"),
			description: t("reports.itemsListDescription"),
			icon: PackageSearch
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/itemStatement") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.itemStatement"),
			description: t("reports.itemStatementDescription"),
			icon: PackageOpen
		}, {
			comp: renderDateShortcuts("/reports/itemsMovement"),
			name: t("reports.itemsMovement"),
			description: t("reports.itemsMovementDescription"),
			icon: ArrowRightLeft
		}, {
			comp: renderAsOfDateShortcuts("/reports/stockValuation"),
			name: "تقييم المخزون",
			description: "تقرير يعرض قيمة المخزون الحالية بناءً على متوسط التكلفة وتاريخ محدد",
			icon: PackageSearch
		}, {
			comp: <Button variant="outline" className="w-full h-8 text-xs"
			              onClick={ async () => await AppNavigator.navigate("/reports/lowStock") }>{ t("reports.create", "عرض التقرير") }</Button>,
			name: t("reports.lowStock", "تقرير النواقص"),
			description: t("reports.lowStockDescription", "عرض المواد التي وصلت للحد الأدنى أو نفدت"),
			icon: AlertTriangle
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