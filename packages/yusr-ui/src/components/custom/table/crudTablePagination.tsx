import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious
} from "#/components/pure";

import { useTranslation } from "react-i18next";


export type CrudTablePaginationProps = {
	pageSize: number;
	totalNumber: number;
	currentPage: number;
	onPageChanged?: (newPage: number) => void;
	className?: string;
};

export function CrudTablePagination({
	pageSize,
	totalNumber,
	currentPage,
	onPageChanged,
	className
}: CrudTablePaginationProps)
{
	const {t, i18n} = useTranslation("common");
	const totalPages = Math.ceil(totalNumber / pageSize);
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalNumber);

	const handlePrevious = () =>
	{
		if (currentPage > 1)
		{
			onPageChanged?.(currentPage - 1);
		}
	};

	const handleNext = () =>
	{
		if (currentPage < totalPages)
		{
			onPageChanged?.(currentPage + 1);
		}
	};

	return (
		<div
			className={ `p-4 border-t bg-muted flex items-center justify-between text-sm text-muted-foreground sticky bottom-0 ${ className }` }>
      <span className="w-50">
        { " " }
		  { t("pagination.results", {start, end, total: totalNumber}) }
		  { " " }
      </span>

			<Pagination dir={ i18n.dir() } className="justify-end w-auto mx-0">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={ handlePrevious }
							text={ t("pagination.previous") }
							className="cursor-pointer"
						/>
					</PaginationItem>

					<DropdownMenu dir={ i18n.dir() }>
						<DropdownMenuTrigger asChild>
							<Button variant="outline"
							        className="w-fit h-8 px-3 justify-start gap-2 text-sm cursor-pointer">
								<span>{ currentPage }</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{ Array.from(
								{length: Math.ceil(totalNumber / pageSize)},
								(_, i) => (
									<DropdownMenuItem
										key={ i + 1 }
										onClick={ () => onPageChanged?.(i + 1) }
									>
										{ i + 1 }
									</DropdownMenuItem>
								)
							) }
						</DropdownMenuContent>
					</DropdownMenu>

					<PaginationItem>
						<PaginationNext onClick={ handleNext } text={ t("pagination.next") }
						                className="cursor-pointer"/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
