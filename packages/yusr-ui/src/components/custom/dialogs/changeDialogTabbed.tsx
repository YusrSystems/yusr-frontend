import { useState } from "react";
import type { BaseEntity } from "yusr-core";
import { FieldGroup } from "../../pure/field";
import { TabButton } from "../buttons/tabButton";
import { type ChangeDialogProps, ChangeDialog } from "./changeDialog";

export type TabProps = {
  active: boolean;
  hasError?: boolean;
  icon: any;
  label: string;
  content: React.ReactElement;
};
export type ChangeDialogTabbedProps<T extends BaseEntity> = {
  changeDialogProps: ChangeDialogProps<T>;
  tabs: TabProps[];
};
export function ChangeDialogTabbed<T extends BaseEntity>({
  changeDialogProps,
  tabs
}: ChangeDialogTabbedProps<T>)
{
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ChangeDialog<T> { ...changeDialogProps }>
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-start border-b mb-4 shrink-0 bg-muted/20 rounded-t-lg">
          { tabs.map((tab, i) => (
            <TabButton
              key={ i }
              active={ currentTab === i }
              hasError={ tab.hasError }
              icon={ tab.icon }
              label={ tab.label }
              onClick={ () => setCurrentTab(i) }
              content={ tab.content }
            />
          )) }
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          <FieldGroup>{ tabs[currentTab].content }</FieldGroup>
        </div>
      </div>
    </ChangeDialog>
  );
}
