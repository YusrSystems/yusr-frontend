import type { MultiSearchableSelectRootProps } from "yusr-ui";
import { MultiSearchableSelect, PageLoaded, PageLoading, UserDto } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";


export default function UsersMultiSearchableSelect(
	props: MultiSearchableSelectRootProps<UserDto>
)
{
	useSignals();

	return (
		<MultiSearchableSelect<UserDto> labelSelector="username" { ...props }>
			<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
			<MultiSearchableSelect.Content>
				<MultiSearchableSelect.SearchInput
					onSearch={ (text) => Cubits.users.search(text) }
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

		if (Cubits.users.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.users.state.value instanceof PageLoaded && Cubits.users.entities.value.length > 0)
		{
			return Cubits.users.entities.value.map((user) => (
				<MultiSearchableSelect.Option<UserDto>
					key={ user.id }
					item={ user }
				>
					<MultiSearchableSelect.OptionBody label={ user.username }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}