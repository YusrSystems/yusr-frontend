import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";
import type { VoucherCategoryDto } from "@/core/data/voucher.ts";


export default function VoucherCategoriesMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<VoucherCategoryDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);

	return (<MultiSearchableSelect<VoucherCategoryDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.voucherCategories.search(text) }
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
		if (Cubits.voucherCategories.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.voucherCategories.state.value instanceof PageLoaded && Cubits.voucherCategories.entities.value.length > 0)
		{
			return Cubits.voucherCategories.entities.value.map((voucherCategory) => (
				<MultiSearchableSelect.Option<VoucherCategoryDto>
					{ ...props }
					key={ voucherCategory.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="name"
					item={ voucherCategory }
				>
					<MultiSearchableSelect.OptionBody label={ voucherCategory.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}