import { Cubits } from "@/core/services/cubits";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { CreditCardIcon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
	ChangeableEntityMode,
	CrudPage,
	PageError,
	PageLoaded,
	PageLoading,
	SystemPermissionsActions,
	TablePreview,
	UnauthorizedPage
} from "yusr-ui";
import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources.ts";
import { CommissionType, type PaymentMethodDto } from "@/core/data/paymentMethod.ts";
import ChangePaymentMethodDialog from "./changePaymentMethodDialog";


export function PaymentMethodsPage()
{
	useSignals();
	const {t} = useTranslation("accounting");
	useEffect(() => Cubits.paymentMethods.init(), []);

	if (!Services.auth.hasAuth(SystemPermissionsResources.PaymentMethods, SystemPermissionsActions.Get))
	{
		return <UnauthorizedPage/>;
	}

	return (
		<CrudPage<PaymentMethodDto>>
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
							dto={ dto }
							service={ Services.paymentMethodsApi }
							onSuccess={ (data, mode) =>
							{
								if (mode === ChangeableEntityMode.Create)
								{
									Cubits.paymentMethods.add(data);
									closeDialog();
								}
								else if (mode === ChangeableEntityMode.Update)
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
				<CrudPage.TableBody<PaymentMethodDto>
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
					) => [{rowBody: `#${ paymentMethod.id }`, rowStyles: ""}, {
						rowBody: paymentMethod.name,
						rowStyles: "font-semibold"
					}, {
						rowBody: paymentMethod.accountName,
						rowStyles: ""
					}, {
						rowBody: paymentMethod.commissionType === CommissionType.Percent
							? t("paymentMethods.percentage")
							: t("paymentMethods.fixedAmount"),
						rowStyles: "text-sm text-muted-foreground"
					}, {
						rowBody: paymentMethod.commissionAmount.toString(),
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
