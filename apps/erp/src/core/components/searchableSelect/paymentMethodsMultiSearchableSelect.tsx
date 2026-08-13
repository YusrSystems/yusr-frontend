import type { MultiSearchableSelectRootProps } from "yusr-ui";
import { MultiSearchableSelect, PageLoaded, PageLoading } from "yusr-ui";
import { Cubits } from "@/core/services/cubits.ts";
import { useSignals } from "@preact/signals-react/runtime";
import type { PaymentMethodDto } from "@/core/data/paymentMethod.ts";


export default function PaymentMethodsMultiSearchableSelect(props: MultiSearchableSelectRootProps<PaymentMethodDto>)
{
	useSignals();

	return (
		<MultiSearchableSelect<PaymentMethodDto> labelSelector="name" { ...props }>
			<MultiSearchableSelect.Trigger disabled={ props.disabled }/>
			<MultiSearchableSelect.Content>
				<MultiSearchableSelect.SearchInput
					onSearch={ (text) => Cubits.paymentMethods.search(text) }
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

		if (Cubits.paymentMethods.state.value instanceof PageLoading)
		{
			return <MultiSearchableSelect.Loading/>;
		}

		if (Cubits.paymentMethods.state.value instanceof PageLoaded && Cubits.paymentMethods.entities.value.length > 0)
		{
			return Cubits.paymentMethods.entities.value.map((pm) => (
				<MultiSearchableSelect.Option<PaymentMethodDto>
					key={ pm.id }
					item={ pm }
				>
					<MultiSearchableSelect.OptionBody label={ pm.name }/>
				</MultiSearchableSelect.Option>
			));
		}

		return <MultiSearchableSelect.Empty/>;
	}
}