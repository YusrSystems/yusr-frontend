import { Loader2, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BaseApiService } from "../../../networking";
import type { Dto } from "../../../stateManager";
import { Button } from "../../pure/button";
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";


export type DeleteDialogProps<TDto extends Dto> = {
	entityName: string;
	id: number;
	service: BaseApiService<TDto>;
	onSuccess?: () => void;
};

export function DeleteDialog<TDto extends Dto>(
	{entityName, id, service, onSuccess}: DeleteDialogProps<TDto>
)
{
	const {t} = useTranslation();
	const [loading, setLoading] = useState(false);

	async function Delete()
	{
		setLoading(true);

		const res = await service.Delete(id);

		if (res.status === 200)
		{
			onSuccess?.();
		}

		setLoading(false);
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>{ t("deleteDialog.title", {entityName}) }</DialogTitle>
				<DialogDescription></DialogDescription>
			</DialogHeader>

			<Separator></Separator>

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
				<Button variant="destructive" onClick={ Delete } disabled={ loading }>
					{ loading && <Loader2 className="ml-2 h-4 w-4 animate-spin"/> }
					{ t("deleteDialog.confirm") }
				</Button>
			</DialogFooter>
		</>
	);
}
