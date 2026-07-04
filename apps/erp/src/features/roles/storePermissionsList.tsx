import { Cubits } from "@/core/services/cubits";
import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Checkbox, PageLoaded, Skeleton } from "yusr-ui";


interface StorePermissionsListProps
{
	authorizedStoreIds: Signal<number[]>;
}

export default function StorePermissionsList({authorizedStoreIds}: StorePermissionsListProps)
{
	useSignals();

	const handleToggle = (storeId: number) =>
	{
		const current = authorizedStoreIds.value;
		authorizedStoreIds.value = current.includes(storeId)
			? current.filter((id) => id !== storeId)
			: [...current, storeId];
	};

	if (Cubits.stores.state.value instanceof PageLoaded)
	{
		return (
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{ Cubits.stores.entities.value.map((store) => (
					<div
						key={ store.id }
						onClick={ () => handleToggle(store.id) }
						className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
					>
						<Checkbox checked={ authorizedStoreIds.value.includes(store.id) }/>
						<span className="text-sm font-medium">{ store.name }</span>
					</div>
				)) }
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{ Array.from({length: 6}).map((_, i) => <Skeleton key={ i } className="h-12 w-full"/>) }
		</div>
	);
}
