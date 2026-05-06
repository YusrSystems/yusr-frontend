import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../pure/pagination";

import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../pure/dropdown-menu";
import { SidebarMenuButton } from "../../pure/sidebar";

type PaginationFooterProps = {
  pageSize: number;
  totalNumber: number;
  currentPage: number;
  onPageChanged?: (newPage: number) => void;
};

export function CrudTablePagination({ pageSize, totalNumber, currentPage, onPageChanged }: PaginationFooterProps)
{
  const { t, i18n } = useTranslation("common");
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
    <div className="p-4 border-t bg-muted flex items-center justify-between text-sm text-muted-foreground">
      <span className="w-50">
        { " " }
        { t("pagination.results", { start, end, total: totalNumber }) }
        { " " }
      </span>

      <Pagination dir={ i18n.dir() } className="justify-end w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={ handlePrevious } text={ t("pagination.previous") } />
          </PaginationItem>

          <DropdownMenu dir={ i18n.dir() }>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full h-5 justify-start gap-2 text-base">
                <span>{ currentPage }</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              { Array.from(
                { length: Math.ceil(totalNumber / pageSize) },
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
            <PaginationNext onClick={ handleNext } text={ t("pagination.next") } />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
