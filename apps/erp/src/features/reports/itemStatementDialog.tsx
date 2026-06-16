import type Item from "@/core/data/item";
import { useSignals } from "@preact/signals-react/runtime";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField
} from "yusr-ui";
import ReportConstants from "../../core/data/report/reportConstants";
import ReportButton from "./reportButton";
import { signal } from "@preact/signals-react";
import StoresSearchableSelect from "@/core/components/searchableSelect/storesSearchableSelect.tsx";
import { ItemStatementReportRequest } from "@/core/data/report/itemStatementReportRequest.ts";


export default function ItemStatementButton({item}: { item: Item; })
{
	useSignals();
	const {t, i18n} = useTranslation("erpCommon");

	const isOpen = useMemo(() => signal(false), []);
	const storeId = useMemo(() => signal<number>(), []);
	const storeName = useMemo(() => signal<string>(), []);

	return (
		<>
			<Button variant="outline" size="sm" onClick={ () => isOpen.value = true }>
				{ t("itemStatement.button") }
			</Button>

			<Dialog open={ isOpen.value } onOpenChange={ (open) => isOpen.value = open }>
				<DialogContent dir={ i18n.dir() } className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>{ t("itemStatement.title") }</DialogTitle>
						<DialogDescription>{ item.name.value }</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col gap-4 py-2">
						<FormField label={ t("itemStatement.store") }>
							<StoresSearchableSelect
								id={ storeId }
								label={ storeName }
							/>
						</FormField>
					</div>
					<DialogFooter>
						<ReportButton
							reportName={ ReportConstants.ItemStatement }
							request={ new ItemStatementReportRequest({
								itemId: item.id.value,
								storeId: storeId.value
							}) }
						/>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
