import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ChevronDown, ChevronLeft, FileText, FolderTree, List, Printer, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
	cn,
	CrudPage,
	FilterSection,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TableHeaderActionButtons,
	TablePreview,
	UnauthorizedPage,
	YoutubeButton
} from "yusr-ui";
import { AccountClass, type AccountDto, AccountType, getAccountClass } from "@/core/data/account.ts";
import ChangeAccountDialog from "./changeAccountDialog";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon.tsx";
import { createPortal } from "react-dom";
import { PortalReportContainer } from "@/features/report/reportContainer.tsx";
import { AccountsListReport } from "@/features/reports/accountsList/accountsListReport.tsx";
import type { Signal } from "@preact/signals-react";
import { AppNavigator } from "@/app/appNavigator.ts";
import { APP_NAME } from "../../../appConfig.ts";
import { accountsApi } from "./accounts.api";


interface TreeNodeData
{
	id: string | number;
	name: string;
	balance: number;
	isVirtual: boolean;
	isParent: boolean;
	children: TreeNodeData[];
	account?: AccountDto;
	accountClass: AccountClass;
}

export default function AccountsPage()
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const [viewMode, setViewMode] = useState<"table" | "tree">("table");
	const viewModeTitle = viewMode === "table" ? t("accounts.title") : "شجرة الحسابات";

	useEffect(() =>
	{
		document.title = `${ viewModeTitle } | ${ APP_NAME }`;
		return () =>
		{
			document.title = APP_NAME;
		};
	}, [viewModeTitle]);

	useEffect(() =>
	{
		if (Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Get))
		{
			void Cubits.accounts.init();
		}
	}, []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<AccountDto>>
				<CrudPage.HeaderContainer
					className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-3 sm:items-center">
					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<h1>{ viewMode === "table" ? t("accounts.title") : "شجرة الحسابات" }</h1>
						<YoutubeButton videoId="WNCe2c2kqCw"/>
					</div>

					<CrudPage.HeaderButtonsContainer className="flex flex-wrap items-center gap-2 sm:gap-3">
						<div className="flex bg-muted/40 rounded-lg p-1 border shrink-0">
							<Button
								variant={ viewMode === "table" ? "default" : "ghost" }
								size="sm"
								onClick={ () => setViewMode("table") }
								className="gap-1.5 h-8 px-2.5 sm:px-3 text-xs"
								title={ t("erpCommon:reports.tableView", "عرض جدول") }
							>
								<List className="h-4 w-4"/>
								<span
									className="hidden sm:inline">{ t("erpCommon:reports.tableView", "عرض جدول") }</span>
							</Button>
							<Button
								variant={ viewMode === "tree" ? "default" : "ghost" }
								size="sm"
								onClick={ () => setViewMode("tree") }
								className="gap-1.5 h-8 px-2.5 sm:px-3 text-xs"
								title={ t("erpCommon:reports.treeView", "عرض شجرة") }
							>
								<FolderTree className="h-4 w-4"/>
								<span
									className="hidden sm:inline">{ t("erpCommon:reports.treeView", "عرض شجرة") }</span>
							</Button>
						</div>

						<TableHeaderActionButtons actionButtons={
							Services.auth.hasAuth(
								SystemPermissionsResources.ReportAccountList,
								SystemPermissionsActions.Get
							) ? [
								<Button
									key="print-list"
									variant="outline"
									onClick={ () => setTimeout(() => window.print(), 100) }
								>
									<Printer className="h-4 w-4"/>
									{ t("erpCommon:reports.accountsList") }
								</Button>
							] : []
						}/>

						{ Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Add) && (
							<CrudPage.AddButton title={ t("accounts.addNewTitle") }/>
						) }
					</CrudPage.HeaderButtonsContainer>
				</CrudPage.HeaderContainer>

				<Cards count={ Cubits.accounts.count }/>

				<div className="print:hidden">
					<FilterSection
						fieldsCubit={ Cubits.accountFilterFields }
						onApply={ (groups) => Cubits.accounts.applyFilterGroups(groups) }
						onClear={ () => Cubits.accounts.clearFilterGroups() }
					/>
				</div>

				<CrudPage.SearchInput
					className="rounded-t-none!"
					onSearch={ (searchText) => Cubits.accounts.search(searchText) }
				/>

				{ viewMode === "table" ? <PageTable/> : <PageTree/> }

				<CrudPage.ChangeDialog
					fetchEntity={ async (id: number) =>
					{
						const result = await accountsApi.get(id);
						return result.data;
					} }
					changeDialog={ (dto: AccountDto | undefined, closeDialog) => (
						<ChangeAccountDialog
							dto={ dto }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.accounts.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
								{
									Cubits.accounts.update(data);
								}
								void Cubits.accounts.init();
							} }
						/>
					) }
				/>

				<CrudPage.DeleteDialog<AccountDto>
					entityNameSelector={ (account) => account.name }
					resource={ accountsApi }
					onSuccess={ (entity) => Cubits.accounts.delete(entity) }
				/>
			</CrudPage>

			{ createPortal(
				<PortalReportContainer>
					<AccountsListReport isPortal={ true }/>
				</PortalReportContainer>,
				document.body
			) }
		</>
	);
}

