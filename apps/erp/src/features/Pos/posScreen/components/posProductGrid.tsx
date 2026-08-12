import { useSignals } from "@preact/signals-react/runtime";
import { PosTerminalDto } from "@/core/data/posTerminal";
import { Cubits } from "@/core/services/cubits";
import { ItemDto, ItemType } from "@/core/data/item";
import {
	Button,
	CrudTablePagination,
	DateService,
	type FilterGroupDto,
	FilterOperator,
	PageLoaded,
	PageLoading,
	ResultStatus,
	SearchInput
} from "yusr-ui";
import { Loader2, Package, ScanBarcode, Star } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";
import { Services } from "@/core/services/services";
import { toast } from "sonner";


interface PosProductGridProps
{
	terminal: PosTerminalDto;
	onAddItem: (item: ItemDto, uomId?: number, pmId?: number) => void;
}

export default function PosProductGrid({terminal, onAddItem}: PosProductGridProps)
{
	useSignals();

	const searchQuery = useMemo(() => signal(""), []);
	const barcodeQuery = useMemo(() => signal(""), []);
	const isBarcodeLoading = useMemo(() => signal(false), []);

	// Track active filter: "all", "favorites", or category ID
	const activeFilter = useMemo(() => signal<"all" | "favorites" | number>("all"), []);

	// Local reactive mirror of terminal.favoriteItems. `terminal` is a plain prop object,
	// so mutating `terminal.favoriteItems` directly does NOT trigger a re-render under
	// @preact/signals-react — only writes to a signal's `.value` do. Reads/writes go
	// through this signal instead, and we sync it if the parent ever passes a new terminal.
	const favoriteItems = useMemo(() => signal(terminal.favoriteItems ?? []), []);

	useEffect(() =>
	{
		favoriteItems.value = terminal.favoriteItems ?? [];
	}, [terminal.favoriteItems]);

	useEffect(() =>
	{
		Cubits.categories.init();
	}, []);

	const fetchItems = () =>
	{
		const types = [ItemType.Product, ItemType.Service];
		const query: Record<string, string | number | boolean> = {
			storeId: terminal.storeId,
			targetDate: DateService.formatDateOnly(new Date()),
			onlyInStore: true
		};

		const groups: FilterGroupDto[] = [];

		if (activeFilter.value === "favorites")
		{
			groups.push({
				id: 0,
				rules: [{
					id: 0,
					field: "PosTerminalFavoriteItems",
					operator: FilterOperator.Equal,
					value: terminal.id
				}]
			});
		}
		else if (typeof activeFilter.value === "number")
		{
			// Category filter
			groups.push({
				id: 0,
				rules: [{
					id: 0,
					field: "ItemCategories",
					operator: FilterOperator.Includes,
					value: [activeFilter.value]
				}]
			});
		}

		void Cubits.items.filter(
			Cubits.items.currentPage.value,
			24,
			searchQuery.value,
			types,
			query,
			groups
		);
	};

	useEffect(() =>
	{
		Cubits.items.currentPage.value = 1;
		fetchItems();
	}, [activeFilter.value]);

	const handleSearchChange = (value: string | undefined) =>
	{
		searchQuery.value = value ?? "";
		Cubits.items.currentPage.value = 1;
		fetchItems();
	};

	const handleBarcodeSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) =>
	{
		if (e.key === "Enter" && barcodeQuery.value)
		{
			isBarcodeLoading.value = true;
			const res = await Cubits.items.getByBarcode(barcodeQuery.value, terminal.storeId);
			if (res)
			{
				onAddItem(res.item, res.selectedUoMId, res.selectedPricingMethodId);
			}
			barcodeQuery.value = "";
			isBarcodeLoading.value = false;
		}
	};

	const toggleFavorite = async (e: React.MouseEvent, item: ItemDto) =>
	{
		e.stopPropagation(); // Prevent triggering onAddItem

		const isFav = favoriteItems.value.some(f => f.itemId === item.id);

		// Helper function for the API call to use inside toast.promise
		const processToggle = async () =>
		{
			if (isFav)
			{
				// Background API call
				const res = await Services.posTerminalsApi.RemoveFavorite(terminal.id, item.id);
				if (res.status !== ResultStatus.Ok)
				{
					// Rollback on failure
					favoriteItems.value = [...favoriteItems.value, {
						itemId: item.id,
						posTerminalId: terminal.id,
						itemName: item.name,
						displayOrder: 0,
						id: 0
					}];
					terminal.favoriteItems = favoriteItems.value;
					throw new Error("فشل في إزالة المادة من المفضلة");
				}

				// Refresh grid if on favorites tab
				if (activeFilter.value === "favorites")
				{
					fetchItems();
				}
			}
			else
			{
				const currentMaxOrder = favoriteItems.value.length > 0
					? Math.max(...favoriteItems.value.map(f => f.displayOrder))
					: 0;

				// Background API call
				const res = await Services.posTerminalsApi.AddFavorite(terminal.id, item.id, currentMaxOrder + 1);
				if (res.status !== ResultStatus.Ok)
				{
					// Rollback on failure
					favoriteItems.value = favoriteItems.value.filter(f => f.itemId !== item.id);
					terminal.favoriteItems = favoriteItems.value;
					throw new Error("فشل في إضافة المادة للمفضلة");
				}
			}
		};

		// 1. Optimistic UI Update instantly
		if (isFav)
		{
			favoriteItems.value = favoriteItems.value.filter(f => f.itemId !== item.id);
		}
		else
		{
			const currentMaxOrder = favoriteItems.value.length > 0
				? Math.max(...favoriteItems.value.map(f => f.displayOrder))
				: 0;
			favoriteItems.value = [...favoriteItems.value, {
				itemId: item.id,
				posTerminalId: terminal.id,
				itemName: item.name,
				displayOrder: currentMaxOrder + 1,
				id: 0
			}];
		}

		// Keep the terminal object itself in sync too, in case other code reads it directly
		terminal.favoriteItems = favoriteItems.value;

		// 2. Trigger Toast Promise
		toast.promise(processToggle(), {
			loading: "جاري التحديث...",
			success: () => isFav ? "تمت إزالة المادة من المفضلة" : "تمت إضافة المادة للمفضلة",
			error: (err) => err.message || "حدث خطأ في الاتصال بالخادم"
		});
	};

	const renderContent = () =>
	{
		if (Cubits.items.state.value instanceof PageLoading)
		{
			return (
				<div className="flex-1 flex items-center justify-center">
					<Loader2 className="w-8 h-8 animate-spin text-primary"/>
				</div>
			);
		}

		if (Cubits.items.state.value instanceof PageLoaded)
		{
			const items = [...Cubits.items.entities.value];
			const favoriteIds = favoriteItems.value.map(f => f.itemId);
			const favoriteOrderMap = new Map(favoriteItems.value.map(f => [f.itemId, f.displayOrder]));

			if (activeFilter.value === "favorites")
			{
				// Favorites tab: sort strictly by the manager-defined displayOrder
				items.sort((a, b) => (favoriteOrderMap.get(a.id) ?? 0) - (favoriteOrderMap.get(b.id) ?? 0));
			}
			else
			{
				// Other tabs: favorites first (ordered by displayOrder), non-favorites keep
				// their existing (backend) order relative to each other
				items.sort((a, b) =>
				{
					const aOrder = favoriteOrderMap.get(a.id);
					const bOrder = favoriteOrderMap.get(b.id);

					if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
					if (aOrder !== undefined) return -1;
					if (bOrder !== undefined) return 1;
					return 0;
				});
			}

			if (items.length === 0)
			{
				return (
					<div
						className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
						<Package className="w-12 h-12 mb-3 opacity-20"/>
						<p>{ activeFilter.value === "favorites" ? "لا توجد عناصر في المفضلة" : "لا توجد منتجات تطابق بحثك" }</p>
					</div>
				);
			}

			return (
				<div className="flex-1 flex flex-col min-h-0">
					<div className="flex-1 overflow-y-auto p-3">
						<div
							className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
							{ items.map(item =>
							{
								const isFavorite = favoriteIds.includes(item.id);
								const defaultUom = item.uoMs?.[0];
								const basePrice = defaultUom?.prices?.[0]?.price ?? 0;

								// Safely get and format quantity
								const quantity = item.storeQuantity ?? 0;
								const formattedQty = Number.isInteger(quantity) ? quantity : quantity.toFixed(2);

								// Calculate the price after tax
								const {taxInclusivePrice} = InvoiceItemsMath.GetPrices(
									item.taxIncluded ?? false,
									basePrice,
									item.totalTaxes ?? 0
								);

								const imageUrl = item.itemImages?.[0]?.url;

								return (
									<div
										key={ item.id }
										onClick={ () => onAddItem(item) }
										className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-200 active:scale-[0.97] select-none h-full"
									>
										{/* Favorite Toggle Button */ }
										<button
											onClick={ (e) => toggleFavorite(e, item) }
											className="absolute top-1.5 right-1.5 z-10 bg-background/90 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-border/50 hover:bg-muted transition-colors"
										>
											<Star
												className={ `w-3.5 h-3.5 ${ isFavorite ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground" }` }/>
										</button>

										<div
											className="w-full h-50 max-h-50 aspect-4/3 bg-white flex items-center justify-center overflow-hidden relative border-b border-border/40 p-2">
											{ imageUrl ? (
												<img
													src={ imageUrl }
													alt={ item.name }
													className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
												/>
											) : (
												<span
													className="text-muted-foreground/50 text-[10px] font-medium">لا توجد صورة</span>
											) }
										</div>

										<div className="p-2.5 flex flex-col flex-1 gap-2">
											<div className="flex flex-col gap-0.5">
												{ item.brandName && (
													<span
														className="text-[9px] font-bold text-primary/70 uppercase tracking-wider line-clamp-1">
														{ item.brandName }
													</span>
												) }
												<span
													className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
													{ item.name }
												</span>
											</div>

											{ item.itemCategories && item.itemCategories.length > 0 && (
												<div className="flex flex-wrap gap-1 mt-0.5">
													{ item.itemCategories.slice(0, 2).map(c => (
														<span key={ c.categoryId }
														      className="inline-flex items-center px-1.5 py-px rounded-md text-[9px] font-medium bg-secondary text-secondary-foreground border border-border/50">
															{ c.categoryName }
														</span>
													)) }
													{ item.itemCategories.length > 2 && (
														<span
															className="inline-flex items-center px-1.5 py-px rounded-md text-[9px] font-medium bg-muted text-muted-foreground border border-border/50">
															+{ item.itemCategories.length - 2 }
														</span>
													) }
												</div>
											) }

											<div
												className="mt-auto pt-2 flex items-end justify-between border-t border-border/40">
												{/* Unit and Quantity display */ }
												<div
													className="flex items-center gap-1.5 bg-muted/50 px-1.5 py-0.5 rounded-md border border-border/50">
													<span className="text-[10px] font-medium text-muted-foreground">
														{ defaultUom?.unitName }
													</span>
													<span
														className="w-0.75 h-0.75 rounded-full bg-muted-foreground/40"/>
													<div className="flex items-center gap-0.5 text-primary/80">
														<Package className="w-3 h-3"/>
														<span className="text-[11px] font-bold" dir="ltr">
															{ formattedQty }
														</span>
													</div>
												</div>
												<span
													className="font-black text-primary flex items-center gap-1 text-base">
													{ taxInclusivePrice.toLocaleString(undefined, {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2
													}) }
													<ErpCurrencyIcon
														className="w-4 h-4 text-muted-foreground/70 mb-0.5"/>
												</span>
											</div>
										</div>
									</div>
								);
							}) }
						</div>
					</div>

					{/* Backend Pagination Footer */ }
					{ Cubits.items.count.value > 0 && (
						<div className="border-t border-border shrink-0 bg-card z-10 p-1">
							<CrudTablePagination
								pageSize={ Cubits.items.pageSize.value }
								totalNumber={ Cubits.items.count.value }
								currentPage={ Cubits.items.currentPage.value }
								onPageChanged={ (newPage) =>
								{
									Cubits.items.currentPage.value = newPage;
									fetchItems();
								} }
								className="border-none py-2 bg-transparent"
							/>
						</div>
					) }
				</div>
			);
		}

		return null;
	};

	return (
		<div className="flex flex-col h-full bg-muted/10">
			<div className="flex flex-col bg-card border-b border-border shrink-0">
				<div className="p-3 flex gap-3 items-center">
					<div className="flex-1">
						<SearchInput
							onSearch={ handleSearchChange }
							className="bg-transparent border-none p-0 rounded-none w-full"
						/>
					</div>
					<div className="relative w-64 shrink-0 h-8">
						<ScanBarcode
							className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
						<input
							type="text"
							placeholder="قراءة الباركود..."
							value={ barcodeQuery.value }
							onChange={ (e) => barcodeQuery.value = e.target.value }
							onKeyDown={ handleBarcodeSubmit }
							disabled={ isBarcodeLoading.value }
							className="w-full h-8 pl-4 pr-9 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
						/>
						{ isBarcodeLoading.value && (
							<Loader2
								className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary"/>
						) }
					</div>
				</div>
				<div className="px-3 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
					<Button
						variant={ activeFilter.value === "all" ? "default" : "outline" }
						size="sm"
						className="rounded-full whitespace-nowrap h-8 text-xs font-bold"
						onClick={ () => activeFilter.value = "all" }
					>
						الكل
					</Button>

					<Button
						variant={ activeFilter.value === "favorites" ? "default" : "outline" }
						size="sm"
						className="rounded-full whitespace-nowrap h-8 text-xs font-bold gap-1"
						onClick={ () => activeFilter.value = "favorites" }
					>
						<Star
							className={ `w-3.5 h-3.5 ${ activeFilter.value === "favorites" ? "fill-primary-foreground" : "fill-muted-foreground text-muted-foreground" }` }/>
						المفضلة
					</Button>

					<div className="w-px h-6 bg-border mx-1 self-center"/>

					{ Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.map(cat => (
						<Button
							key={ cat.id }
							variant={ activeFilter.value === cat.id ? "default" : "outline" }
							size="sm"
							className="rounded-full whitespace-nowrap h-8 text-xs"
							onClick={ () => activeFilter.value = cat.id }
						>
							{ cat.name }
						</Button>
					)) }
				</div>
			</div>

			{ renderContent() }
		</div>
	);
}