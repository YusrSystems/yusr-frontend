import { ReportContainer } from "@/features/report/reportContainer.tsx";
import ReportHeader from "@/features/report/reportHeader.tsx";
import { ReportField } from "@/features/report/components/reportField.tsx";
import { ReportPageContainer } from "@/features/report/reportPageContainer.tsx";
import { ReportPageBody } from "@/features/report/reportPageBody.tsx";
import { formatNumber } from "@/features/report/utils/formating.ts";
import { type VoucherDto, VoucherType } from "@/core/data/voucher.ts";
import { NumberToWordsService } from "yusr-ui";
import { Services } from "@/core/services/services.ts";


interface VoucherReportProps
{
	voucher?: VoucherDto;
	isPortal?: boolean;
}

export function VoucherReport({voucher, isPortal = true}: VoucherReportProps)
{
	if (!voucher)
	{
		return null;
	}

	const isPayment = voucher.type === VoucherType.Payment;

	const titleAr = isPayment ? "سند صرف" : "سند قبض";
	const titleEn = isPayment ? "PAYMENT VOUCHER" : "RECEIPT VOUCHER";
	const recipientLabelAr = isPayment ? "صرفنا إلى" : "قبضنا من";
	const recipientLabelEn = isPayment ? "Paid To" : "Received from";

	return (
		<ReportContainer isPortal={ isPortal }>
			<ReportHeader>
				<ReportHeader.CompanySection/>
				<ReportHeader.TitleSection titleAr={ titleAr } titleEn={ titleEn }>
					<ReportHeader.Id id={ voucher.id }/>
				</ReportHeader.TitleSection>
				<ReportHeader.MetaDataSection/>
			</ReportHeader>

			<ReportPageContainer>
				<ReportPageBody>
					<div className="flex flex-col gap-4 mt-8 print:break-inside-avoid">

						<div className="flex w-full gap-4">
							<ReportField
								labelAr={ recipientLabelAr }
								labelEn={ recipientLabelEn }
								value={ voucher.accountName }
								valueClassName="font-bold text-base"
							/>
						</div>

						<div className="flex w-full gap-4">
							<ReportField
								labelAr="بتاريخ"
								labelEn="On date"
								value={ voucher.date }
							/>
							<ReportField
								labelAr="مبلغا وقدره"
								labelEn="An amount"
								value={ formatNumber(voucher.amount) }
								valueClassName="font-bold text-base"
							/>
						</div>

						{ Services.auth.setting?.currency.value && (
							<div className="flex w-full gap-4">
								<ReportField
									labelAr="تفقيطا"
									labelEn="Amount in words"
									value={ NumberToWordsService.ConvertAmount(voucher.amount, Services.auth.setting?.currency.value) }
									valueClassName="font-semibold"
								/>
							</div>
						) }

						<div className="flex w-full gap-4">
							<ReportField
								labelAr="باستخدام طريقة الدفع"
								labelEn="Using payment method"
								value={ voucher.paymentMethod?.name }
							/>
						</div>

						<div className="flex w-full gap-4">
							<ReportField
								labelAr="البيان"
								labelEn="Description"
								value={ voucher.description ?? "" }
								valueClassName="min-h-16 items-start p-2 text-start justify-start"
							/>
						</div>

						<div className="grid grid-cols-2 gap-20 mt-10">
							<ReportField
								labelAr="المعطي"
								labelEn="Given by"
								value={ voucher.giver ?? "" }
							/>
							<ReportField
								labelAr="المستلم"
								labelEn="Received By"
								value={ voucher.recipient ?? "" }
							/>
						</div>

						<div className="grid grid-cols-2 gap-20 mt-10">
							<ReportField
								labelAr="الختم"
								labelEn="Seal"
								value=""
								valueClassName="min-h-30"
							/>
							<ReportField
								labelAr="التوقيع"
								labelEn="Signature"
								value=""
								valueClassName="min-h-30"
							/>
						</div>

					</div>
				</ReportPageBody>
			</ReportPageContainer>
		</ReportContainer>
	);
}