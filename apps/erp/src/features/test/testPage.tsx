import { Tax, type TaxDto } from "@/core/data/tax";
import TaxesApiService from "@/core/networking/taxesApiService";
// import { useAppSelector } from "@/core/state/store";
import { signal } from "@preact/signals-react";
import { Percent } from "lucide-react";
import { CrudPage, DialogContent, DialogTitle } from "yusr-ui";

const isChangeDialogOpen = signal<boolean>(false);
const isDeleteDialogOpen = signal<boolean>(false);

export default function TestPage()
{
  // const authState = useAppSelector((state) => state.auth);

  console.log("page rendered");

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

      <CrudPage.Table<Tax, TaxDto>
        data={ [new Tax({ id: 1, name: "test", percentage: 10, isPrimary: true })] }
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

export function TestDialog()
{
  return (
    <DialogContent aria-describedby={ undefined }>
      <DialogTitle>Test Dialog</DialogTitle>
    </DialogContent>
  );
}
