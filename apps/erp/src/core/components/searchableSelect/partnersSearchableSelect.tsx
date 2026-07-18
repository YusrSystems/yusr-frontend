import { type PartnerDto, PartnerType } from "@/core/data/partner";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageCubit,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";


export default function PartnersSearchableSelect(
	{
		typeFilter,
		cubit,
		...props
	}: SearchableSelectProps<PartnerDto> & {
		typeFilter?: PartnerType;
		cubit: PageCubit<PartnerDto>
	}
)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput onSearch={ (searchInput) => cubit.search(searchInput) }/>
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
		if (cubit.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (cubit.state.value instanceof PageLoaded)
		{
			let list = cubit.entities.value;

			if (typeFilter !== undefined)
			{
				list = list.filter((p) => p.type === typeFilter);
			}

			if (list.length === 0)
			{
				return <SearchableSelect.Empty/>;
			}

			return list.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<PartnerDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<PartnerDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
			</SearchableSelect.Option>
		);
	}
);