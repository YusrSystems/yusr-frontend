import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { CreditCardIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    CrudPage,
    PageError,
    PageLoaded,
    PageLoading,
    SystemPermissionsActions,
    TablePreview,
    UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "../../core/auth/systemPermissionsResources";
import { CommissionTypeOld } from "../../core/data/paymentMethod";
import ChangePaymentMethodDialog from "./changePaymentMethodDialog";
import { PaymentMethod, type PaymentMethodDto } from "../../core/data/paymentMethod.ts";


export function PaymentMethodsPage()
{
	useSignals();
	if (!Services.auth.hasAuth(SystemPermissionsResources.PaymentMethods, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	const {t} = useTranslation("accounting");

	useEffect(() => Cubits.paymentMethods.init(), []);

	return (
		<CrudPage>
			<CrudPage.Header
				title={ t("paymentMethods.title") }
				addButtonTitle={ t("paymentMethods.addNewTitle") }
				isAddButtonVisible={ Services.auth.hasAuth(
					SystemPermissionsResources.PaymentMethods,
					SystemPermissionsActions.Add
				) }
			/>

			<Cards/>

			<CrudPage.SearchInput onSearch={ (searchText) => Cubits.paymentMethods.search(searchText) }/>

			<PageTable/>
			<CrudPage.ChangeDialog
				changeDialog={ (dto: PaymentMethodDto | undefined, closeDialog) =>
				{
					return (
						<ChangePaymentMethodDialog
							entity={ dto
								? PaymentMethod.load(dto)
								: PaymentMethod.create() }
							service={ Services.paymentMethodsApi }
							onSuccess={ (data) =>
							{
								if (data.mode.value === "create")
								{
									Cubits.paymentMethods.add(data);
									closeDialog();
								}
								else if (data.mode.value === "update")
								{
									Cubits.paymentMethods.update(data);
								}
							} }
						/>
					);
				} }
			/>

			<CrudPage.DeleteDialog
				entityNameSelector={ (PaymentMethod) => PaymentMethod.name }
				service={ Services.paymentMethodsApi }
				onSuccess={ (entity) => Cubits.paymentMethods.delete(entity) }
			/>
		</CrudPage>
	);
}

function Cards()
{
	useSignals();
	const {t} = useTranslation("accounting");

	return (
		<CrudPage.Cards
			cards={ [{
				title: t("paymentMethods.totalMethods"),
				data: Cubits.paymentMethods.count.value.toString(),
				icon: <CreditCardIcon className="h-4 w-4 text-muted-foreground"/>
			}] }
		/>
	);
}

function PageTable()
{
	useSignals();
	const {t} = useTranslation("accounting");
	if (Cubits.paymentMethods.state.value instanceof PageLoading)
	{
		return <TablePreview.Loading/>;
	}

	if (Cubits.paymentMethods.state.value instanceof PageLoaded)
	{
		return (
			<CrudPage.Table>
				<CrudPage.TableBody<PaymentMethod, PaymentMethodDto>
					data={ Cubits.paymentMethods.entities.value }
					headerRows={ [
						{rowBody: "", rowStyles: "text-left w-12.5"},
						{rowBody: t("paymentMethods.methodId"), rowStyles: "w-20"},
						{rowBody: t("paymentMethods.name"), rowStyles: "w-40"},
						{rowBody: t("paymentMethods.account"), rowStyles: "w-40"},
						{rowBody: t("paymentMethods.commissionType"), rowStyles: "w-30"},
						{rowBody: t("paymentMethods.commissionValue"), rowStyles: "w-30"}
					] }
					tableRowMapper={ (
						paymentMethod
					) => [{rowBody: `#${ paymentMethod.id.value }`, rowStyles: ""}, {
						rowBody: paymentMethod.name.value,
						rowStyles: "font-semibold"
					}, {
						rowBody: paymentMethod.accountName.value || paymentMethod.accountId.value.toString(),
						rowStyles: ""
					}, {
						rowBody: paymentMethod.commissionType.value === CommissionTypeOld.Percent
							? t("paymentMethods.percentage")
							: t("paymentMethods.fixedAmount"),
						rowStyles: "text-sm text-muted-foreground"
					}, {
						rowBody: paymentMethod.commissionAmount.value.toString(),
						rowStyles: "font-medium text-blue-600"
					}] }
					hasUpdatePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.PaymentMethods,
						SystemPermissionsActions.Update
					) }
					hasDeletePermission={ Services.auth.hasAuth(
						SystemPermissionsResources.PaymentMethods,
						SystemPermissionsActions.Delete
					) }
				/>

				<CrudPage.TablePagination
					pageSize={ Cubits.paymentMethods.pageSize.value }
					totalNumber={ Cubits.paymentMethods.count.value }
					currentPage={ Cubits.paymentMethods.currentPage.value }
					onPageChanged={ (newPage) =>
					{
						Cubits.paymentMethods.changePage(newPage);
					} }
				/>
			</CrudPage.Table>
		);
	}

	if (Cubits.paymentMethods.state.value instanceof PageError)
	{
		return <TablePreview.Error/>;
	}

	return <TablePreview.Empty/>;
}
