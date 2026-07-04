import { type AccountDto } from "@/core/data/account";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import ChangeAccountDialog from "@/features/accounts/changeAccountDialog";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { AccountType } from "../../data/account";


export default function AccountsSearchableSelect(
	{types, showAddButton = true, ...props}: SearchableSelectProps<AccountDto> & {
		types: AccountType[];
		showAddButton?: boolean;
	}
)
{
	useSignals();
	const newAccountSearchText = useMemo(() => signal<string | undefined>(""), []);
	const isAddAccountOpen = useMemo(() => signal<boolean>(false), []);

	return (
		<>
			<SearchableSelect>
				<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
				<SearchableSelect.Content>
					<SearchableSelect.SearchInput onSearch={ (searchInput) => Cubits.accounts.search(searchInput) }/>
					<SearchableSelect.Command>
						<SearchableSelect.NullOption { ...props } />
						<CommandItems/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

			{ showAddButton && isAddAccountOpen.value && (
				<ChangeAccountDialog
					dto={ {type: types[0], name: newAccountSearchText.value} as AccountDto }
					selectTypes={ types }
					service={ Services.accountsApi }
					onSuccess={ (data) =>
					{
						props.id.value = data.id;
						if (props.label)
						{
							props.label.value = data.name;
						}
						props.onSelect?.(data);
						isAddAccountOpen.value = false;
						Cubits.accounts.init(types);
					} }
				/>
			) }
		</>
	);

	function CommandItems()
	{
		useSignals();
		if (Cubits.accounts.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (Cubits.accounts.state.value instanceof PageLoaded && Cubits.accounts.entities.value.length > 0)
		{
			return Cubits.accounts.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		if (showAddButton)
		{
			return (
				<SearchableSelect.AddOptionButton
					onCreate={ async (searchText, closeCommand) =>
					{
						newAccountSearchText.value = searchText;
						isAddAccountOpen.value = true;
						closeCommand();
					} }
				/>
			);
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option({...props}: Omit<SearchableSelectOptionProps<AccountDto>, "labelSelector">)
	{
		useSignals();
		return (
			<SearchableSelect.Option<AccountDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
			</SearchableSelect.Option>
		);
	}
);
