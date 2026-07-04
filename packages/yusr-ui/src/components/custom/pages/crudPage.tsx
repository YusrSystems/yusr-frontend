import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import React, { type PropsWithChildren, type ReactNode, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { type Dto } from "../../..//stateManager";
import { Button, type ButtonProps, ContextMenu, ContextMenuTrigger } from "../../../components/pure";
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
import { PlusIcon } from "lucide-react";


export type CrudPageTableRow<TDto extends Dto> = {
	data: TDto[];
	headerRows: { rowBody: ReactNode; rowStyles: string; }[];
	tableRowMapper: (dto: TDto) => { rowBody: ReactNode; rowStyles?: string; }[];
	onDoubleClick?: (dto: TDto) => void;
};

export type CrudPageChangeDialogProps<TDto extends Dto> = {
	changeDialog: (dto: TDto | undefined, closeDialog: () => void) => React.ReactNode;
};

export function CrudPage<TDto extends Dto>({children}: PropsWithChildren)
{
	useSignals();
	const isChangeDialogOpen = useMemo(() => signal<boolean>(false), []);
	const isDeleteDialogOpen = useMemo(() => signal<boolean>(false), []);
	const selectedDto = useMemo(() => signal<TDto | undefined>(undefined), []);
	const navigate = useNavigate();
	const {pathname} = useLocation();
	const params = useParams();

	const basePath = params.id
		? pathname.slice(0, pathname.lastIndexOf(`/${ params.id }`))
		: pathname;
	return (
		<CrudPageContext.Provider value={ {isChangeDialogOpen, isDeleteDialogOpen, selectedDto, navigate, basePath} }>
			<div className="px-5 py-3 h-[calc(100vh-70px)] flex flex-col">
				{ children }
			</div>
		</CrudPageContext.Provider>
	);
}

// TODO: this is old, we must remove it
CrudPage.Header = function ({...props}: Omit<CrudTableHeaderProps, "onAddButtonClicked">)
{
	useSignals();

	const {selectedDto, isChangeDialogOpen} = useCrudPageContext();
	return (
		<CrudTableHeader
			onAddButtonClicked={ () =>
			{
				selectedDto.value = undefined;
				isChangeDialogOpen.value = true;
			} }
			{ ...props }
		/>
	);
};

CrudPage.HeaderContainer = function ({className, children}: { className?: string } & PropsWithChildren)
{
	return (
		<div className={ `flex justify-between mb-8 gap-3 ${ className }` }>
			{ children }
		</div>
	);
};

CrudPage.HeaderButtonsContainer = function ({className, children}: { className?: string } & PropsWithChildren)
{
	return (
		<div className={ `flex gap-3 ${ className }` }>
			{ children }
		</div>
	);
};

CrudPage.AddButton = function ({title, onClick}: { title: string } & ButtonProps)
{
	useSignals();

	const {selectedDto, isChangeDialogOpen} = useCrudPageContext();
	return (
		<Button variant="default" onClick={ (e) =>
		{
			selectedDto.value = undefined;
			isChangeDialogOpen.value = true;
			onClick?.(e);
		} }>
			<PlusIcon className="h-4 w-4"/>
			{ title }
		</Button>
	);
};

CrudPage.AddButton = function ({title, onClick}: { title: string } & ButtonProps)
{
	useSignals();

	const {selectedDto, isChangeDialogOpen} = useCrudPageContext();
	return (
		<Button variant="default" onClick={ (e) =>
		{
			selectedDto.value = undefined;
			isChangeDialogOpen.value = true;
			onClick?.(e);
		} }>
			<PlusIcon className="h-4 w-4"/>
			{ title }
		</Button>
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

CrudPage.TableBody = function <TDto extends Dto>(
	{
		data,
		headerRows,
		tableRowMapper,
		dropdownItems,
		contextMenuItems,
		isShareablePage,
		onEditClicked,
		...props
	}: Omit<CrudPageTableRow<TDto>, "onDoubleClick">
		& Omit<CrudTableRowActionsMenuProps<TDto>, "onEditClicked" | "onDeleteClicked" | "dto" | "dropdownItems" | "contextMenuItems">
		& {
		onEditClicked?: (dto: TDto) => void;
		dropdownItems?: (dto: TDto, openEditDialog: (dto: TDto) => void) => React.ReactNode[];
		contextMenuItems?: (dto: TDto, openEditDialog: (dto: TDto) => void) => React.ReactNode[];
		isShareablePage?: boolean;
	}
)
{
	useSignals();
	const {i18n} = useTranslation();
	const {selectedDto, isChangeDialogOpen, isDeleteDialogOpen, navigate, basePath} = useCrudPageContext();

	const openEditDialog = (dto: TDto) =>
	{
		selectedDto.value = dto;
		isShareablePage && navigate(`${ basePath }/${ dto.id }`);
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
				{ data.map((dto, i: number) => (
					<ContextMenu dir={ i18n.dir() } key={ i }>
						<ContextMenuTrigger asChild>
							<TableRow
								onDoubleClick={ () =>
								{
									onEditClicked?.(dto);
									openEditDialog(dto);
								} }
								className="hover:bg-secondary/50 transition-colors cursor-pointer"
							>
								<TableCell>
									<CrudTableRowActionsMenu<TDto>
										{ ...props }
										dto={ dto }
										type="dropdown"
										dropdownItems={ dropdownItems?.(dto, openEditDialog) }
										contextMenuItems={ contextMenuItems?.(dto, openEditDialog) }
										onEditClicked={ () =>
										{
											onEditClicked?.(dto);
											openEditDialog(dto);
										} }
										onDeleteClicked={ () =>
										{
											selectedDto.value = dto;
											isDeleteDialogOpen.value = true;
										} }
									/>
								</TableCell>

								{ tableRowMapper(dto).map((row, i) => (
									<TableCell key={ i }>
										<div className={ row.rowStyles }>{ row.rowBody }</div>
									</TableCell>
								)) }
							</TableRow>
						</ContextMenuTrigger>

						<CrudTableRowActionsMenu<TDto>
							{ ...props }
							dto={ dto }
							type="context"
							dropdownItems={ dropdownItems?.(dto, openEditDialog) }
							contextMenuItems={ contextMenuItems?.(dto, openEditDialog) }
							onEditClicked={ () =>
							{
								onEditClicked?.(dto);
								openEditDialog(dto);
							} }
							onDeleteClicked={ () =>
							{
								selectedDto.value = dto;
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
	{changeDialog, fetchEntity}: CrudPageChangeDialogProps<TDto> & {
		fetchEntity?: (id: number) => Promise<TDto | undefined>
	}
)
{
	useSignals();
	const {selectedDto, isChangeDialogOpen, navigate, basePath} = useCrudPageContext();
	const params = useParams();

	useEffect(() =>
	{
		if (!params.id)
		{
			return;
		}

		async function loadEntity()
		{
			const entity = await fetchEntity?.(Number(params.id));
			if (!entity)
			{
				navigate(basePath, {replace: true});
				return;
			}
			selectedDto.value = entity;
			isChangeDialogOpen.value = true;
		}

		void loadEntity();
	}, []);

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
						selectedDto.value as TDto,
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

CrudPage.DeleteDialog = function <TDto extends Dto>(
	{entityNameSelector, onSuccess, ...props}:
	& Omit<DeleteDialogProps<TDto>, "id" | "entityName" | "onSuccess">
		& {
		entityNameSelector: (dto: TDto) => string;
		onSuccess?: (dto: TDto) => void;
	}
)
{
	useSignals();
	const {i18n} = useTranslation();
	const {selectedDto, isDeleteDialogOpen} = useCrudPageContext();

	if (selectedDto.value === undefined || selectedDto.value?.id === undefined)
	{
		return undefined;
	}

	return (
		<Dialog
			open={ isDeleteDialogOpen.value }
			onOpenChange={ (open) => isDeleteDialogOpen.value = open }
		>
			<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
				<DeleteDialog
					{ ...props }
					id={ selectedDto.value.id }
					entityName={ entityNameSelector(selectedDto.value as TDto) ?? "" }
					onSuccess={ () =>
					{
						onSuccess?.(selectedDto.value as TDto);
						isDeleteDialogOpen.value = false;
					} }
				/>
			</DialogContent>
		</Dialog>
	);
};
