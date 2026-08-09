import { SystemPermissionsResources } from "@/core/auth/systemPermissionsResources";
import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import {
	BranchesSearchableSelect,
	ChangeableEntityMode,
	ChangeDialog,
	type CommonChangeDialogProps,
	FieldGroup,
	FieldsSection,
	FormField,
	SystemPermissionsActions,
	TextField
} from "yusr-ui";
import { PosTerminal, type PosTerminalDto } from "@/core/data/posTerminal.ts";
import { useEffect, useMemo } from "react";
import { type Signal, signal } from "@preact/signals-react";
import { Cubits } from "@/core/services/cubits.ts";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { PartnersSearchableSelect } from "@/core/components/searchableSelect/partnersSearchableSelect.tsx";
import PaymentMethodsMultiSearchableSelect
	from "@/core/components/searchableSelect/paymentMethodsMultiSearchableSelect.tsx";
import UsersMultiSearchableSelect from "@/core/components/searchableSelect/usersMultiSearchableSelect.tsx";
import { EInvoicingEnvironmentType } from "@/core/data/setting.ts";
import { PartnerType } from "@/core/data/partner.ts";
import { MonitorSmartphone, Zap } from "lucide-react";
import { EInvoicingRegisterButton } from "@/features/setting/eInvoicing/eInvoicingRegisterButton.tsx";


export default function ChangePosTerminalDialog({dto, service, onSuccess}: CommonChangeDialogProps<PosTerminalDto>)
{
	useSignals();

	const entity = useMemo(() => signal<PosTerminal>(dto ? PosTerminal.load(dto) : PosTerminal.create()), []);

	const paymentMethodIds = useMemo(() => signal<number[]>(entity.value.allowedPaymentMethods.value.map(x => x.id)), []);
	const paymentMethodLabels = useMemo(() => signal<Record<number, string>>(
		Object.fromEntries(entity.value.allowedPaymentMethods.value.map(x => [x.id, x.name]))
	), []);

	const userIds = useMemo(() => signal<number[]>(entity.value.posTerminalUsers.value.map(x => x.userId)), []);
	const userLabels = useMemo(() => signal<Record<number, string>>(
		Object.fromEntries(entity.value.posTerminalUsers.value.map(x => [x.userId, x.username]))
	), []);

	useEffect(() =>
	{
		Cubits.stores.init();
		Cubits.partners.init([PartnerType.Customer]);
		Cubits.paymentMethods.init();
		Cubits.users.init();
	}, []);

	// Track changes for multi-selects to enable the save button
	useEffect(() =>
	{
		const pmChanged = paymentMethodIds.value.join(",") !== entity.value.allowedPaymentMethods.peek().map(x => x.id).join(",");
		const usersChanged = userIds.value.join(",") !== entity.value.posTerminalUsers.peek().map(x => x.userId).join(",");

		if (pmChanged || usersChanged)
		{
			entity.value.hasChanges.value = true;
		}
	}, [paymentMethodIds.value, userIds.value, entity.value.hasChanges]);

	if (
		(entity.value.mode.value === ChangeableEntityMode.Create && !Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Add)) ||
		(entity.value.mode.value === ChangeableEntityMode.Update && !Services.auth.hasAuth(SystemPermissionsResources.PosTerminals, SystemPermissionsActions.Update))
	)
	{
		return <ChangeDialog.Unauthorized/>;
	}

	const title = entity.value.mode.value === ChangeableEntityMode.Create ? "إضافة نقطة بيع جديدة" : "تعديل نقطة البيع";

	const transformData = (data: PosTerminalDto) =>
	{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data.allowedPaymentMethods = paymentMethodIds.value.map(id => ({
			id,
			name: paymentMethodLabels.value[id]
		} as any));
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data.posTerminalUsers = userIds.value.map(id => ({userId: id, username: userLabels.value[id]} as any));
		return data;
	};

	const basicHasError = Boolean(
		entity.value.getError("name").value ||
		entity.value.getError("branchId").value ||
		entity.value.getError("storeId").value
	);

	return (
		<ChangeDialog className="sm:max-w-3xl">
			<ChangeDialog.Header title={ title }/>

			<ChangeDialog.Tabbed
				className="h-auto min-h-[50vh]"
				tabs={ [
					{
						label: "البيانات الأساسية",
						icon: MonitorSmartphone,
						active: true,
						hasError: basicHasError,
						content: <GeneralTab
							entity={ entity.value }
							paymentMethodIds={ paymentMethodIds }
							paymentMethodLabels={ paymentMethodLabels }
							userIds={ userIds }
							userLabels={ userLabels }
						/>
					},
					...(entity.value.mode.value === ChangeableEntityMode.Update ? [{
						label: "الفوترة الإلكترونية",
						icon: Zap,
						active: false,
						content: <EInvoiceTab entity={ entity.value }/>
					}] : [])
				] }
			/>

			<ChangeDialog.Footer>
				<ChangeDialog.Close/>
				<ChangeDialog.SaveButton
					entity={ entity }
					service={ service }
					transformData={ transformData }
					onSuccess={ (data) => onSuccess?.(data, entity.value.mode.value) }
				/>
			</ChangeDialog.Footer>
		</ChangeDialog>
	);
}

