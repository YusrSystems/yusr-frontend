import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Loader2 } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type ChangeableEntity, ChangeableEntityMode, type Dto } from "#/stateManager";
import { ResultStatus, StatusWorkflow } from "#/types";
import { RowVer } from "#/types/rowVer.ts";
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "../../pure";
import type { ApiResponse, RequestOptions } from "#/api";


export interface ISaveResource<TDto>
{
	add: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
	update: (dto: TDto, options?: RequestOptions) => Promise<ApiResponse<TDto>>;
}

export interface SaveButtonProps<TEntity extends ChangeableEntity<TDto>, TDto extends Dto>
{
	entity?: Signal<TEntity>;
	resource?: ISaveResource<TDto>;
	action?: () => Promise<ApiResponse<any>>;
	onSave?: () => void | Promise<void>;
	onSuccess?: (newData: TDto) => void;
	transformData?: (data: TDto) => TDto | Promise<TDto>;
	label?: string;
	variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
	className?: string;
	disabled?: boolean;
	checkEntityChanges?: boolean;
	showConfirmationDialog?: (entity: TEntity) => boolean;
	confirmationDialog?: React.ReactNode;
	loadingSignal?: Signal<boolean>;
}

export function SaveButton<TEntity extends ChangeableEntity<TDto> = any, TDto extends Dto = any>(
	{
		entity,
		resource,
		action,
		onSave,
		onSuccess,
		transformData,
		label,
		variant = "default",
		className,
		disabled,
		checkEntityChanges = true,
		showConfirmationDialog,
		confirmationDialog,
		loadingSignal
	}: SaveButtonProps<TEntity, TDto>
)
{
	useSignals();
	const {t, i18n} = useTranslation("common");
	const internalLoading = useMemo(() => signal(false), []);
	const errors = useMemo(() => signal<string[]>([]), []);
	const showErrors = useMemo(() => signal(false), []);
	const warnings = useMemo(() => signal<string[]>([]), []);
	const showWarnings = useMemo(() => signal(false), []);
	const pendingIgnore = useMemo(() => signal(false), []);
	const showConfirmationDialogSignal = useMemo(() => signal(false), []);

	const loading = loadingSignal ?? internalLoading;

	async function executeSave(): Promise<void>
	{
		if (action)
		{
			loading.value = true;
			try
			{
				const res = await action();
				if (res.status === ResultStatus.UnprocessableEntity || (!res.ok && res.status === 422))
				{
					errors.value = res.errors.length > 0 ? res.errors : [res.title || t("saveButton.errors")];
					showErrors.value = true;
					return;
				}
				if (res.status === ResultStatus.PreconditionFailed || (!res.ok && res.status === 412))
				{
					warnings.value = res.warnings.length > 0 ? res.warnings : [res.title || t("saveButton.warnings")];
					showWarnings.value = true;
					return;
				}
			}
			finally
			{
				loading.value = false;
			}
			return;
		}

		if (onSave)
		{
			loading.value = true;
			try
			{
				await onSave();
			}
			finally
			{
				loading.value = false;
			}
			return;
		}

		if (!entity || !resource)
		{
			return;
		}

		if (!entity.value.validate())
		{
			return;
		}

		if (showConfirmationDialog?.(entity.value))
		{
			showConfirmationDialogSignal.value = true;
			return;
		}

		loading.value = true;

		try
		{
			const dto = entity.value.toJson();
			const payload = transformData ? await transformData(dto) : dto;
			const isCreate = entity.value.mode.value === ChangeableEntityMode.Create;

			const result = isCreate
				? await resource.add(payload, {silent: true})
				: await resource.update(payload, {silent: true});

			if (result.status === ResultStatus.UnprocessableEntity || (!result.ok && result.status === 422))
			{
				errors.value = result.errors.length > 0 ? result.errors : [result.title || t("saveButton.errors")];
				showErrors.value = true;
				return;
			}

			if (result.status === ResultStatus.PreconditionFailed || (!result.ok && result.status === 412))
			{
				warnings.value = result.warnings.length > 0 ? result.warnings : [result.title || t("saveButton.warnings")];
				showWarnings.value = true;
				return;
			}

			if (result.ok && result.data !== undefined)
			{
				entity.value.resetChanged();
				entity.value.resetDirty();

				if (StatusWorkflow.isEntity(entity.value) && StatusWorkflow.isDto(result.data))
				{
					entity.value.transactionStatus.value = result.data.transactionStatus;
				}
				if (RowVer.isEntity(entity.value) && RowVer.isDto(result.data))
				{
					entity.value.rowVer.value = result.data.rowVer;
				}

				onSuccess?.(result.data);
			}
		}
		finally
		{
			loading.value = false;
		}
	}

	async function handleIgnoreWarnings(): Promise<void>
	{
		showWarnings.value = false;
		pendingIgnore.value = true;
		if (entity?.value?.ignoreWarnings)
		{
			entity.value.ignoreWarnings.value = true;
		}
		try
		{
			await executeSave();
		}
		finally
		{
			pendingIgnore.value = false;
		}
	}

	const isUpdate = entity?.value?.mode?.value === ChangeableEntityMode.Update;
	const defaultLabel = isUpdate ? t("saveButton.saveChanges") : t("saveButton.save");
	const buttonLabel = label ?? defaultLabel;

	const hasChanges = entity?.value?.hasChanges ? entity.value.hasChanges.value : true;
	const isButtonDisabled = loading.value || pendingIgnore.value || (!action && checkEntityChanges && !hasChanges) || disabled;

	return (
		<>
			<Button
				disabled={ isButtonDisabled }
				onClick={ () => void executeSave() }
				variant={ variant }
				className={ className }
			>
				{ (loading.value || pendingIgnore.value) && <Loader2 className="ml-2 h-4 w-4 animate-spin"/> }
				{ buttonLabel }
			</Button>

			<Dialog open={ showWarnings.value } onOpenChange={ (open) => (showWarnings.value = open) }>
				<DialogContent dir={ i18n.dir() }>
					<DialogHeader>
						<DialogTitle>{ t("saveButton.warnings") }</DialogTitle>
						<DialogDescription asChild>
							<ul className="mt-2 space-y-1 text-sm text-start">
								{ warnings.value.map((w, i) => (
									<li key={ i } className="text-orange-600">• { w }</li>
								)) }
							</ul>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">{ t("saveButton.cancel") }</Button>
						</DialogClose>
						<Button onClick={ () => void handleIgnoreWarnings() }>
							{ t("saveButton.ignoreWarnings") }
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={ showErrors.value } onOpenChange={ (open) => (showErrors.value = open) }>
				<DialogContent dir={ i18n.dir() }>
					<DialogHeader>
						<DialogTitle>{ t("saveButton.errors") }</DialogTitle>
						<DialogDescription asChild>
							<ul className="mt-2 space-y-1 text-sm text-start">
								{ errors.value.map((e, i) => (
									<li key={ i } className="text-red-600">• { e }</li>
								)) }
							</ul>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">{ t("changeDialog.close") }</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{ showConfirmationDialogSignal.value && (
				<Dialog
					open={ showConfirmationDialogSignal.value }
					onOpenChange={ (open) => (showConfirmationDialogSignal.value = open) }
				>
					{ confirmationDialog }
				</Dialog>
			) }
		</>
	);
}