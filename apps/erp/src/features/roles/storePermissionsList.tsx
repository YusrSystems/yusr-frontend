import type { Store, StoreDto } from "@/core/data/store";
import { type Signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Checkbox, PageCubit, PageLoaded, Skeleton } from "yusr-ui";

interface StorePermissionsListProps
{
  cubit: PageCubit<Store, StoreDto>;
  authorizedStoreIds: Signal<number[]>;
}

export default function StorePermissionsList({ cubit, authorizedStoreIds }: StorePermissionsListProps)
{
  useSignals();

  const handleToggle = (storeId: number) =>
  {
    const current = authorizedStoreIds.value;
    authorizedStoreIds.value = current.includes(storeId)
      ? current.filter((id) => id !== storeId)
      : [...current, storeId];
  };

  if (cubit.state.value instanceof PageLoaded)
  {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        { cubit.entities.value.map((store) => (
          <div
            key={ store.id.value }
            onClick={ () => handleToggle(store.id.value) }
            className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
          >
            <Checkbox
              checked={ authorizedStoreIds.value.includes(store.id.value) }
              onCheckedChange={ () => handleToggle(store.id.value) }
            />
            <span className="text-sm font-medium">{ store.name }</span>
          </div>
        )) }
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { Array.from({ length: 6 }).map((_, i) => <Skeleton key={ i } className="h-12 w-full" />) }
    </div>
  );
}
