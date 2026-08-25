import { useSignals } from "@preact/signals-react/runtime";
import React from "react";
import {
	PageCubit,
	PageLoaded,
	PageLoading,
	SearchableSelect,
	type SearchableSelectOptionProps,
	type SearchableSelectProps
} from "yusr-ui";
import { SalesInvoiceDto } from "@/core/data/commercial/salesInvoice";
import { Cubits } from "@/core/services/cubits";
import { SalesInvoiceType } from "@/core/types/commercialEnums";


export function SalesInvoicesSearchableSelect({cubit, ...props}: SearchableSelectProps<SalesInvoiceDto> & {
	cubit?: PageCubit<SalesInvoiceDto>
})
{
	useSignals();

	const _cubit = cubit ?? Cubits.salesInvoices;

	React.useEffect(() =>
	{
		_cubit.init([SalesInvoiceType.Invoice]);
	}, []);

	return (
		<SearchableSelect>
			<SearchableSelect.Trigger
				label={ props.label }
				disabled={ props.disabled }
				placeholder="اختر الفاتورة الأصلية..."
			/>
			<SearchableSelect.Content>
				<SearchableSelect.SearchInput
					onSearch={ (searchInput) => _cubit.search(searchInput) }
				/>
				<SearchableSelect.Command>
					<SearchableSelect.NullOption { ...props } />
					<CommandItems cubit={ _cubit } { ...props } />
				</SearchableSelect.Command>
			</SearchableSelect.Content>
		</SearchableSelect>
	);
}

function CommandItems({cubit, ...props}: SearchableSelectProps<SalesInvoiceDto> & {
	cubit: PageCubit<SalesInvoiceDto>
})
{
	useSignals();

	if (cubit.state.value instanceof PageLoading)
	{
		return <SearchableSelect.Loading/>;
	}

	if (
		cubit.state.value instanceof PageLoaded &&
		cubit.entities.value.length > 0
	)
	{
		return (
			<>
				{ cubit.entities.value.map((invoice) => (
					<Option key={ invoice.id } item={ invoice } { ...props } />
				)) }
			</>
		);
	}

	return <SearchableSelect.Empty/>;
}

const Option = React.memo(
	function Option(props: Omit<SearchableSelectOptionProps<SalesInvoiceDto>, "labelSelector">)
	{
		useSignals();

		return (
			<SearchableSelect.Option<SalesInvoiceDto> labelSelector="id" { ...props }>
				<div className="flex items-center justify-between w-full">
					<div className="flex flex-col">
						<span className="font-semibold text-sm">فاتورة #{ props.item.id }</span>
						<span className="text-xs text-muted-foreground">
							{ props.item.partnerName || "عميل" } - { props.item.date }
						</span>
					</div>
					<span className="font-mono text-xs font-bold">
						{ Number(props.item.fullAmount ?? 0).toLocaleString("en-US", {minimumFractionDigits: 2}) }
					</span>
				</div>
			</SearchableSelect.Option>
		);
	}
);