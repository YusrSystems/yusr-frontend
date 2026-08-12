import { type AccountDto } from "@/core/data/account";
import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import ChangeAccountDialog from "@/features/accounts/changeAccountDialog";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { useMemo } from "react";
import {
	Dialog,
	PageCubit,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";


export default function AccountsSearchableSelect(
	{showAddButton = true, accountsCubit = Cubits.accounts, ...props}: SearchableSelectProps<AccountDto> & {
		showAddButton?: boolean;
		accountsCubit?: PageCubit<AccountDto>,
		placeholder?: string
	}
)
{
	useSignals();
	const newAccountSearchText = useMemo(() => signal<string | undefined>(""), []);
	const isAddAccountOpen = useMemo(() => signal<boolean>(false), []);

	return (
		<>
			<SearchableSelect>
				<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }
				                          placeholder={ props.placeholder }/>
				<SearchableSelect.Content>
					<SearchableSelect.SearchInput onSearch={ (searchInput) => accountsCubit.search(searchInput) }/>
					<SearchableSelect.Command>
						<SearchableSelect.NullOption { ...props } />
						<CommandItems/>
					</SearchableSelect.Command>
				</SearchableSelect.Content>
			</SearchableSelect>

			{ showAddButton && (
				<Dialog
					open={ isAddAccountOpen.value }
					onOpenChange={ (open) => isAddAccountOpen.value = open }
				>
					{ isAddAccountOpen.value && (
						<ChangeAccountDialog
							initDto={ {name: newAccountSearchText.value} as AccountDto }
							service={ Services.accountsApi }
							onSuccess={ (data) =>
							{
								if (props.id) props.id.value = data.id;
								if (props.label) props.label.value = data.name;
								props.onSelect?.(data);
								isAddAccountOpen.value = false;
								accountsCubit.init();
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
		if (accountsCubit.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}
		if (accountsCubit.state.value instanceof PageLoaded && accountsCubit.entities.value.length > 0)
		{
			return accountsCubit.entities.value.map((entity) => (
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
				<div className="flex items-center justify-between w-full">
					<span className="font-normal">
						{ props.item.name }
					</span>
				</div>
			</SearchableSelect.Option>
		);
	}
);