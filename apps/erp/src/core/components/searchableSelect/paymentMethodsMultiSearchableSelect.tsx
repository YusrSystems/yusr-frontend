import { MultiSearchableSelect, type MultiSearchableSelectProps, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { Signal, signal } from "@preact/signals-react";
import type { PaymentMethodDto } from "@/core/data/paymentMethod.ts";


export default function PaymentMethodsMultiSearchableSelect(
	{ids, labels, ...props}: Omit<MultiSearchableSelectProps<PaymentMethodDto>, "ids"> & {
		ids?: Signal<number[]>;
	}
)
{
	useSignals();

	const localIds = useMemo(() => ids ?? signal<number[]>([]), [ids]);
	const localLabels = useMemo(() => labels ?? signal<Record<number, string>>([]), [labels]);

	return (<MultiSearchableSelect<PaymentMethodDto>>
		<MultiSearchableSelect.Trigger
			labels={ localLabels }
			disabled={ props.disabled }
		/>
		<MultiSearchableSelect.Content>
			<MultiSearchableSelect.SearchInput
				onSearch={ (text) => Cubits.paymentMethods.search(text) }
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
		if (Cubits.paymentMethods.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.paymentMethods.state.value instanceof PageLoaded && Cubits.paymentMethods.entities.value.length > 0)
		{
			return Cubits.paymentMethods.entities.value.map((pm) => (
				<MultiSearchableSelect.Option<PaymentMethodDto>
					{ ...props }
					key={ pm.id }
					ids={ localIds }
					labels={ localLabels }
					labelSelector="name"
					item={ pm }
				>
					<MultiSearchableSelect.OptionBody label={ pm.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}