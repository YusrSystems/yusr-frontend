import { useSignals } from "@preact/signals-react/runtime";
import { PosTerminalDto } from "@/core/data/posTerminal";
import { Cubits } from "@/core/services/cubits";
import { ItemDto } from "@/core/data/item";
import { PageLoaded, PageLoading } from "yusr-ui";
import { Loader2, ScanBarcode, Search, Star } from "lucide-react";
import { useMemo } from "react";
import { signal } from "@preact/signals-react";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";


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
					<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
						{ items.map(item =>
						{
							const isFavorite = favoriteIds.includes(item.id);
							const defaultUom = item.uoMs?.[0];
							const defaultPrice = defaultUom?.prices?.[0]?.price ?? 0;
							const imageUrl = item.itemImages?.[0]?.url;

							return (
								<div
									key={ item.id }
									onClick={ () => onAddItem(item) }
									className="relative flex flex-col bg-card border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all active:scale-95 select-none"
								>
									{ isFavorite && (
										<div
											className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow-sm">
											<Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
										</div>
									) }

									<div className="h-24 bg-muted flex items-center justify-center overflow-hidden">
										{ imageUrl ? (
											<img src={ imageUrl } alt={ item.name }
											     className="w-full h-full object-cover"/>
										) : (
											<span className="text-muted-foreground text-xs">لا توجد صورة</span>
										) }
									</div>

									<div className="p-3 flex flex-col flex-1 justify-between gap-2">
										<span
											className="font-semibold text-sm line-clamp-2 leading-tight">{ item.name }</span>
										<div className="flex items-center justify-between mt-auto">
											<span
												className="text-xs text-muted-foreground">{ defaultUom?.unitName }</span>
											<span className="font-bold text-primary flex items-center gap-1">
												{ defaultPrice.toLocaleString() } <ErpCurrencyIcon className="w-3 h-3"/>
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
			<div className="p-4 bg-card border-b border-border flex gap-4 shrink-0">
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
					<ScanBarcode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
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

			{ renderContent() }
		</div>
	);
}