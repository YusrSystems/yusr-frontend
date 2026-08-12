import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading, UserDto } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";


export default function UsersMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<UserDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);

	return (<MultiSearchableSelect<UserDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.users.search(text) }
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
		if (Cubits.users.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.users.state.value instanceof PageLoaded && Cubits.users.entities.value.length > 0)
		{
			return Cubits.users.entities.value.map((user) => (
				<MultiSearchableSelect.Option<UserDto>
					{ ...props }
					key={ user.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="username"
					item={ user }
				>
					<MultiSearchableSelect.OptionBody label={ user.username || user.username }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}