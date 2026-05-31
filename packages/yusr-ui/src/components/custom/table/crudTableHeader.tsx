import { PlusIcon } from "lucide-react";
import React, { type ReactElement, type ReactNode, useState } from "react";
import { Button } from "../../pure/button";
import { Dialog } from "../../pure/dialog";


// TODO: Make it compund component

export type CrudTableHeaderProps = {
  title: string;
  addButtonTitle: string;
  changeDialog: ReactNode;
  isAddButtonVisible?: boolean;
  actionButtons: ReactNode[];
}
export function CrudTableHeader(
  { title, addButtonTitle: buttonTitle, changeDialog: createComp, isAddButtonVisible: isButtonVisible = true, actionButtons }: CrudTableHeaderProps
) {
  const [isDialogOpen, setOpenDialogState] = useState(false);

  // we intercept the success event to close the dialog
  const contentWithClose = React.isValidElement(createComp)
    ? React.cloneElement(createComp as ReactElement<any>, {
      onSuccess: (data: any) => {
        setOpenDialogState(false);
        (createComp.props as any).onSuccess?.(data);
      }
    })
    : createComp;

  return (
    <>
      <div className="flex justify-between mb-8 gap-3">
        <div>
          <h1>{title}</h1>
        </div>
        <div className="flex gap-3">
          {...actionButtons}
          {isButtonVisible && (
            <Button variant="default" onClick={() => setOpenDialogState(true)}>
              <PlusIcon className="h-4 w-4" />
              {buttonTitle}
            </Button>
          )}
        </div>
      </div>
      {isDialogOpen && <Dialog open={isDialogOpen} onOpenChange={setOpenDialogState}>{contentWithClose}
      </Dialog>}
    </>
  );
}
