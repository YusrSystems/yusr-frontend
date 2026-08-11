import { useSignals } from "@preact/signals-react/runtime";
import { PosTerminalDto } from "@/core/data/posTerminal";
import { Cubits } from "@/core/services/cubits";
import { ItemDto } from "@/core/data/item";
import { Button, PageLoaded, PageLoading } from "yusr-ui";
import { Loader2, ScanBarcode, Search, Star } from "lucide-react";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import InvoiceItemsMath from "@/features/invoices/logic/invoiceItemsMath";


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
	const selectedCategoryId = useMemo(() => signal<number | undefined>(undefined), []);

	useEffect(() =>
	{
		Cubits.categories.init();
	}, []);

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
			let items = Cubits.items.entities.value;

			if (searchQuery.value)
			{
				const lowerQuery = searchQuery.value.toLowerCase();
				items = items.filter(i => i.name.toLowerCase().includes(lowerQuery));
			}

			if (selectedCategoryId.value)
			{
				items = items.filter(i => i.itemCategories?.some(c => c.categoryId === selectedCategoryId.value));
			}

			// Sort favorites first
			const favoriteIds = terminal.favoriteItems.map(f => f.itemId);
			items = [...items].sort((a, b) =>
			{
				const aFav = favoriteIds.includes(a.id) ? 1 : 0;
				const bFav = favoriteIds.includes(b.id) ? 1 : 0;
				return bFav - aFav;
			});

			return (
				<div className="flex-1 overflow-y-auto p-4">
					<div className="grid grid-cols-3 md:grid-cols-4 gap-4">
						{ items.map(item =>
						{
							const isFavorite = favoriteIds.includes(item.id);
							const defaultUom = item.uoMs?.[0];
							const basePrice = defaultUom?.prices?.[0]?.price ?? 0;

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
									className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-lg transition-all duration-200 active:scale-[0.97] select-none h-full"
								>
									{ isFavorite && (
										<div
											className="absolute top-2 right-2 z-10 bg-background/90 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-border/50">
											<Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"/>
										</div>
									) }

									<div
										className="h-28 bg-muted/50 flex items-center justify-center overflow-hidden relative">
										{ imageUrl ? (
											<>
												<img src={ imageUrl } alt={ item.name }
												     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
												<div
													className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
											</>
										) : (
											<span
												className="text-muted-foreground/50 text-xs font-medium">لا توجد صورة</span>
										) }
									</div>

									<div className="p-3.5 flex flex-col flex-1 gap-2.5">
										<div className="flex flex-col gap-1">
											{ item.brandName && (
												<span
													className="text-[10px] font-bold text-primary/70 uppercase tracking-wider line-clamp-1">
													{ item.brandName }
												</span>
											) }
											<span
												className="font-bold text-sm line-clamp-2 leading-snug text-foreground group-hover:text-primary transition-colors">
												{ item.name }
											</span>
										</div>

										{ item.itemCategories && item.itemCategories.length > 0 && (
											<div className="flex flex-wrap gap-1.5 mt-0.5">
												{ item.itemCategories.slice(0, 2).map(c => (
													<span key={ c.categoryId }
													      className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-secondary-foreground border border-border/50">
														{ c.categoryName }
													</span>
												)) }
												{ item.itemCategories.length > 2 && (
													<span
														className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
														+{ item.itemCategories.length - 2 }
													</span>
												) }
											</div>
										) }

										<div
											className="mt-auto pt-3 flex items-end justify-between border-t border-border/40">
											<span
												className="text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border border-border/50">
												{ defaultUom?.unitName }
											</span>
											<span className="font-black text-primary flex items-center gap-1 text-base">
												{ taxInclusivePrice.toLocaleString(undefined, {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}) }
												<ErpCurrencyIcon
													className="w-3.5 h-3.5 text-muted-foreground/70 mb-0.5"/>
											</span>
										</div>
									</div>
								</div>
							);
						}) }
					</div>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="flex flex-col h-full bg-muted/10">
			<div className="flex flex-col bg-card border-b border-border shrink-0">
				<div className="p-4 flex gap-4">
					<div className="relative flex-1">
						<Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
						<input
							type="text"
							placeholder="البحث عن منتج..."
							value={ searchQuery.value }
							onChange={ (e) => searchQuery.value = e.target.value }
							className="w-full h-12 pl-4 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
						/>
					</div>
					<div className="relative w-64">
						<ScanBarcode
							className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
						<input
							type="text"
							placeholder="قراءة الباركود..."
							value={ barcodeQuery.value }
							onChange={ (e) => barcodeQuery.value = e.target.value }
							onKeyDown={ handleBarcodeSubmit }
							disabled={ isBarcodeLoading.value }
							className="w-full h-12 pl-4 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
						/>
						{ isBarcodeLoading.value && (
							<Loader2
								className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary"/>
						) }
					</div>
				</div>
				<div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
					<Button
						variant={ selectedCategoryId.value === undefined ? "default" : "outline" }
						size="sm"
						className="rounded-full whitespace-nowrap"
						onClick={ () => selectedCategoryId.value = undefined }
					>
						الكل
					</Button>
					{ Cubits.categories.state.value instanceof PageLoaded && Cubits.categories.entities.value.map(cat => (
						<Button
							key={ cat.id }
							variant={ selectedCategoryId.value === cat.id ? "default" : "outline" }
							size="sm"
							className="rounded-full whitespace-nowrap"
							onClick={ () => selectedCategoryId.value = cat.id }
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