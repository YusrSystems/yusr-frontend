import { type PartnerDto, PartnerType } from "@/core/data/partner";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import {
	Dialog,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { Services } from "@/core/services/services.ts";
import { signal } from "@preact/signals-react";
import ChangePartnerDialog from "@/features/partners/changePartnerDialog.tsx";


export function PartnersSearchableSelect({
	showAddButton = true,
	showEditButton = true,
	types = [PartnerType.Customer, PartnerType.Supplier],
	...props
}: SearchableSelectProps<PartnerDto> & {
	showAddButton?: boolean;
	showEditButton?: boolean;
	types?: PartnerType[];
	placeholder?: string
})
{
	useSignals();

	const newSearchText = useMemo(() => signal<string | undefined>(""), []);
	const isAddOpen = useMemo(() => signal<boolean>(false), []);
	const editingEntity = useMemo(() => signal<PartnerDto | undefined>(undefined), []);

	return (
		<>
			<SearchableSelect>
				<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
				<SearchableSelect.Content>
					<SearchableSelect.SearchInput onSearch={ (searchInput) => Cubits.partners.search(searchInput) }/>
					<SearchableSelect.Command>
						<SearchableSelect.NullOption { ...props } />
						<CommandItems/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

			{ showAddButton && (
				<Dialog open={ isAddOpen.value } onOpenChange={ (open) => isAddOpen.value = open }>
					{ isAddOpen.value && (
						<ChangePartnerDialog
							initDto={ {name: newSearchText.value, type: types[0]} as PartnerDto }
							selectTypes={ types }
							service={ Services.partnersApi }
							onSuccess={ (data) =>
							{
								if (props.id) props.id.value = data.id;
								if (props.label) props.label.value = data.name;
								props.onSelect?.(data);
								isAddOpen.value = false;
								Cubits.partners.init(types);
							} }
						/>
					) }
				</Dialog>
			) }

			{ showEditButton && (
				<Dialog
					open={ editingEntity.value !== undefined }
					onOpenChange={ (open) =>
					{
						if (!open) editingEntity.value = undefined;
					} }
				>
					{ editingEntity.value && (
						<ChangePartnerDialog
							dto={ editingEntity.value }
							selectTypes={ types }
							service={ Services.partnersApi }
							onSuccess={ (data) =>
							{
								if (props.id?.value === data.id && props.label)
								{
									props.label.value = data.name;
								}
								editingEntity.value = undefined;
								Cubits.partners.update(data);
							} }
						/>
					) }
				</Dialog>
			) }
		</>
	);

	function CommandItems()
	{
		useSignals();
		if (Cubits.partners.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (Cubits.partners.state.value instanceof PageLoaded)
		{
			if (Cubits.partners.entities.value.length === 0)
			{
				return <SearchableSelect.Empty/>;
			}

			return Cubits.partners.entities.value.map((entity) => (
				<Option
					key={ entity.id }
					item={ entity }
					showEditButton={ showEditButton }
					onEdit={ () => editingEntity.value = entity }
					{ ...props }
				/>
			));
		}

		if (showAddButton)
		{
			return (
				<SearchableSelect.AddOptionButton
					onCreate={ async (searchText, closeCommand) =>
					{
						newSearchText.value = searchText;
						isAddOpen.value = true;
						closeCommand();
					} }
				/>
			);
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({
		showEditButton,
		onEdit,
		...props
	}: Omit<SearchableSelectOptionProps<PartnerDto>, "labelSelector"> & {
		showEditButton?: boolean;
		onEdit?: () => void;
	})
	{
		useSignals();
		return (
			<SearchableSelect.Option<PartnerDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
				{ showEditButton && <SearchableSelect.EditOptionButton onEdit={ () => onEdit?.() }/> }
			</SearchableSelect.Option>
		);
	}
);