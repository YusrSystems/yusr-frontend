import { Cubits } from "@/core/services/cubits";
import { PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { paymentMethodsApi } from "@/features/paymentMethods/paymentMethod.api.ts";

export default function PaymentMethodsSearchableSelect(
	{...props}: SearchableSelectProps<PaymentMethodDto>
)
{
	useSignals();

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger label={ props.label } disabled={ props.disabled }/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) =>
					{
						Cubits.paymentMethods.search(searchInput);
					} }
				/>
				<SearchableSelect.Command>
					<SearchableSelect.NullOption { ...props } />
					<CommandItems/>
				</SearchableSelect.Command>
			</SearchableSelect.Content>
		</SearchableSelect>
	);

	function CommandItems()
	{
		useSignals();
		if (Cubits.paymentMethods.state.value instanceof PageLoading)
		{
			return <SearchableSelect.Loading/>;
		}

		if (Cubits.paymentMethods.state.value instanceof PageLoaded && Cubits.paymentMethods.entities.value.length > 0)
		{
			return Cubits.paymentMethods.entities.value.map((entity) => (
				<Option key={ entity.id } item={ entity } { ...props } />
			));
		}

		return <SearchableSelect.Empty/>;
	}
}

const Option = React.memo(
	function Option(
		{...props}: Omit<SearchableSelectOptionProps<PaymentMethodDto>, "labelSelector">
	)
	{
		useSignals();
		return (
			<SearchableSelect.Option<PaymentMethodDto>
				labelSelector="name"
				{ ...props }
			>
				<SearchableSelect.OptionBody label={ props.item.name }/>
				<SearchableSelect.DeleteOptionButton
					onDelete={ async () =>
					{
						const result = await paymentMethodsApi.delete(props.item.id);
						if (result.ok)
						{
							Cubits.paymentMethods.delete(props.item);
						}
					} }
				/>
			</SearchableSelect.Option>
		);
	}
);