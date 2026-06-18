import { Signal, signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { type PropsWithChildren, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { type ChangeableEntity, ChangeableEntityMode, type Dto } from "../../..//stateManager";
import { ContextMenu, ContextMenuTrigger } from "../../../components/pure";
import { Dialog, DialogContent } from "../../pure/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../pure/table";
import { DeleteDialog, type DeleteDialogProps } from "../dialogs/deleteDialog";
import { SearchInput, type SearchInputParams } from "../inputs/searchInput";
import { CrudTableCard, type CrudTableCardProps } from "../table/crudTableCard";
import { CrudTableHeader, type CrudTableHeaderProps } from "../table/crudTableHeader";
import { CrudTablePagination, type CrudTablePaginationProps } from "../table/crudTablePagination";
import { CrudTableRowActionsMenu, type CrudTableRowActionsMenuProps } from "../table/crudTableRowActionsMenu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CrudPageContext, useCrudPageContext } from "./crudPageContext";


const isChangeDialogOpen = signal<boolean>(false);
const isDeleteDialogOpen = signal<boolean>(false);
const selectedEntity = signal<ChangeableEntity<any> | undefined>(undefined);

export type CrudPageTableRow<TEntity extends ChangeableEntity<TDto>, TDto extends Dto> = {
	data: TEntity[];
	headerRows: { rowBody: ReactNode; rowStyles: string; }[];
	tableRowMapper: (entity: TEntity) => { rowBody: ReactNode; rowStyles?: string; }[];
	onDoubleClick?: (entity: TEntity) => void;
};

export type CrudPageChangeDialogProps<TDto extends Dto> = {
	changeDialog: (dto: TDto | undefined, closeDialog: () => void) => React.ReactNode;
};

export function CrudPage({children}: PropsWithChildren)
{
	useSignals();
	const navigate = useNavigate();
	const {pathname} = useLocation();
	const params = useParams();

	const basePath = params.id
		? pathname.slice(0, pathname.lastIndexOf(`/${ params.id }`))
		: pathname;
	console.log(basePath);
	console.log(params);
	return (
		<CrudPageContext.Provider value={ {navigate, basePath} }>
			<div className="px-5 py-3 h-[calc(100vh-70px)] flex flex-col">
				{ children }
			</div>
		</CrudPageContext.Provider>
	);
}

CrudPage.Header = function ({...props}: Omit<CrudTableHeaderProps, "onAddButtonClicked">)
{
	useSignals();
	return (
		<CrudTableHeader
			onAddButtonClicked={ () =>
			{
				selectedEntity.value = undefined;
				isChangeDialogOpen.value = true;
			} }
			{ ...props }
		/>
	);
};

CrudPage.Cards = function ({...props}: CrudTableCardProps)
{
	useSignals();
	return <CrudTableCard { ...props } />;
};

CrudPage.SearchInput = function ({...props}: SearchInputParams)
{
	return <SearchInput { ...props } />;
};

CrudPage.Table = function ({children}: PropsWithChildren)
{
	useSignals();
	return (
		<>
			<div className="rounded-b-xl border shadow-sm overflow-auto ">
				{ children }
			</div>
		</>
	);
};

CrudPage.TableBody = function <TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
	{data, headerRows, tableRowMapper, ...props}:
	& Omit<CrudPageTableRow<TEntity, TDto>, "onDoubleClick">
		& Omit<CrudTableRowActionsMenuProps, "onEditClicked" | "onDeleteClicked">
)
{
	useSignals();
	const {i18n} = useTranslation();
	const {navigate, basePath} = useCrudPageContext();

	const openEditDialog = (entity: TEntity) =>
	{
		selectedEntity.value = entity;
		selectedEntity.value.mode.value = ChangeableEntityMode.Update;
		navigate(`${ basePath }/${ entity.id.value }`);
		isChangeDialogOpen.value = true;
	};
	return (
		<Table>
			<TableHeader className="bg-muted">
				<TableRow>
					{ headerRows.map((row, i) => <TableHead key={ i }
					                                        className={ row.rowStyles }>{ row.rowBody }</TableHead>) }
				</TableRow>
			</TableHeader>

			<TableBody>
				{ data.map((entity, i: number) => (
					<ContextMenu dir={ i18n.dir() } key={ i }>
						<ContextMenuTrigger asChild>
							<TableRow
								onDoubleClick={ () => openEditDialog(entity) }
								className="hover:bg-secondary/50 transition-colors cursor-pointer"
							>
								<TableCell>
									<CrudTableRowActionsMenu
										{ ...props }
										type="dropdown"
										onEditClicked={ () => openEditDialog(entity) }
										onDeleteClicked={ () =>
										{
											selectedEntity.value = entity;
											isDeleteDialogOpen.value = true;
										} }
									/>
								</TableCell>

								{ tableRowMapper(entity).map((row, i) => (
									<TableCell key={ i }>
										<div className={ row.rowStyles }>{ row.rowBody }</div>
									</TableCell>
								)) }
							</TableRow>
						</ContextMenuTrigger>

						<CrudTableRowActionsMenu
							{ ...props }
							type="context"
							onEditClicked={ () =>
							{
								selectedEntity.value = entity;
								selectedEntity.value.mode.value = ChangeableEntityMode.Update;
								isChangeDialogOpen.value = true;
							} }
							onDeleteClicked={ () =>
							{
								selectedEntity.value = entity;
								isDeleteDialogOpen.value = true;
							} }
						/>
					</ContextMenu>
				)) }
			</TableBody>
		</Table>
	);
};

CrudPage.TablePagination = function (props: CrudTablePaginationProps)
{
	useSignals();
	return <CrudTablePagination { ...props } />;
};

CrudPage.ChangeDialog = function <TDto extends Dto>(
	{changeDialog}: CrudPageChangeDialogProps<TDto>
)
{
	useSignals();
	const {navigate, basePath} = useCrudPageContext();
	return (
		<>
			{ isChangeDialogOpen.value && (
				<Dialog
					open={ isChangeDialogOpen.value }
					onOpenChange={ (open) =>
					{
						isChangeDialogOpen.value = open;
						if (!open)
						{
							navigate(basePath, {replace: true});
						}
					} }
				>
					{ changeDialog(
						selectedEntity.value?.toJson() as TDto,
						() =>
						{
							isChangeDialogOpen.value = false;
						}
					) }
				</Dialog>
			) }
		</>
	);
};

CrudPage.DeleteDialog = function <TEntity extends ChangeableEntity<TDto>, TDto extends Dto>(
	{entityNameSelector, onSuccess, ...props}:
	& Omit<DeleteDialogProps<TEntity, TDto>, "id" | "entityName" | "onSuccess">
		& {
		entityNameSelector: (entity: TEntity) => Signal<string | number> | string;
		onSuccess?: (entity: TEntity) => void;
	}
)
{
	useSignals();
	const {i18n} = useTranslation();

	const entity: TEntity | undefined = selectedEntity.value as TEntity;
	if (entity?.id === undefined)
	{
		return undefined;
	}

	const entityNameSelectorResult = entityNameSelector(entity);

	return (
		<Dialog
			open={ isDeleteDialogOpen.value }
			onOpenChange={ (open) => isDeleteDialogOpen.value = open }
		>
			<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
				<DeleteDialog
					{ ...props }
					id={ entity.id.value }
					entityName={ (entityNameSelectorResult instanceof Signal ? entityNameSelectorResult?.value.toString() : entityNameSelectorResult) ?? "" }
					onSuccess={ () =>
					{
						onSuccess?.(entity);
						isDeleteDialogOpen.value = false;
					} }
				/>
			</DialogContent>
		</Dialog>
	);
};
