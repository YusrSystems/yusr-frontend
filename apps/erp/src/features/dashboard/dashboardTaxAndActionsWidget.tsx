import { ArrowDownLeft, FilePlusCorner, FileText, PlusCircle, Receipt, Scale, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "yusr-ui";
import type { DashboardData } from "@/core/data/dashboardData.ts";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";


type DashboardTaxAndActionsWidgetProps = { data: DashboardData; };

const formatNumber = (num: number) => new Intl.NumberFormat("en-US", {maximumFractionDigits: 2}).format(num);

export function DashboardTaxAndActionsWidget({data}: DashboardTaxAndActionsWidgetProps)
{
	const summary = data.thisMonth.value;
	const isTaxDue = summary.netVatDue >= 0;

	return (
		<div className="flex flex-col gap-4 h-full justify-between">
			{/* Top Card: VAT Position */ }
			<Card className="shadow-sm border-border/50">
				<CardHeader className="pb-2.5">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-bold flex items-center gap-1.5">
							<Scale className="h-4 w-4 text-primary"/>
							الموقف الضريبي (القيمة المضافة)
						</CardTitle>
						<span className={ `px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
							isTaxDue
								? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
								: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
						}` }>
							<ShieldCheck className="h-3 w-3"/>
							{ isTaxDue ? "مستحق للهيئة" : "رصيد مسترد" }
						</span>
					</div>
					<CardDescription className="text-xs">
						ملخص تقديري للإقرار الضريبي لشهر المعاملات الحالي
					</CardDescription>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="grid grid-cols-2 gap-2 mb-2">
						<div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
							<span className="text-[11px] text-muted-foreground font-medium block">ضريبة المخرجات</span>
							<div className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
								{ formatNumber(summary.outputVat) }
								<ErpCurrencyIcon className="w-3.5 h-3.5 opacity-70"/>
							</div>
						</div>
						<div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
							<span className="text-[11px] text-muted-foreground font-medium block">ضريبة المدخلات</span>
							<div className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1">
								{ formatNumber(summary.inputVat) }
								<ErpCurrencyIcon className="w-3.5 h-3.5 opacity-70"/>
							</div>
						</div>
					</div>

					<div
						className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
						<span className="text-xs text-primary font-bold">صافي الضريبة المستحقة</span>
						<div className="text-base font-bold text-primary flex items-center gap-1">
							{ formatNumber(Math.abs(summary.netVatDue)) }
							<ErpCurrencyIcon className="w-4 h-4"/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bottom Card: Quick Action Shortcuts with valid routes */ }
			<Card className="shadow-sm border-border/50">
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-bold flex items-center gap-1.5">
						<PlusCircle className="h-4 w-4 text-primary"/>
						إجراءات سريعة
					</CardTitle>
				</CardHeader>
				<CardContent className="grid grid-cols-2 gap-2 pt-0 pb-3">
					<Link to="/sales/new" className="w-full">
						<Button variant="outline" size="sm"
						        className="w-full justify-start gap-1.5 h-9 text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50">
							<FileText className="h-3.5 w-3.5 text-emerald-600"/>
							فاتورة بيع
						</Button>
					</Link>

					<Link to="/purchases/new" className="w-full">
						<Button variant="outline" size="sm"
						        className="w-full justify-start gap-1.5 h-9 text-xs font-medium hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/50">
							<Receipt className="h-3.5 w-3.5 text-rose-600"/>
							فاتورة شراء
						</Button>
					</Link>

					<Link to="/quotations/new" className="w-full">
						<Button variant="outline" size="sm"
						        className="w-full justify-start gap-1.5 h-9 text-xs font-medium hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/50">
							<FilePlusCorner className="h-3.5 w-3.5 text-purple-600"/>
							عرض سعر
						</Button>
					</Link>

					<Link to="/vouchers/new" className="w-full">
						<Button variant="outline" size="sm"
						        className="w-full justify-start gap-1.5 h-9 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50">
							<ArrowDownLeft className="h-3.5 w-3.5 text-blue-600"/>
							سند جديد
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}