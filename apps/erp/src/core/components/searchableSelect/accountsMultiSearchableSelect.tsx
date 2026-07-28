import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";
import type { AccountDto } from "@/core/data/account.ts";


export default function AccountsMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<AccountDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);

	return (<MultiSearchableSelect<AccountDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.accounts.search(text) }
			/>
			<MultiSearchableSelect.Command>
				<CommandItems/>
			</MultiSearchableSelect.Command>

			<MultiSearchableSelect.Footer ids={ localIds } labels={ localLabels }/>
		</MultiSearchableSelect.Content>
	</MultiSearchableSelect>);

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
					{ ...props }
					key={ account.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="name"
					item={ account }
				>
					<MultiSearchableSelect.OptionBody label={ account.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}