function getBalanceColorClass(balance: number, accountClass: AccountClass): string
{
	// A negative balance is abnormal for every class — always flag it.
	if (balance < 0) return "text-red-600";

	// A normal (non-negative) balance is only "favorable" for Asset/Revenue growing.
	// For Liability/Expense, growing is expected but not good news — keep it neutral, not green.
	// Equity growing is generally favorable too (more capital/retained earnings).
	const favorableWhenPositive =
		accountClass === AccountClass.Asset ||
		accountClass === AccountClass.Revenue ||
		accountClass === AccountClass.Equity;

	return favorableWhenPositive ? "text-green-600" : "text-red-600";
}

function Cards({count}: { count: Signal<number>; })
{
	useSignals();
	const {t} = useTranslation("accounting");
	return (
		<CrudPage.Cards
			cards={ [{
				title: t("accounts.totalAccounts"),
				data: (count.value ?? 0).toString(),
				icon: <WalletIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation(["accounting", "common", "erpCommon"]);
	const canShowBalance = Services.auth.hasAuth(
		SystemPermissionsResources.AccountShowBalance,
		SystemPermissionsActions.Get
	);

	if (Cubits.accounts.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.accounts.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<AccountDto>
					isShareablePage={ true }
					data={ Cubits.accounts.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("accounts.accountId"), rowStyles: "w-24"},
						{rowBody: t("accounts.accountName"), rowStyles: "w-60"},
						...(canShowBalance ? [{rowBody: t("accounts.balance"), rowStyles: "w-32"}] : []),
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountStatement,
							SystemPermissionsActions.Get
						)
							? [{rowBody: "", rowStyles: "w-32"}]
							: [])
					] }
					tableRowMapper={ (account) => [
						{rowBody: `#${ account.id }`, rowStyles: ""},
						{rowBody: account.name, rowStyles: "font-semibold"},

						...(canShowBalance
							? [{
								rowBody: (
									<div className="flex items-center gap-1 font-mono">
										{ account.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) }
										<ErpCurrencyIcon/>
									</div>
								),
								rowStyles: getBalanceColorClass(account.balance, getAccountClass(account.type))
							}]
							: []),
						...(Services.auth.hasAuth(
							SystemPermissionsResources.ReportAccountStatement,
							SystemPermissionsActions.Get
						)
							? [{
								rowBody: <Button
									variant="outline"
									size="sm"
									onClick={ () =>
										AppNavigator.openInNewTab(
											`/reports/accountStatement/${ account.id }/${ encodeURIComponent(account.name) }`
										)
									}>
									{ t("erpCommon:accountStatement.button") }
								</Button>,
								rowStyles: "w-32"
							}]
							: [])

					] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.Accounts,
						SystemPermissionsActions.Delete
					) }
				/>
				<CrudPage.TablePagination
					pageSize={ Cubits.accounts.pageSize.value }
					totalNumber={ Cubits.accounts.count.value }
					currentPage={ Cubits.accounts.currentPage.value }
					onPageChanged={ (newPage) => Cubits.accounts.changePage(newPage) }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.accounts.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}

