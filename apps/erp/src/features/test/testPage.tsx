import { Tax, type TaxDto } from "@/core/data/tax";
import TaxesApiService from "@/core/networking/taxesApiService";
import { useSignals } from "@preact/signals-react/runtime";
import { Percent } from "lucide-react";
import { CrudPage, DialogContent, DialogTitle, TablePreview, UnauthorizedPage } from "yusr-ui";
import { TaxesCubit } from "./state/taxesCubit";
import { TaxesError, TaxesLoaded, TaxesLoading } from "./state/taxesState";

const cubit = new TaxesCubit();

export default function TestPage()
{
  useSignals();
  console.log("page rendered");

  // if(CurrentUserService.CurrentUser.role.permissions )
  if (false)
  {
    return <UnauthorizedPage />;
  }

  cubit.Filter();

  return (
    <CrudPage>
      <CrudPage.Header
        title="Test Page"
        addButtonTitle="Create Test"
        isAddButtonVisible={ true }
        actionButtons={ [] }
      />

      <CrudPage.Cards
        cards={ [{
          title: "totalTaxes",
          data: "1",
          icon: <Percent className="h-4 w-4 text-muted-foreground" />
        }] }
      />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.Filter(searchText) } />

      <CrudPage.Table>
        <TestPageTable />
        <CrudPage.TablePagination
          pageSize={ 10 }
          totalNumber={ 100 }
          currentPage={ 1 }
          onPageChanged={ () =>
          {} }
        />
      </CrudPage.Table>

      <CrudPage.ChangeDialog
        changeDialog={ <TestDialog /> }
      />

      <CrudPage.DeleteDialog
        entityName="test"
        id={ 1 }
        service={ new TaxesApiService() }
        onSuccess={ () => console.log("deleted") }
      />
    </CrudPage>
  );
}

function TestPageTable()
{
  useSignals();
  if (cubit.state.value instanceof TaxesLoading)
  {
    return <TablePreview.Loading />;
  }

  if (cubit.state.value instanceof TaxesLoaded)
  {
    return (
      <CrudPage.TableBody<Tax, TaxDto>
        data={ cubit.state.value.taxes }
        headerRows={ [
          { rowBody: "Actions", rowStyles: "" },
          { rowBody: "id", rowStyles: "" },
          { rowBody: "name", rowStyles: "" },
          { rowBody: "percentage", rowStyles: "" },
          { rowBody: "isPrimary", rowStyles: "" }
        ] }
        tableRowMapper={ (
          entity
        ) => [{ rowBody: entity.id.value.toString(), rowStyles: "" }, { rowBody: entity.name.value, rowStyles: "" }, {
          rowBody: entity.percentage.value.toString(),
          rowStyles: ""
        }, { rowBody: entity.isPrimary.value.toString(), rowStyles: "" }] }
        hasUpdatePermission={ true }
        hasDeletePermission={ true }
      />
    );
  }

  if (cubit.state.value instanceof TaxesError)
  {
    return <TablePreview.Error />;
  }

  return <TablePreview.Empty />;
}

export function TestDialog()
{
  useSignals();
  return (
    <DialogContent aria-describedby={ undefined }>
      <DialogTitle>Test Dialog</DialogTitle>
    </DialogContent>
  );
}
