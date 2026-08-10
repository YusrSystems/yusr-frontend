import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	MultiSearchableSelect,
	type MultiSearchableSelectProps,
	PageLoaded,
	PageLoading,
	TextField
} from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo, useState } from "react";
import { Signal, signal } from "@preact/signals-react";
import { BrandDto } from "@/core/data/brand.ts";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";


export default function BrandsMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<BrandDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();
	const {i18n} = useTranslation();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);
	const [searchText, setSearchText] = useState("");

	const isDialogOpen = useMemo(() => signal(false), []);
	const editingBrand = useMemo(() => signal<BrandDto | undefined>(undefined), []);
	const brandName = useMemo(() => signal(""), []);
	const isSaving = useMemo(() => signal(false), []);

	const handleOpenAdd = (text: string) =>
	{
		Cubits.brands.search("");
		setSearchText("");
		editingBrand.value = undefined;
		brandName.value = text ?? "";
		isDialogOpen.value = true;
	};

	const handleOpenEdit = (brand: BrandDto) =>
	{
		Cubits.brands.search("");
		setSearchText("");
		editingBrand.value = brand;
		brandName.value = brand.name;
		isDialogOpen.value = true;
	};

	const handleDelete = async (brand: BrandDto) =>
	{
		const res = await Services.brandsApi.Delete(brand.id);
		if (res.status === 200)
		{
			Cubits.brands.delete(brand);
			if (localIds.value.includes(brand.id))
			{
				localIds.value = localIds.value.filter(id => id !== brand.id);
				const newLabels = {...localLabels.value};
				delete newLabels[brand.id];
				localLabels.value = newLabels;
			}
		}
	};

	const handleSave = async () =>
	{
		isSaving.value = true;
		try
		{
			if (editingBrand.value)
			{
				const res = await Services.brandsApi.Update({
					...editingBrand.value,
					name: brandName.value
				});
				if (res.data)
				{
					Cubits.brands.update(res.data);
					if (localIds.value.includes(res.data.id))
					{
						localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
					}
					isDialogOpen.value = false;
				}
			}
			else
			{
				const res = await Services.brandsApi.Add({name: brandName.value} as BrandDto);
				if (res.data)
				{
					Cubits.brands.add(res.data);
					localIds.value = [...localIds.value, res.data.id];
					localLabels.value = {...localLabels.value, [res.data.id]: res.data.name};
					setSearchText("");
					Cubits.brands.search("");
					isDialogOpen.value = false;
				}
			}
		}
		finally
		{
			isSaving.value = false;
		}
	};

	return (
		<>
			<MultiSearchableSelect<BrandDto>>
				<MultiSearchableSelect.Trigger
					labels={ localLabels }
					disabled={ props.disabled }
				/>
				<MultiSearchableSelect.Content>
					<MultiSearchableSelect.SearchInput
						onSearch={ (text) =>
						{
							setSearchText(text ?? "");
							Cubits.brands.search(text);
						} }
					/>
					<MultiSearchableSelect.Command>
						<CommandItems searchText={ searchText }/>
					</MultiSearchableSelect.Command>

					<MultiSearchableSelect.Footer ids={ localIds } labels={ localLabels }/>
				</MultiSearchableSelect.Content>
			</MultiSearchableSelect>

			<Dialog open={ isDialogOpen.value } onOpenChange={ (open) => isDialogOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{ editingBrand.value ? "تعديل العلامة التجارية" : "إضافة علامة تجارية جديدة" }</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<TextField
							label="اسم العلامة التجارية"
							value={ brandName }
							required
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={ () => isDialogOpen.value = false }>
							إلغاء
						</Button>
						<Button
							disabled={ isSaving.value || !brandName.value }
							onClick={ handleSave }
						>
							حفظ
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);

	function CommandItems({searchText}: { searchText: string })
	{
		useSignals();
		if (Cubits.brands.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.brands.state.value instanceof PageLoaded)
		{
			const hasExactMatch = Cubits.brands.entities.value.some(c => c.name.toLowerCase() === searchText.toLowerCase());

			return (
				<>
					{ Cubits.brands.entities.value.map((brand) => (
						<MultiSearchableSelect.Option<BrandDto>
							{ ...props }
							key={ brand.id }
							ids={ localIds }
							labels={ localLabels }
							labelSelector="name"
							item={ brand }
						>
							<div className="flex items-center justify-between w-full">
								<span className="truncate">{ brand.name }</span>
								<div className="flex items-center gap-1 ms-2">
									<button type="button" onClick={ (e) =>
									{
										e.preventDefault();
										e.stopPropagation();
										handleOpenEdit(brand);
									} } className="p-1 text-muted-foreground hover:text-primary transition-colors">
										<Edit2 className="w-3.5 h-3.5"/></button>
									<button type="button" onClick={ (e) =>
									{
										e.preventDefault();
										e.stopPropagation();
										handleDelete(brand);
									} } className="p-1 text-muted-foreground hover:text-destructive transition-colors">
										<Trash2 className="w-3.5 h-3.5"/></button>
								</div>
							</div>
						</MultiSearchableSelect.Option>
					)) }
					{ searchText && !hasExactMatch && (
						<div className="p-1">
							<Button
								type="button"
								variant="ghost"
								className="w-full justify-start text-sm h-8 px-2"
								onClick={ () => handleOpenAdd(searchText) }
							>
								<Plus className="h-4 w-4 me-2"/> إضافة "{ searchText }"
							</Button>
						</div>
					) }
					{ Cubits.brands.entities.value.length === 0 && !searchText && <MultiSearchableSelect.Empty/> }
				</>
			);
		}

		return <MultiSearchableSelect.Empty/>;
	}
}