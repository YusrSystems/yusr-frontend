import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import {
	BranchesSearchableSelect,
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { PosTerminal, type PosTerminalDto, type PosTerminalFavoriteItemDto } from "@/core/data/posTerminal.ts";
import { useEffect, useMemo } from "react";
import { signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import ItemsSearchableSelect from "@/core/components/searchableSelect/itemsSearchableSelect.tsx";
import PaymentMethodsMultiSearchableSelect
	from "@/core/components/searchableSelect/paymentMethodsMultiSearchableSelect.tsx";
import UsersMultiSearchableSelect from "@/core/components/searchableSelect/usersMultiSearchableSelect.tsx";
import { PartnerType } from "@/core/data/partner.ts";
import { ChevronDown, ChevronUp, GripVertical, MonitorSmartphone, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ItemDto } from "@/core/data/item.ts";


export default function ChangePosTerminalDialog({dto, service, onSuccess}: CommonChangeDialogProps<PosTerminalDto>)
{
	useSignals();

	const entity = useMemo(() => signal<PosTerminal>(dto ? PosTerminal.load(dto) : PosTerminal.create()), []);

	useEffect(() =>
	{
		Cubits.stores.init();
		Cubits.branches.init();
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.paymentMethods.init();
		Cubits.users.init();
	}, []);

	useEffect(() =>
	{
		Cubits.items.initForStoreAndDate(undefined, entity.value.storeId.value);
	}, [entity.value.storeId.value]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create && !Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Add)) ||
		(entity.value.mode.value === ChangeableEntityMode.Update && !Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create ? "إضافة نقطة بيع جديدة" : "تعديل نقطة البيع";

	return (
		<ChangeDialog className="sm:max-w-3xl">
			<ChangeDialog.Header title={ title }/>

			<ChangeDialog.Tabbed
				className="h-auto min-h-[50vh]"
				tabs={ [
					{
						label: "البيانات الأساسية",
						icon: MonitorSmartphone,
						active: true,
						hasError: entity.value.hasErrors,
						content: <GeneralTab
							entity={ entity.value }
						/>
					}, {
						label: "ترتيب المفضلة",
						icon: Star,
						active: false,
						content: <FavoritesOrderTab entity={ entity.value }/>
					}
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton
					entity={ entity }
					service={ service }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}

function GeneralTab({
	entity
}: {
	entity: PosTerminal;
})
{
	useSignals();

	return (
		<div className="max-h-[55vh] overflow-y-auto px-1 py-1 space-y-4 animate-in fade-in">
			<FieldGroup>
				<FieldsSection columns={ 2 }>
					<TextField
						label="اسم نقطة البيع"
						required
						value={ entity.name }
						error={ entity.getError("name") }
					/>
					<FormField label="الفرع" required error={ entity.getError("branchId") }>
						<BranchesSearchableSelect
							id={ entity.branchId }
							label={ entity.branchName }
						/>
					</FormField>
					<FormField label="المستودع" required error={ entity.getError("storeId") }>
						<StoresSearchableSelect
							id={ entity.storeId }
							label={ entity.storeName }
						/>
					</FormField>
					<FormField label="العميل الافتراضي">
						<PartnersSearchableSelect
							id={ entity.defaultPartnerId }
							label={ entity.defaultPartnerName }
							types={ [PartnerType.Customer] }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection title="الصلاحيات وطرق الدفع" columns={ 2 }>
					<FormField label="طرق الدفع المسموحة">
						<PaymentMethodsMultiSearchableSelect
							selectedItems={ entity.allowedPaymentMethods }
							onToggle={ (_, selectedItems) =>
							{
								entity.allowedPaymentMethods.value = selectedItems;
							} }
						/>
					</FormField>
					<FormField label="المستخدمون المصرح لهم">
						<UsersMultiSearchableSelect
							selectedItems={ entity.posTerminalUsers }
							onToggle={ (_, selectedItems) =>
							{
								entity.posTerminalUsers.value = selectedItems;
							} }
						/>
					</FormField>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}

function FavoritesOrderTab({entity}: { entity: PosTerminal })
{
	useSignals();

	const items = useMemo(() => signal<PosTerminalFavoriteItemDto[]>(
		[...entity.favoriteItems.value].sort((a, b) => a.displayOrder - b.displayOrder)
	), []);

	const draggedIndex = useMemo(() => signal<number | null>(null), []);

	// Renumber sequentially (1..n) based on array position, then push back onto the entity
	// so it's picked up automatically when the dialog saves.
	const commit = (next: PosTerminalFavoriteItemDto[]) =>
	{
		const renumbered = next.map((fav, idx) => ({...fav, displayOrder: idx + 1}));
		items.value = renumbered;
		entity.favoriteItems.value = renumbered;
		entity.hasChanges.value = true;
	};

	const addItem = (item?: ItemDto) =>
	{
		if (item == undefined || !item.id || !item.name) return;

		if (items.value.some(f => f.itemId === item.id))
		{
			toast.error("هذا العنصر مضاف بالفعل إلى المفضلة");
			return;
		}

		const newFavorite = {
			id: 0,
			posTerminalId: entity.id.value ?? 0,
			itemId: item.id,
			itemName: item.name,
			displayOrder: items.value.length + 1
		} as PosTerminalFavoriteItemDto;

		commit([...items.value, newFavorite]);
	};

	const removeItem = (index: number) =>
	{
		const next = [...items.value];
		next.splice(index, 1);
		commit(next);
	};

	const move = (index: number, direction: -1 | 1) =>
	{
		const target = index + direction;
		if (target < 0 || target >= items.value.length) return;
		const next = [...items.value];
		[next[index], next[target]] = [next[target]!, next[index]!];
		commit(next);
	};

	const setPosition = (index: number, rawPosition: number) =>
	{
		if (Number.isNaN(rawPosition)) return;
		const clamped = Math.min(Math.max(Math.round(rawPosition), 1), items.value.length);
		if (clamped === index + 1) return;
		const next = [...items.value];
		const [moved] = next.splice(index, 1);
		next.splice(clamped - 1, 0, moved!);
		commit(next);
	};

	const handleDrop = (index: number) =>
	{
		if (draggedIndex.value === null || draggedIndex.value === index) return;
		const next = [...items.value];
		const [moved] = next.splice(draggedIndex.value, 1);
		next.splice(index, 0, moved!);
		commit(next);
		draggedIndex.value = null;
	};

	return (
		<div className="max-h-[55vh] overflow-y-auto px-1 py-1 space-y-3 animate-in fade-in">
			<div className="flex items-end gap-2 p-2.5 rounded-lg border border-dashed border-border bg-muted/30">
				<div className="flex-1">
					<FormField label="إضافة عنصر إلى المفضلة">
						<ItemsSearchableSelect
							onSelect={ (item) =>
							{
								addItem(item);
							} }
						/>
					</FormField>
				</div>
			</div>

			{ items.value.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-muted-foreground py-10 text-sm gap-2">
					<Star className="w-8 h-8 opacity-20"/>
					لا توجد عناصر مفضلة لهذه النقطة بعد
				</div>
			) : (
				<>
					<p className="text-xs text-muted-foreground">
						اسحب العناصر لإعادة ترتيبها، أو استخدم الأسهم، أو أدخل رقم الترتيب مباشرة لتحديد موضع الزر في
						شاشة نقطة البيع (مثال: أهم 4 مشروبات في الصف الأول).
					</p>

					{ items.value.map((fav, index) => (
						<div
							key={ fav.itemId }
							draggable
							onDragStart={ () => draggedIndex.value = index }
							onDragOver={ (e) => e.preventDefault() }
							onDrop={ () => handleDrop(index) }
							onDragEnd={ () => draggedIndex.value = null }
							className={ `flex items-center gap-2 p-2 rounded-lg border bg-card transition-colors ${
								draggedIndex.value === index ? "opacity-40 border-primary" : "border-border"
							}` }
						>
							<GripVertical
								className="w-4 h-4 text-muted-foreground/40 shrink-0 cursor-grab active:cursor-grabbing"/>

							<div className="flex flex-col shrink-0">
								<button
									type="button"
									disabled={ index === 0 }
									onClick={ () => move(index, -1) }
									className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
								>
									<ChevronUp className="w-3.5 h-3.5"/>
								</button>
								<button
									type="button"
									disabled={ index === items.value.length - 1 }
									onClick={ () => move(index, 1) }
									className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
								>
									<ChevronDown className="w-3.5 h-3.5"/>
								</button>
							</div>

							<span className="flex-1 text-sm font-medium truncate">{ fav.itemName }</span>

							<div className="flex items-center gap-1.5 shrink-0">
								<span className="text-[11px] text-muted-foreground">الترتيب</span>
								<input
									type="number"
									min={ 1 }
									max={ items.value.length }
									value={ index + 1 }
									onChange={ (e) => setPosition(index, Number(e.target.value)) }
									className="w-14 h-7 text-center text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
								/>
							</div>

							<button
								type="button"
								onClick={ () => removeItem(index) }
								className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
							>
								<Trash2 className="w-3.5 h-3.5"/>
							</button>
						</div>
					)) }
				</>
			) }
		</div>
	);
}