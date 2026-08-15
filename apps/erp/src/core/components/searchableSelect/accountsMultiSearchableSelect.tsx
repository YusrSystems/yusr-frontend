import type { MultiSearchableSelectRootProps } from "yusr-ui";
import { MultiSearchableSelect, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { AccountDto } from "@/core/data/account.ts";


export default function AccountsMultiSearchableSelect(
	props: MultiSearchableSelectRootProps<AccountDto>
)
{
	useSignals();

	return (
		<MultiSearchableSelect<AccountDto> labelSelector="name" { ...props }>
			<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
			<MultiSearchableSelect.Content>
				<MultiSearchableSelect.SearchInput
					onSearch={ (text) => Cubits.accounts.search(text) }
				/>
				<MultiSearchableSelect.Command>
					<CommandItems/>
				</MultiSearchableSelect.Command>

				<MultiSearchableSelect.Footer/>
			</MultiSearchableSelect.Content>
		</MultiSearchableSelect>
	);

	function CommandItems()
	{
		useSignals();

		if (Cubits.accounts.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.accounts.state.value instanceof PageLoaded && Cubits.accounts.entities.value.length > 0)
		{
			return Cubits.accounts.entities.value.map((account) => (
				<MultiSearchableSelect.Option<AccountDto>
					key={ account.id }
					item={ account }
				>
					<MultiSearchableSelect.OptionBody label={ account.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}