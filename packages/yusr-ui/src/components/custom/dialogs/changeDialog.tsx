import { type PropsWithChildren, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ChangeableEntity, Dto } from "../../../stateManager";
import { cn } from "../../../utils/cn";
import { Button } from "../../pure/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";
import { SaveButton, type SaveButtonProps } from "../buttons/saveButton";
import { TabButton } from "../buttons/tabButton";
import { UnauthorizedPage } from "../unauthorized/unauthorizedPage";

export type ChangeDialogProps =
  & PropsWithChildren
  & {
    className?: string;
  };

export type ChangeDialogHeaderProps = PropsWithChildren & { title: string; description?: string; };

export type ChangeDialogTabProps = {
  active: boolean;
  hasError?: boolean;
  icon: any;
  label: string;
  content: React.ReactElement;
};

export function ChangeDialog({ className = "sm:max-w-sm", children }: ChangeDialogProps)
{
  const { i18n } = useTranslation("common");

  return (
    <DialogContent dir={ i18n.dir() } className={ cn(className, "scroll-auto") }>
      { children }
    </DialogContent>
  );
}

ChangeDialog.Unauthorized = function()
{
  const { t, i18n } = useTranslation("common");

  return (
    <DialogContent className="sm:max-w-xl" dir={ i18n.dir() }>
      <DialogHeader>
        <DialogTitle>{ t("changeDialog.unauthorized") }</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <UnauthorizedPage showButtons={ false } />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">{ t("changeDialog.close") }</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
};

ChangeDialog.Header = function({ title, description, children }: ChangeDialogHeaderProps)
{
  return (
    <>
      <DialogHeader>
        <DialogTitle>{ title }</DialogTitle>
        <DialogDescription>{ description }</DialogDescription>
        { children }
      </DialogHeader>

      <Separator />
    </>
  );
};

ChangeDialog.Footer = function({ children }: PropsWithChildren)
{
  return (
    <DialogFooter>
      { children }
    </DialogFooter>
  );
};

ChangeDialog.Close = function()
{
  const { t } = useTranslation("common");
  return (
    <DialogClose asChild>
      <Button variant="outline">{ t("changeDialog.cancel") }</Button>
    </DialogClose>
  );
};

ChangeDialog.SaveButton = function<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
  { ...props }: SaveButtonProps<TEntity, TDto>
)
{
  return <SaveButton { ...props } />;
};

ChangeDialog.Tabbed = function({ tabs, children }: { tabs: ChangeDialogTabProps[]; children?: React.ReactNode; })
{
  const [currentTab, setCurrentTab] = useState(0);

  return (
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
        { tabs[currentTab].content }
      </div>

      { children }
    </div>
  );
};
