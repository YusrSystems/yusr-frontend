import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services.ts";
import { BrandDto } from "@/core/data/brand.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import { signal } from "@preact/signals-react";
import {
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps,
	TextField
} from "yusr-ui";
import { useTranslation } from "react-i18next";


export default function BrandsSearchableSelect(
	{...props}: SearchableSelectProps<BrandDto>
)
{
	useSignals();
	const {i18n} = useTranslation();

	const isDialogOpen = useMemo(() => signal(false), []);
	const editingBrand = useMemo(() => signal<BrandDto | undefined>(undefined), []);
	const brandName = useMemo(() => signal(""), []);
	const isSaving = useMemo(() => signal(false), []);

	const handleOpenAdd = (text: string) =>
	{
		Cubits.brands.search("");
		editingBrand.value = undefined;
		brandName.value = text ?? "";
		isDialogOpen.value = true;
	};

	const handleOpenEdit = (brand: BrandDto) =>
	{
		Cubits.brands.search("");
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
			if (props.id?.value === brand.id)
			{
				props.id.value = undefined;
				if (props.label) props.label.value = "";
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
					if (props.id?.value === res.data.id && props.label)
					{
						props.label.value = res.data.name;
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
					if (props.id) props.id.value = res.data.id;
					if (props.label) props.label.value = res.data.name;
					if (props.onSelect) props.onSelect(res.data);
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
			<SearchableSelect>
				<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
				<SearchableSelect.Content>
					<SearchableSelect.SearchInput
						onSearch={ (searchInput) =>
						{
							Cubits.brands.search(searchInput);
						} }
					/>
					<SearchableSelect.Command>
						<SearchableSelect.NullOption { ...props } />
						<CommandItems/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

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

	function CommandItems()
	{
		useSignals();
		if (Cubits.brands.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.brands.state.value instanceof PageLoaded && Cubits.brands.entities.value.length > 0)
		{
			return Cubits.brands.entities.value.map((entity) => (
				<Option
					key={ entity.id }
					item={ entity }
					onEdit={ () => handleOpenEdit(entity) }
					onDelete={ () => handleDelete(entity) }
					{ ...props }
				/>
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText, closeCommand) =>
				{
					handleOpenAdd(searchText ?? "");
					closeCommand();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{onEdit, onDelete, ...props}: Omit<SearchableSelectOptionProps<BrandDto>, "labelSelector"> & {
			onEdit?: () => void;
			onDelete?: () => void;
		}
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<BrandDto>
				labelSelector="name"
				{ ...props }
			>
				<div className="flex items-center justify-between w-full">
					<span className="truncate">{ props.item.name }</span>
					<div className="flex items-center gap-1">
						{ onEdit && <SearchableSelect.EditOptionButton onEdit={ onEdit }/> }
						{ onDelete && <SearchableSelect.DeleteOptionButton onDelete={ async () => onDelete() }/> }
					</div>
				</div>
			</SearchableSelect.Option>
		);
	}
);