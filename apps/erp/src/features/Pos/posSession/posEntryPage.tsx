import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { AlertCircle, ArrowRight, Loader2, Play, Store } from "lucide-react";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	NumberField,
	PageError,
	PageLoaded,
	SelectField,
	TextAreaField,
	YusrBackground
} from "yusr-ui";
import { Services } from "@/core/services/services";
import { Cubits } from "@/core/services/cubits";
import { PosSessionDto } from "@/core/data/posSession";
import ErpCurrencyIcon from "@/core/components/erpCurrencyIcon";
import CloseSessionDialog from "./closeSessionDialog";
import { APP_NAME } from "../../../../appConfig";
import { PosTempCache } from "../posTempCache";
import type { PosTerminalDto } from "@/core/data/posTerminal.ts";


export default function PosEntryPage()
{
	useSignals();
	const navigate = useNavigate();

	const isLoading = useMemo(() => signal(true), []);
	const isCheckingSession = useMemo(() => signal(false), []);
	const isStarting = useMemo(() => signal(false), []);
	const activeSession = useMemo(() => signal<PosSessionDto | null>(null), []);
	const isCloseDialogOpen = useMemo(() => signal(false), []);

	const selectedTerminalId = useMemo(() => signal<number | undefined>(undefined), []);
	const openingCash = useMemo(() => signal<number>(0), []);
	const openingNotes = useMemo(() => signal<string>(""), []);

	useEffect(() =>
	{
		document.title = `نقطة البيع | ${ APP_NAME }`;
		Cubits.posTerminals.init();
	}, []);

	useEffect(() =>
	{
		const posState = Cubits.posTerminals.state.value;

		if (posState instanceof PageLoaded)
		{
			const terminals = Cubits.posTerminals.entities.value;

			if (terminals.length === 1 && !selectedTerminalId.value)
			{
				const targetId = terminals[0]?.id;
				if (targetId)
				{
					PosTempCache.setTerminal(terminals[0] as PosTerminalDto);
					selectedTerminalId.value = targetId;
					void checkActiveSession(targetId);
				}
			}
			isLoading.value = false;
		}
		else if (posState instanceof PageError)
		{
			isLoading.value = false;
		}
	}, [Cubits.posTerminals.state.value]);

	const checkActiveSession = async (terminalId: number) =>
	{
		isCheckingSession.value = true;
		try
		{
			const terminal = Cubits.posTerminals.entities.value.find(t => t.id === terminalId);
			if (terminal)
			{
				PosTempCache.setTerminal(terminal);
			}

			const res = await Services.posSessionsApi.GetActiveSession(terminalId);
			if (res && res.data)
			{
				const session = res.data;
				PosTempCache.setSession(terminalId, session);

				const openedDate = new Date(session.openedAt).toDateString();
				const today = new Date().toDateString();

				if (openedDate === today)
				{
					navigate(`/pos/screen/${ terminalId }`, {replace: true});
				}
				else
				{
					activeSession.value = session;
					isCloseDialogOpen.value = true;
				}
			}
			else
			{
				PosTempCache.setSession(terminalId, null);
				activeSession.value = null;
				isCloseDialogOpen.value = false;
			}
		}
		catch (error)
		{
			console.error("Failed to check active session:", error);
			PosTempCache.setSession(terminalId, null);
			activeSession.value = null;
			isCloseDialogOpen.value = false;
		}
		finally
		{
			isCheckingSession.value = false;
		}
	};

	const handleOpenSession = async () =>
	{
		if (!selectedTerminalId.value) return;

		isStarting.value = true;
		try
		{
			const res = await Services.posSessionsApi.OpenSession({
				posTerminalId: selectedTerminalId.value,
				openingCash: openingCash.value,
				openingNotes: openingNotes.value
			});

			if (res.status === 200 && res.data)
			{
				PosTempCache.setSession(selectedTerminalId.value, res.data);
				const terminal = Cubits.posTerminals.entities.value.find(t => t.id === selectedTerminalId.value);
				if (terminal)
				{
					PosTempCache.setTerminal(terminal);
				}

				navigate(`/pos/screen/${ selectedTerminalId.value }`, {replace: true});
			}
		}
		catch (error)
		{
			console.error("Failed to open POS session:", error);
		}
		finally
		{
			isStarting.value = false;
		}
	};

	const handleTerminalChange = async (val: number | undefined) =>
	{
		selectedTerminalId.value = val;
		if (val)
		{
			await checkActiveSession(val);
		}
		else
		{
			activeSession.value = null;
			isCloseDialogOpen.value = false;
		}
	};

	if (isLoading.value)
	{
		return (
			<div className="h-screen w-full flex items-center justify-center bg-muted/20 overflow-hidden">
				<Loader2 className="w-10 h-10 animate-spin text-primary"/>
			</div>
		);
	}

	return (
		<div className="h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
			<YusrBackground/>

			<div className="w-full max-w-md relative z-10 my-auto">
				{ activeSession.value ? (
					<Card className="border-red-200 shadow-lg shadow-red-500/10 max-h-[85vh] overflow-y-auto">
						<CardHeader className="text-center pb-2">
							<div
								className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
								<AlertCircle className="w-8 h-8"/>
							</div>
							<CardTitle className="text-red-600 text-xl">
								لديك وردية مفتوحة من يوم سابق
							</CardTitle>
							<CardDescription className="text-base mt-2">
								يجب إغلاق الوردية السابقة قبل التمكن من بدء يوم عمل جديد.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4 pt-4">
							<div className="bg-muted/50 rounded-lg p-4 flex flex-col gap-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">الجهاز:</span>
									<span className="font-semibold">{ activeSession.value.posTerminalName }</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">تاريخ الافتتاح:</span>
									<span className="font-semibold"
									      dir="ltr">{ new Date(activeSession.value.openedAt).toLocaleString() }</span>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									size="lg"
									variant="outline"
									className="w-full text-md h-12"
									onClick={ () =>
									{
										selectedTerminalId.value = undefined;
										activeSession.value = null;
										isCloseDialogOpen.value = false;
									} }
								>
									تغيير الجهاز
								</Button>
								<Button
									size="lg"
									variant="destructive"
									className="w-full text-md h-12"
									onClick={ () => isCloseDialogOpen.value = true }
								>
									إغلاق الوردية
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className="shadow-xl border-primary/10 max-h-[85vh] overflow-y-auto">
						<CardHeader className="text-center pb-6 relative">
							<Button
								variant="ghost"
								size="icon"
								className="absolute top-4 right-4"
								onClick={ () => navigate("/dashboard") }
							>
								<ArrowRight className="w-5 h-5"/>
							</Button>
							<div
								className="mx-auto w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
								<Store className="w-8 h-8"/>
							</div>
							<CardTitle className="text-2xl">فتح وردية جديدة</CardTitle>
							<CardDescription>
								الرجاء تحديد الجهاز وإدخال مبلغ العهدة للبدء
							</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-5">
							<SelectField<number>
								label="جهاز نقطة البيع"
								required
								value={ selectedTerminalId }
								options={ Cubits.posTerminals.entities.value.map(t => ({
									label: `${ t.name } (${ t.storeName })`,
									value: t.id
								})) }
								placeholder="اختر الجهاز..."
								onValueChange={ handleTerminalChange }
							/>

							{ isCheckingSession.value ? (
								<div className="flex justify-center py-6">
									<Loader2 className="w-8 h-8 animate-spin text-primary"/>
								</div>
							) : selectedTerminalId.value && !activeSession.value ? (
								<div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2">
									<NumberField
										label="مبلغ العهدة الافتتاحي (الكاش)"
										required
										min={ 0 }
										value={ openingCash }
										currency={ <ErpCurrencyIcon/> }
										className="text-lg"
									/>

									<TextAreaField
										label="ملاحظات الافتتاح (اختياري)"
										value={ openingNotes }
										rows={ 2 }
									/>

									<Button
										size="lg"
										className="w-full mt-2 h-12 text-md"
										disabled={ openingCash.value === undefined || isStarting.value }
										onClick={ handleOpenSession }
									>
										{ isStarting.value ? <Loader2 className="w-5 h-5 animate-spin"/> :
											<Play className="w-5 h-5 me-2"/> }
										بدء الوردية
									</Button>
								</div>
							) : null }
						</CardContent>
					</Card>
				) }
			</div>

			{ activeSession.value && (
				<CloseSessionDialog
					open={ isCloseDialogOpen.value }
					onOpenChange={ (open) => isCloseDialogOpen.value = open }
					session={ activeSession.value }
					onSuccess={ async () =>
					{
						const targetTerminalId = selectedTerminalId.value;
						activeSession.value = null;
						isCloseDialogOpen.value = false;
						if (targetTerminalId)
						{
							await checkActiveSession(targetTerminalId);
						}
					} }
				/>
			) }
		</div>
	);
}