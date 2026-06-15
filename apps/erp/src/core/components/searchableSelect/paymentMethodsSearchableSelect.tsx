import {Cubits} from "@/core/services/cubits";
import {Services} from "@/core/services/services.ts";
import {PaymentMethodDto} from "@/features/paymentMethods/data/paymentMethod.ts";
import type {PaymentMethod} from "@/features/paymentMethods/data/paymentMethod.ts"; // paymentMethod
import {useSignals} from "@preact/signals-react/runtime";
import React from "react";
import {
    PageLoaded,
    PageLoading,
    SearchableSelect,
    type SearchableSelectOptionProps,
    type SearchableSelectProps
} from "yusr-ui";

export default function PaymentMethodsSearchableSelect(
    {...props}: SearchableSelectProps<PaymentMethod, PaymentMethodDto>
) {
    useSignals();

    return (
        <SearchableSelect>
            <SearchableSelect.Trigger label={props.label} disabled={props.disabled}/>
            <SearchableSelect.Content>
                <SearchableSelect.SearchInput
                    onSearch={(searchInput) => {
                        Cubits.paymentMethods.search(searchInput);
                    }}
                />
                <SearchableSelect.Command>
                    <SearchableSelect.NullOption {...props} />
                    <CommandItems/>
                </SearchableSelect.Command>
            </SearchableSelect.Content>
        </SearchableSelect>
    );

    function CommandItems() {
        useSignals();
        if (Cubits.paymentMethods.state.value instanceof PageLoading) {
            return <SearchableSelect.Loading/>;
        }

        if (Cubits.paymentMethods.state.value instanceof PageLoaded && Cubits.paymentMethods.entities.value.length > 0) {
            return Cubits.paymentMethods.entities.value.map((entity) => (
                <Option key={entity.id.value} item={entity} {...props} />
            ));
        }

        return <SearchableSelect.Empty/>;
    }
}

const Option = React.memo(
    function Option(
        {...props}: Omit<SearchableSelectOptionProps<PaymentMethod, PaymentMethodDto>, "labelSelector">
    ) {
        useSignals();
        return (
            <SearchableSelect.Option
                labelSelector="name"
                {...props}
            >
                <SearchableSelect.OptionBody label={props.item.name.value}/>
                <SearchableSelect.DeleteOptionButton
                    onDelete={async () => {
                        const result = await Services.paymentMethodsApi.Delete(props.item.id.value);
                        if (result.status === 200) {
                            Cubits.paymentMethods.delete(props.item);
                        }
                    }}
                />
            </SearchableSelect.Option>
        );
    }
);
