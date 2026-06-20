import { useNavigate } from "react-router-dom";
import { createContext, useContext } from "react";


export type CrudPageContextType = {
	navigate: ReturnType<typeof useNavigate>;
	basePath: string;
};

export const CrudPageContext = createContext<CrudPageContextType | null>(null);

export function useCrudPageContext(): CrudPageContextType
{
	const ctx = useContext(CrudPageContext);
	if (!ctx) throw new Error("This subcomponent must be used inside <CrudPage>.");
	return ctx;
}