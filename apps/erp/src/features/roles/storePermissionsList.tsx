import { Checkbox, Skeleton } from "yusr-ui";
import { useAppSelector } from "../../core/state/store";

interface StorePermissionsListProps
{
  authorizedStoreIds: number[];
  onChange: (updated: number[]) => void;
}

export default function StorePermissionsList({ authorizedStoreIds, onChange }: StorePermissionsListProps)
{
  const { entities, isLoading } = useAppSelector((state) => state.store);

  const handleToggle = (storeId: number) =>
  {
    const updated = authorizedStoreIds.includes(storeId)
      ? authorizedStoreIds.filter((id) => id !== storeId)
      : [...authorizedStoreIds, storeId];

    onChange(updated);
  };

  if (isLoading)
  {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        { Array.from({ length: 6 }).map((_, i) => <Skeleton key={ i } className="h-12 w-full" />) }
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      { entities.data?.map((store) => (
        <div
          key={ store.id }
          onClick={ () => handleToggle(store.id) }
          className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-muted transition-colors"
        >
          <Checkbox
            checked={ authorizedStoreIds.includes(store.id) }
            onCheckedChange={ () => handleToggle(store.id) }
          />
          <span className="text-sm font-medium">{ store.name }</span>
        </div>
      )) }
    </div>
  );
}
