import { Tax, type TaxDto } from "@/core/data/tax";
import TaxesApiService from "@/core/networking/taxesApiService";
// import { useAppSelector } from "@/core/state/store";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Percent } from "lucide-react";
import { CrudPage, DialogContent, DialogTitle } from "yusr-ui";
import { TaxesCubit } from "./state/taxesCubit";
import { TaxesError, TaxesLoaded, TaxesLoading } from "./state/taxesState";

const isChangeDialogOpen = signal<boolean>(false);
const isDeleteDialogOpen = signal<boolean>(false);
const cubit = new TaxesCubit();

export default async function TestPage()
{
  useSignals();
  console.log("page rendered");
  await cubit.getUserData();

  return (
    <CrudPage>
      <CrudPage.Header
        title="Test Page"
        addButtonTitle="Create Test"
        isAddButtonVisible={ true }
        onAddButtonClicked={ () =>
        {
          console.log("add button clicked");
          console.log("isChangeDialogOpen: ", isChangeDialogOpen);
          isChangeDialogOpen.value = true;
          console.log("isChangeDialogOpen: ", isChangeDialogOpen);
        } }
        changeDialog={ <></> }
        actionButtons={ [] }
      />

      <CrudPage.Cards
        cards={ [{
          title: "totalTaxes",
          data: "1",
          icon: <Percent className="h-4 w-4 text-muted-foreground" />
        }] }
      />

      <CrudPage.SearchInput onSearch={ (searchText) => console.log(searchText) } />

      <TestPageTable />

      <CrudPage.ChangeDialog
        changeDialog={ <TestDialog /> }
        open={ isChangeDialogOpen }
        onOpenChange={ (open) =>
        {
          console.log("open change edit dialog");

          isChangeDialogOpen.value = open;
        } }
      />

      <CrudPage.DeleteDialog
        open={ isDeleteDialogOpen }
        onOpenChange={ (open) => isDeleteDialogOpen.value = open }
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
  if (cubit.state.value instanceof TaxesLoading)
  {
    return <h2>Loading...</h2>;
  }

  if (cubit.state.value instanceof TaxesLoaded)
  {
    return (
      <CrudPage.Table<Tax, TaxDto>
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
        onEditClicked={ () => isChangeDialogOpen.value = true }
        onDeleteClicked={ () => isDeleteDialogOpen.value = true }
        onDoubleClick={ () => isChangeDialogOpen.value = true }
        hasUpdatePermission={ true }
        hasDeletePermission={ true }
        pageSize={ 10 }
        totalNumber={ 100 }
        currentPage={ 1 }
        onPageChanged={ () =>
        {} }
      />
    );
  }

  if (cubit.state.value instanceof TaxesError)
  {
    return <h2>Error loading user: { cubit.state.value.message }</h2>;
  }

  return <h2>No taxes yet</h2>;
}

export function TestDialog()
{
  return (
    <DialogContent aria-describedby={ undefined }>
      <DialogTitle>Test Dialog</DialogTitle>
    </DialogContent>
  );
}
