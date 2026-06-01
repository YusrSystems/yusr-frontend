import { PlusIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Button } from "../../pure/button";

export type CrudTableHeaderProps = {
  title: string;
  addButtonTitle: string;
  isAddButtonVisible?: boolean;
  onAddButtonClicked: () => void;
  changeDialog: ReactNode;
  actionButtons: ReactNode[];
};
export function CrudTableHeader(
  {
    title,
    addButtonTitle,
    isAddButtonVisible = true,
    onAddButtonClicked,
    actionButtons
  }: CrudTableHeaderProps
)
{
  return (
    <>
      <div className="flex justify-between mb-8 gap-3">
        <div>
          <h1>{ title }</h1>
        </div>
        <div className="flex gap-3">
          { ...actionButtons }
          { isAddButtonVisible && (
            <Button variant="default" onClick={ onAddButtonClicked }>
              <PlusIcon className="h-4 w-4" />
              { addButtonTitle }
            </Button>
          ) }
        </div>
      </div>
    </>
  );
}
