import { useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { CalendarOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "yusr-ui";
import { VoucherDto } from "@/core/data/voucher.ts";
import { Services } from "@/core/services/services.ts";
import { Cubits } from "@/core/services/cubits.ts";


export interface TerminateVoucherDistributionDialogProps
{
	open: boolean;
	onOpenChange: (open: boolean) => void;
	voucher: VoucherDto;
	onSuccess?: (updatedVoucher: VoucherDto) => void;
}

export default function TerminateVoucherDistributionDialog({
	open,
	onOpenChange,
	voucher,
	onSuccess
}: TerminateVoucherDistributionDialogProps)
{
	useSignals();
	const {i18n} = useTranslation();
	const isTerminating = useMemo(() => signal(false), []);

	const handleTerminate = async () =>
	{
		if (isTerminating.value) return;
		isTerminating.value = true;
		try
		{
			const res = await Services.voucherApi.TerminateDistribution(voucher.id, voucher.rowVer);
			if (res.status === 200 && res.data)
			{
				toast.success(`تم إنهاء التوزيع الدوري للسند رقم #${ voucher.id } بنجاح`);
				Cubits.vouchers.update(res.data);
				onSuccess?.(res.data);
				onOpenChange(false);
			}
		}
		finally
		{
			isTerminating.value = false;
		}
	};

	return (
		<Dialog open={ open } onOpenChange={ onOpenChange }>
			<DialogContent dir={ i18n.dir() } className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-destructive">
						<CalendarOff className="w-5 h-5"/>
						إنهاء التوزيع الدوري للسند #{ voucher.id }
					</DialogTitle>
					<DialogDescription className="pt-2 text-start leading-relaxed">
						هل أنت متأكد من إنهاء التوزيع الدوري لهذا السند؟ سيتم إيقاف جدول التوزيع التلقائي للاعتراف
						بالفترات المتبقية.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline" disabled={ isTerminating.value }>
							إلغاء
						</Button>
					</DialogClose>
					<Button
						variant="destructive"
						disabled={ isTerminating.value }
						onClick={ handleTerminate }
					>
						{ isTerminating.value && <Loader2 className="ml-2 h-4 w-4 animate-spin"/> }
						تأكيد الإنهاء
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}