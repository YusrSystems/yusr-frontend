import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { ChevronDown, ChevronLeft, FolderTree, List, Printer, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	ChangeableEntityMode,
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


interface TreeNodeData
{
	id: string | number;
	name: string;
	balance: number;
	isVirtual: boolean;
	isParent: boolean;
	children: TreeNodeData[];
	account?: AccountDto;
}

export default function AccountsPage()
{
	useSignals();
	const {t} = useTranslation(["accounting", "erpCommon"]);
	const [viewMode, setViewMode] = useState<"table" | "tree">("table");

	useEffect(() =>
	{
		Cubits.accounts.init();
	}, []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.Accounts, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<>
			<CrudPage<AccountDto>>
				<CrudPage.HeaderContainer>
					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<h1>{ viewMode === "table" ? t("accounts.title") : "شجرة الحسابات" }</h1>
						<YoutubeButton videoId="WNCe2c2kqCw"/>
					</div>

					<CrudPage.HeaderButtonsContainer>
						<div className="flex bg-muted/40 rounded-lg p-1 border">
							<Button
								variant={ viewMode === "table" ? "default" : "ghost" }
								size="sm"
								onClick={ () => setViewMode("table") }
								className="gap-1.5"
							>
								<List className="h-4 w-4"/>
								<span>{ t("erpCommon:reports.tableView", "عرض جدول") }</span>
							</Button>
							<Button
								variant={ viewMode === "tree" ? "default" : "ghost" }
								size="sm"
								onClick={ () => setViewMode("tree") }
								className="gap-1.5"
							>
								<FolderTree className="h-4 w-4"/>
								<span>{ t("erpCommon:reports.treeView", "عرض شجرة") }</span>
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
						const result = await Services.accountsApi.Get(id);
						return result.data;
					} }
					changeDialog={ (dto: AccountDto | undefined, closeDialog) => (
						<ChangeAccountDialog
							dto={ dto }
							service={ Services.accountsApi }
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
								Cubits.accounts.init();
							} }
						/>
					) }
				/>

				<CrudPage.DeleteDialog
					entityNameSelector={ (account) => account.name }
					service={ Services.accountsApi }
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
						{rowBody: t("accounts.balance"), rowStyles: "w-32"}
					] }
					tableRowMapper={ (account) => [
						{rowBody: `#${ account.id }`, rowStyles: ""},
						{rowBody: account.name, rowStyles: "font-semibold"},
						{
							rowBody: (
								<div className="flex items-center gap-1 font-mono">
									{ account.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) }
									<ErpCurrencyIcon/>
								</div>
							),
							rowStyles: account.balance < 0 ? "text-red-600" : "text-green-600"
						}
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
		<div className="border rounded-b-xl p-6 bg-card text-foreground overflow-y-auto">
			<ul className="space-y-1">
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
	const hasChildren = node.children.length > 0;
	const isExpanded = !!expandedNodes[node.id];

	return (
		<li className="flex flex-col">
			<div
				onClick={ () => hasChildren && onToggle(node.id) }
				style={ {paddingRight: `${ level * 20 }px`} }
				className={ `flex items-center justify-between py-2.5 border-b border-muted/30 hover:bg-muted/10 rounded-md transition-colors px-3 ${
					node.isVirtual ? "cursor-pointer" : "cursor-default"
				}` }
			>
				<div className="flex items-center gap-2">
					{ hasChildren ? (
						<div className="h-5 w-5 flex items-center justify-center ms-3 shrink-0">
							{ isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronLeft className="h-4 w-4"/> }
						</div>
					) : (
						<div className="h-5 w-5 shrink-0"/>
					) }
					<span className={ `text-sm ${ node.isVirtual ? "font-bold text-primary" : "font-normal" }` }>
						{ node.name }
					</span>
					{ !node.isVirtual && (
						<span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60">
							#{ node.id }
						</span>
					) }
				</div>

				<div className="flex items-center gap-4">
					<span
						className={ `text-sm font-mono font-semibold ${ node.balance < 0 ? "text-red-600" : "text-green-600" }` }>
						{ node.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) }
						<span className="text-[10px] font-sans mr-1">
							<ErpCurrencyIcon className="inline h-3 w-3"/>
						</span>
					</span>
				</div>
			</div>

			{ hasChildren && isExpanded && (
				<ul className="mt-1">
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

function buildHierarchicalTree(accounts: AccountDto[]): TreeNodeData[]
{
	const classMap: Record<AccountClass, TreeNodeData> = {
		[AccountClass.Asset]: {
			id: "class-1",
			name: "الأصول (Assets)",
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		},
		[AccountClass.Liability]: {
			id: "class-2",
			name: "الالـتزامات (Liabilities)",
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		},
		[AccountClass.Equity]: {
			id: "class-3",
			name: "حقوق الملكية (Equity)",
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		},
		[AccountClass.Revenue]: {
			id: "class-4",
			name: "الإيرادات (Revenues)",
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		},
		[AccountClass.Expense]: {
			id: "class-5",
			name: "المصروفات (Expenses)",
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		}
	};

	const typeMap = new Map<AccountType, TreeNodeData>();
	const typeDefinitions = [
		{type: AccountType.CurrentAsset, label: "أصول متداولة (Current Assets)"},
		{type: AccountType.AccountsReceivable, label: "ذمم مدينة (Accounts Receivable)"},
		{type: AccountType.CashAndBank, label: "النقد والبنوك (Cash & Bank)"},
		{type: AccountType.NonCurrentAsset, label: "أصول غير متداولة (Non-Current Assets)"},
		{type: AccountType.InputTax, label: "ضريبة مدخلات (Input Tax)"},
		{type: AccountType.InventoryAsset, label: "أصول المخزون (Inventory Assets)"},

		{type: AccountType.CurrentLiability, label: "التزامات متداولة (Current Liabilities)"},
		{type: AccountType.AccountsPayable, label: "ذمم دائنة (Accounts Payable)"},
		{type: AccountType.NonCurrentLiability, label: "التزامات غير متداولة (Non-Current Liabilities)"},
		{type: AccountType.OutputTax, label: "ضريبة مخرجات (Output Tax)"},

		{type: AccountType.Equity, label: "حقوق الملكية (Equity)"},
		{type: AccountType.OpeningBalanceEquity, label: "حقوق ملكية رصيد افتتاحي (Opening Balance Equity)"},

		{type: AccountType.SalesRevenue, label: "إيرادات المبيعات (Sales Revenue)"},
		{type: AccountType.CostOfGoodsSold, label: "تكلفة البضاعة المباعة (Cost of Goods Sold)"},
		{type: AccountType.OperatingExpense, label: "مصاريف تشغيلية (Operating Expenses)"}
	];

	typeDefinitions.forEach((def) =>
	{
		const cls = getAccountClass(def.type);
		const typeNode: TreeNodeData = {
			id: `type-${ def.type }`,
			name: def.label,
			balance: 0,
			isVirtual: true,
			isParent: true,
			children: []
		};
		typeMap.set(def.type, typeNode);
		classMap[cls].children.push(typeNode);
	});

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
			account: acc
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

	const roots = Object.values(classMap);
	roots.forEach((root) => calculateSubBalances(root));

	roots.forEach((root) =>
	{
		root.children = root.children.filter((typeNode) => typeNode.children.length > 0);
	});

	return roots.filter((root) => root.children.length > 0);
}