function PageTree()
{
	useSignals();
	const [expandedNodes, setExpandedNodes] = useState<Record<string | number, boolean>>({
		"class-1": true,
		"class-2": true,
		"class-3": true,
		"class-4": true,
		"class-5": true
	});

	if (Cubits.accounts.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	const accounts = Cubits.accounts.entities.value;
	if (accounts.length === 0)
	{
		return <TablePreview.Empty/>;
	}

	const roots = buildHierarchicalTree(accounts);

	const toggleExpand = (id: string | number) =>
	{
		setExpandedNodes((prev) => ({...prev, [id]: !prev[id]}));
	};

	return (
		<div className="border rounded-b-xl p-3 sm:p-6 bg-card text-foreground overflow-x-auto">
			<ul className="space-y-1 min-w-[320px]">
				{ roots.map((node) => (
					<TreeNode
						key={ node.id }
						node={ node }
						level={ 0 }
						expandedNodes={ expandedNodes }
						onToggle={ toggleExpand }
					/>
				)) }
			</ul>
		</div>
	);
}

function TreeNode({
	node,
	level,
	expandedNodes,
	onToggle
}: {
	node: TreeNodeData;
	level: number;
	expandedNodes: Record<string | number, boolean>;
	onToggle: (id: string | number) => void;
})
{

	const canShowBalance = Services.auth.hasAuth(
		SystemPermissionsResources.AccountShowBalance,
		SystemPermissionsActions.Get
	);

	const canShowStatement = Services.auth.hasAuth(
		SystemPermissionsResources.ReportAccountStatement,
		SystemPermissionsActions.Get
	);

	const {t} = useTranslation("erpCommon");

	const hasChildren = node.children.length > 0;
	const isExpanded = !!expandedNodes[node.id];

	return (
		<li className="flex flex-col">
			<div
				onClick={ () => hasChildren && onToggle(node.id) }
				style={ {paddingInlineStart: `${ level * 14 }px`} }
				className={ cn(
					"flex items-center justify-between py-2 sm:py-2.5 border-b border-muted/30 hover:bg-muted/10 rounded-md transition-colors px-2 sm:px-3 gap-2 min-w-0",
					node.isVirtual ? "cursor-pointer" : "cursor-default"
				) }
			>
				<div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
					{ hasChildren ? (
						<div className="h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center shrink-0">
							{ isExpanded ? <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4"/> :
								<ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 rtl:rotate-0 ltr:rotate-180"/> }
						</div>
					) : (
						<div className="h-4 w-4 sm:h-5 sm:w-5 shrink-0"/>
					) }
					<span
						title={ node.name }
						className={ cn("text-xs sm:text-sm truncate", node.isVirtual ? "font-bold text-primary" : "font-normal") }
					>
						{ node.name }
					</span>
					{ !node.isVirtual && (
						<span
							className="text-[9px] sm:text-[10px] text-muted-foreground px-1 sm:px-1.5 py-0.5 rounded bg-muted/60 shrink-0">
							#{ node.id }
						</span>
					) }
				</div>

				<div className="flex items-center gap-2 sm:gap-3 shrink-0">
					{ canShowStatement && !node.isVirtual && (
						<Button
							variant="outline"
							size="sm"
							className="h-7 px-2 text-xs"
							title={ t("accountStatement.button") }
							onClick={ (e) =>
							{
								e.stopPropagation();
								AppNavigator.openInNewTab(
									`/reports/accountStatement/${ node.id }/${ encodeURIComponent(node.name) }`
								);
							} }
						>
							<span className="hidden sm:inline">{ t("accountStatement.button") }</span>
							<FileText className="h-3.5 w-3.5 sm:hidden"/>
						</Button>
					) }

					{ canShowBalance && (
						<span
							className={ cn(
								"text-xs sm:text-sm text-end font-mono font-semibold whitespace-nowrap min-w-fit sm:min-w-32",
								getBalanceColorClass(node.balance, node.accountClass)
							) }
						>
							{ node.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) }
							<span className="text-[10px] font-sans mr-1 inline-flex items-center">
								<ErpCurrencyIcon className="inline h-3.5 w-3.5 sm:h-4 sm:w-4"/>
							</span>
						</span>
					) }
				</div>
			</div>

			{ hasChildren && isExpanded && (
				<ul className="mt-0.5">
					{ node.children.map((child) => (
						<TreeNode
							key={ child.id }
							node={ child }
							level={ level + 1 }
							expandedNodes={ expandedNodes }
							onToggle={ onToggle }
						/>
					)) }
				</ul>
			) }
		</li>
	);
}

function createVNode(id: string, name: string, accountClass: AccountClass): TreeNodeData
{
	return {
		id,
		name,
		balance: 0,
		isVirtual: true,
		isParent: true,
		children: [],
		accountClass
	};
}

function buildHierarchicalTree(accounts: AccountDto[]): TreeNodeData[]
{
	const vNodes = {
		ClassAsset: createVNode("class-1", "الأصول (Assets)", AccountClass.Asset),
		ClassLiability: createVNode("class-2", "الالتزامات (Liabilities)", AccountClass.Liability),
		ClassEquity: createVNode("class-3", "حقوق الملكية (Equity)", AccountClass.Equity),
		ClassRevenue: createVNode("class-4", "الإيرادات (Revenues)", AccountClass.Revenue),
		ClassExpense: createVNode("class-5", "المصروفات (Expenses)", AccountClass.Expense),

		TypeCurrentAsset: createVNode(`type-${ AccountType.CurrentAsset }`, "أصول متداولة (Current Assets)", AccountClass.Asset),
		TypeCashAndBank: createVNode(`type-${ AccountType.CashAndBank }`, "النقد والبنوك (Cash & Equivalents)", AccountClass.Asset),
		TypeAccountsReceivable: createVNode(`type-${ AccountType.AccountsReceivable }`, "ذمم مدينة (Accounts Receivable)", AccountClass.Asset),
		TypeInventoryAsset: createVNode(`type-${ AccountType.InventoryAsset }`, "المخزون (Inventory)", AccountClass.Asset),
		TypeInputTax: createVNode(`type-${ AccountType.InputTax }`, "ضريبة المدخلات (Input VAT)", AccountClass.Asset),

		TypeNonCurrentAsset: createVNode(`type-${ AccountType.NonCurrentAsset }`, "أصول غير متداولة (Non-Current Assets)", AccountClass.Asset),

		TypeCurrentLiability: createVNode(`type-${ AccountType.CurrentLiability }`, "التزامات متداولة (Current Liabilities)", AccountClass.Liability),
		TypeAccountsPayable: createVNode(`type-${ AccountType.AccountsPayable }`, "ذمم دائنة (Accounts Payable)", AccountClass.Liability),
		TypeOutputTax: createVNode(`type-${ AccountType.OutputTax }`, "ضريبة المخرجات (Output VAT)", AccountClass.Liability),

		TypeNonCurrentLiability: createVNode(`type-${ AccountType.NonCurrentLiability }`, "التزامات غير متداولة (Non-Current Liabilities)", AccountClass.Liability),

		TypeEquity: createVNode(`type-${ AccountType.Equity }`, "رأس المال (Paid-in Capital)", AccountClass.Equity),
		TypeRetainedEarnings: createVNode(`type-${ AccountType.RetainedEarnings }`, "الأرباح المبقاة (Retained Earnings)", AccountClass.Equity),
		TypeOpeningBalanceEquity: createVNode(`type-${ AccountType.OpeningBalanceEquity }`, "الأرصدة الافتتاحية (Opening Balance Equity)", AccountClass.Equity),

		TypeSalesRevenue: createVNode(`type-${ AccountType.SalesRevenue }`, "إيرادات النشاط (Operating Revenue)", AccountClass.Revenue),

		TypeCostOfGoodsSold: createVNode(`type-${ AccountType.CostOfGoodsSold }`, "تكلفة المبيعات (Cost of Goods Sold)", AccountClass.Expense),
		TypeOperatingExpense: createVNode(`type-${ AccountType.OperatingExpense }`, "مصاريف تشغيلية (Operating & Admin Expenses)", AccountClass.Expense),
		TypeInventoryAdjustment: createVNode(`type-${ AccountType.InventoryAdjustment }`, "تسوية المخزون (Inventory Adjustments)", AccountClass.Expense)
	};

	vNodes.ClassAsset.children.push(vNodes.TypeCurrentAsset, vNodes.TypeNonCurrentAsset);
	vNodes.TypeCurrentAsset.children.push(vNodes.TypeCashAndBank, vNodes.TypeAccountsReceivable, vNodes.TypeInventoryAsset, vNodes.TypeInputTax);

	vNodes.ClassLiability.children.push(vNodes.TypeCurrentLiability, vNodes.TypeNonCurrentLiability);
	vNodes.TypeCurrentLiability.children.push(vNodes.TypeAccountsPayable, vNodes.TypeOutputTax);

	vNodes.ClassEquity.children.push(vNodes.TypeEquity, vNodes.TypeRetainedEarnings, vNodes.TypeOpeningBalanceEquity);

	vNodes.ClassRevenue.children.push(vNodes.TypeSalesRevenue);

	vNodes.ClassExpense.children.push(vNodes.TypeCostOfGoodsSold, vNodes.TypeOperatingExpense, vNodes.TypeInventoryAdjustment);

	const typeMap = new Map<AccountType, TreeNodeData>();
	typeMap.set(AccountType.CurrentAsset, vNodes.TypeCurrentAsset);
	typeMap.set(AccountType.CashAndBank, vNodes.TypeCashAndBank);
	typeMap.set(AccountType.AccountsReceivable, vNodes.TypeAccountsReceivable);
	typeMap.set(AccountType.InventoryAsset, vNodes.TypeInventoryAsset);
	typeMap.set(AccountType.InputTax, vNodes.TypeInputTax);
	typeMap.set(AccountType.NonCurrentAsset, vNodes.TypeNonCurrentAsset);

	typeMap.set(AccountType.CurrentLiability, vNodes.TypeCurrentLiability);
	typeMap.set(AccountType.AccountsPayable, vNodes.TypeAccountsPayable);
	typeMap.set(AccountType.OutputTax, vNodes.TypeOutputTax);
	typeMap.set(AccountType.NonCurrentLiability, vNodes.TypeNonCurrentLiability);

	typeMap.set(AccountType.Equity, vNodes.TypeEquity);
	typeMap.set(AccountType.RetainedEarnings, vNodes.TypeRetainedEarnings);
	typeMap.set(AccountType.OpeningBalanceEquity, vNodes.TypeOpeningBalanceEquity);

	typeMap.set(AccountType.SalesRevenue, vNodes.TypeSalesRevenue);

	typeMap.set(AccountType.CostOfGoodsSold, vNodes.TypeCostOfGoodsSold);
	typeMap.set(AccountType.OperatingExpense, vNodes.TypeOperatingExpense);
	typeMap.set(AccountType.InventoryAdjustment, vNodes.TypeInventoryAdjustment);

	const accountNodesMap = new Map<number, TreeNodeData>();
	accounts.forEach((acc) =>
	{
		accountNodesMap.set(acc.id, {
			id: acc.id,
			name: acc.name,
			balance: acc.balance,
			isVirtual: false,
			isParent: acc.isParent ?? false,
			children: [],
			account: acc,
			accountClass: getAccountClass(acc.type)
		});
	});

	accounts.forEach((acc) =>
	{
		const node = accountNodesMap.get(acc.id)!;
		if (acc.parentAccountId)
		{
			const parentNode = accountNodesMap.get(acc.parentAccountId);
			if (parentNode)
			{
				parentNode.children.push(node);
			}
			else
			{
				const typeNode = typeMap.get(acc.type);
				if (typeNode) typeNode.children.push(node);
			}
		}
		else
		{
			const typeNode = typeMap.get(acc.type);
			if (typeNode) typeNode.children.push(node);
		}
	});

	function calculateSubBalances(node: TreeNodeData): number
	{
		if (!node.isVirtual)
		{
			const childrenTotal = node.children.reduce((accSum, child) => accSum + calculateSubBalances(child), 0);
			return node.balance + childrenTotal;
		}
		else
		{
			const virtualSum = node.children.reduce((accSum, child) => accSum + calculateSubBalances(child), 0);
			node.balance = virtualSum;
			return virtualSum;
		}
	}

	const roots = [vNodes.ClassAsset, vNodes.ClassLiability, vNodes.ClassEquity, vNodes.ClassRevenue, vNodes.ClassExpense];

	roots.forEach((root) => calculateSubBalances(root));

	function pruneEmptyVirtualNodes(nodes: TreeNodeData[]): TreeNodeData[]
	{
		return nodes.filter(node =>
		{
			if (node.children.length > 0)
			{
				node.children = pruneEmptyVirtualNodes(node.children);
			}
			return node.children.length > 0 || !node.isVirtual;
		});
	}

	return pruneEmptyVirtualNodes(roots);
}