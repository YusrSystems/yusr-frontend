import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import type { VoucherCategoryDto } from "@/core/data/voucher.ts";


export default function VoucherCategoriesSearchableSelect({...props}: SearchableSelectProps<VoucherCategoryDto>)
{
	useSignals();

	return (

		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.voucherCategories.search(searchInput);
					} }
				/>
				<SearchableSelect.Command>
					<SearchableSelect.NullOption { ...props } />
					<CommandItems/>
				</SearchableSelect.Command>
			</SearchableSelect.Content>
		</SearchableSelect>
	);

	function CommandItems()
	{
		useSignals();
		if (Cubits.voucherCategories.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.voucherCategories.state.value instanceof PageLoaded && Cubits.voucherCategories.entities.value.length > 0)
		{
			return Cubits.voucherCategories.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return (
			<SearchableSelect.AddOptionButton
				onCreate={ async (searchText) =>
				{
					await Services.voucherCategoriesApi.Add({name: searchText} as VoucherCategoryDto);
					Cubits.voucherCategories.init();
				} }
			/>
		);
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<VoucherCategoryDto>, "labelSelector">
	)
	{
		useSignals();
		console.log("Option: ", props);
		return (
			<SearchableSelect.Option<VoucherCategoryDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.EditableOptionBody
					label={ props.item.name }

					onSave={ async (newName) =>
					{
						props.item.name = newName;
						const newItem = {...props.item} as VoucherCategoryDto;
						const result = await Services.voucherCategoriesApi.Update(
							newItem
						);

						if (result.status === 200 && result.data != undefined)
						{

							Cubits.voucherCategories.update(result.data);

						}
					} }
				/>
				<SearchableSelect.DeleteOptionButton
					onDelete={ async () =>
					{
						const result = await Services.voucherCategoriesApi.Delete(props.item.id);
						if (result.status === 200)
						{
							Cubits.voucherCategories.delete(props.item);
						}
					} }
				/>

			</SearchableSelect.Option>
		);
	}
);