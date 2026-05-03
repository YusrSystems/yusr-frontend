import type { ResourcePermissions } from "@/auth";
import type { BaseEntity } from "../../../entities";
import { createContext, useContext } from "react";
import type { CrudActions } from "./crudPage";

interface crudPageContextProps<T extends BaseEntity>
{
  actions: CrudActions<T>;
  permissions: ResourcePermissions;
  dispatch: any;
  handleOpenChangeDialog: (entity: T) => void;
  handleSetIsChangeDialogOpen: (open: boolean) => void;
}

export const CrudPageContext = createContext<crudPageContextProps<any> | undefined>(undefined);

export function useCrudPageContext<T extends BaseEntity>(): crudPageContextProps<T>
{
  const context = useContext(CrudPageContext) as crudPageContextProps<T> | undefined;
  if (context === undefined)
  {
    throw new Error("useCrudPageContext must be used within a CrudPageContextProvider");
  }
  return context;
}
