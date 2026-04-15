import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "../../pure/pagination";

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
  const totalPages = Math.ceil(totalNumber / pageSize);

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
        نتائج { (currentPage - 1) * pageSize } - { currentPage * pageSize } من { totalNumber }
        { " " }
      </span>

      <Pagination dir="rtl" className="justify-end w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={ handlePrevious } text="السابق" />
          </PaginationItem>

          <DropdownMenu dir="rtl">
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
            <PaginationNext onClick={ handleNext } text="التالي" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
