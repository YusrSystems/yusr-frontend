import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { PAGE_SIZE } from "@/core/constants/systemConstants";
import { Tax, type TaxDto } from "@/core/data/tax";
import TaxesApiService from "@/core/networking/taxesApiService";
import { useSignals } from "@preact/signals-react/runtime";
import { Percent } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CrudPage, DialogContent, DialogTitle, SystemPermissionsActions, TablePreview, UnauthorizedPage } from "yusr-ui";
import { TaxesCubit } from "./state/taxesCubit";
import { TaxesError, TaxesLoaded, TaxesLoading } from "./state/taxesState";
import { Services } from "@/core/services/services";

const cubit = new TaxesCubit();

export default function TestPage()
{
  useSignals();
  const { t } = useTranslation("accounting");

  if (!Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Get))
  {
    return <UnauthorizedPage />;
  }

  cubit.Filter();

  return (
    <CrudPage>
      <CrudPage.Header
        title={ t("taxes.title") }
        addButtonTitle={ t("taxes.addNewTitle") }
        isAddButtonVisible={ Services.auth.hasAuth(SystemPermissionsResources.Taxes, SystemPermissionsActions.Add) }
      />

      <Cards />

      <CrudPage.SearchInput onSearch={ (searchText) => cubit.Filter(undefined, searchText) } />

      <TestPageTable />

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

function Cards()
{
  useSignals();
  const { t } = useTranslation("accounting");
  if (cubit.state.value instanceof TaxesLoaded)
  {
    return (
      <CrudPage.Cards
        cards={ [{
          title: t("taxes.totalTaxes"),
          data: cubit.state.value.taxes.length.toString(),
          icon: <Percent className="h-4 w-4 text-muted-foreground" />
        }] }
      />
    );
  }

  return undefined;
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
      <CrudPage.Table>
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
        <CrudPage.TablePagination
          pageSize={ PAGE_SIZE }
          totalNumber={ cubit.state.value.count }
          currentPage={ cubit.state.value.currentPage }
          onPageChanged={ () =>
          {
            if (cubit.state.value instanceof TaxesLoaded)
            {
              cubit.state.value.currentPage++;
              cubit.Filter(cubit.state.value.currentPage);
            }
          } }
        />
      </CrudPage.Table>
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
