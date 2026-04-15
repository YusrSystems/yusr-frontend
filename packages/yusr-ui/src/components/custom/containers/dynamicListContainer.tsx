import { Plus } from "lucide-react";
import { Button } from "../../pure/button";

interface DynamicListProps<T>
{
  title: string;
  items: T[];
  onAdd: () => void;
  addLabel: string;
  emptyMessage: string;
  error?: string;
  headers: string[];
  children: (item: any, index: number) => React.ReactNode;
}

export function DynamicListContainer<T>(
  { title, items, onAdd, addLabel, emptyMessage, error, headers, children }: DynamicListProps<T>
)
{
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold">{ title }</h3>
        <Button type="button" variant="outline" size="sm" onClick={ onAdd }>
          <Plus className="h-4 w-4 ml-2" /> { addLabel }
        </Button>
      </div>

      <div className={ error ? "border border-red-600 rounded-md p-2" : "" }>
        { items.length > 0 && (
          <div className="flex gap-3 px-3 mb-1 text-muted-foreground text-xs font-medium">
            { headers.map((h, i) => <div key={ i } className={ i === 0 ? "flex-1" : "w-24" }>{ h }</div>) }
            <div className="w-10" />
          </div>
        ) }

        { items.length === 0
          ? (
            <p className="text-xs text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
              { emptyMessage }
            </p>
          )
          : <div className="space-y-2">{ items.map((item, index) => children(item, index)) }</div> }
      </div>
      { error && <p className="text-xs text-red-500 font-bold mt-2">{ error }</p> }
    </div>
  );
}