function GeneralTab({
	entity,
	paymentMethodIds,
	paymentMethodLabels,
	userIds,
	userLabels
}: {
	entity: PosTerminal;
	paymentMethodIds: Signal<number[]>;
	paymentMethodLabels: Signal<Record<number, string>>;
	userIds: Signal<number[]>;
	userLabels: Signal<Record<number, string>>;
})
{
	useSignals();
	return (
		<div className="max-h-[55vh] overflow-y-auto px-1 py-1 space-y-4 animate-in fade-in">
			<FieldGroup>
				<FieldsSection columns={ 2 }>
					<TextField
						label="اسم نقطة البيع"
						required
						value={ entity.name }
						error={ entity.getError("name") }
					/>
					<FormField label="الفرع" required error={ entity.getError("branchId") }>
						<BranchesSearchableSelect
							id={ entity.branchId }
							label={ entity.branchName }
						/>
					</FormField>
					<FormField label="المستودع" required error={ entity.getError("storeId") }>
						<StoresSearchableSelect
							id={ entity.storeId }
							label={ entity.storeName }
						/>
					</FormField>
					<FormField label="العميل الافتراضي">
						<PartnersSearchableSelect
							id={ entity.defaultPartnerId }
							label={ entity.defaultPartnerName }
							types={ [PartnerType.Customer] }
						/>
					</FormField>
				</FieldsSection>

				<FieldsSection title="الصلاحيات وطرق الدفع" columns={ 2 }>
					<FormField label="طرق الدفع المسموحة">
						<PaymentMethodsMultiSearchableSelect ids={ paymentMethodIds } labels={ paymentMethodLabels }/>
					</FormField>
					<FormField label="المستخدمون المصرح لهم">
						<UsersMultiSearchableSelect ids={ userIds } labels={ userLabels }/>
					</FormField>
				</FieldsSection>
			</FieldGroup>
		</div>
	);
}

function EInvoiceTab({entity}: { entity: PosTerminal })
{
	useSignals();
	return (
		<div className="max-h-[55vh] overflow-y-auto px-1 py-1 space-y-4 animate-in fade-in">
			<EInvoicingRegisterButton
				formData={ entity }
				title="بيئة التجربة (Testing)"
				subtitle="sandbox"
				linkType={ EInvoicingEnvironmentType.Test }
			/>
			<EInvoicingRegisterButton
				formData={ entity }
				title="بيئة المحاكاة (Simulation)"
				subtitle="تجربة الربط مع الهيئة"
				linkType={ EInvoicingEnvironmentType.Simulation }
			/>
			<EInvoicingRegisterButton
				formData={ entity }
				title="البيئة الفعلية (Production)"
				subtitle="الربط مع الهيئة وإرسال المستندات بشكل رسمي"
				linkType={ EInvoicingEnvironmentType.Production }
			/>
		</div>
	);
}