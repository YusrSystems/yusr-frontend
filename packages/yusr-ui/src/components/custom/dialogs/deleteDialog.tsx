import { Loader2, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Button,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Separator
} from "#/components/pure";
import type { ApiResponse, RequestOptions } from "#/api";


export interface IDeleteResource
{
	delete: (id: number, options?: RequestOptions) => Promise<ApiResponse<boolean>>;
}

export type DeleteDialogProps = {
	entityName: string;
	id: number;
	resource: IDeleteResource;
	onSuccess?: () => void;
};

export function DeleteDialog(
	{entityName, id, resource, onSuccess}: DeleteDialogProps
)
{
	const {t} = useTranslation("common");
	const [loading, setLoading] = useState(false);

	async function handleDelete()
	{
		setLoading(true);
		try
		{
			const res = await resource.delete(id);
			if (res.ok)
			{
				onSuccess?.();
			}
		}
		finally
		{
			setLoading(false);
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>{ t("deleteDialog.title", {entityName}) }</DialogTitle>
				<DialogDescription></DialogDescription>
			</DialogHeader>
			<Separator/>
			<div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
				<OctagonAlert className="h-7 w-7 text-destructive"/>
			</div>
			<span className="font-bold text-center text-xl">
				{ t("deleteDialog.confirmMessage", {entityName, id}) }
			</span>
			<span className="text-center text-[15px]">
				{ t("deleteDialog.warningMessage", {entityName}) }
			</span>
			<DialogFooter>
				<DialogClose asChild>
					<Button variant="outline">{ t("deleteDialog.cancel") }</Button>
				</DialogClose>
				<Button variant="destructive" onClick={ handleDelete } disabled={ loading }>
					{ loading && <Loader2 className="ml-2 h-4 w-4 animate-spin"/> }
					{ t("deleteDialog.confirm") }
				</Button>
			</DialogFooter>
		</>
	);
}