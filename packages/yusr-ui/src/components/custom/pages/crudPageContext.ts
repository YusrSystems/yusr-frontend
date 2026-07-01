import { useNavigate } from "react-router-dom";
import { createContext, useContext } from "react";
import type { Signal } from "@preact/signals-react";
import { Dto } from "../../../stateManager";


export type CrudPageContextType<TDto extends Dto> = {
	isChangeDialogOpen: Signal<boolean>;
	isDeleteDialogOpen: Signal<boolean>;
	selectedDto: Signal<TDto | undefined>;
	navigate: ReturnType<typeof useNavigate>;
	basePath: string;
};

export const CrudPageContext = createContext<CrudPageContextType<any> | null>(null);

export function useCrudPageContext<TDto extends Dto = Dto>(): CrudPageContextType<TDto>
{
	const ctx = useContext(CrudPageContext);
	if (!ctx) throw new Error("This subcomponent must be used inside <CrudPage>.");
	return ctx as CrudPageContextType<TDto>;
}