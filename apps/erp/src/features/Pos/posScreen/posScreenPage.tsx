import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSignals } from "@preact/signals-react/runtime";
import { signal } from "@preact/signals-react";
import { ArrowRight, Loader2, LogOut, ShoppingCart } from "lucide-react";
import { Button } from "yusr-ui";
import { Services } from "@/core/services/services";
import { PosSessionDto } from "@/core/data/posSession";
import CloseSessionDialog from "../posSession/closeSessionDialog";
import { APP_NAME } from "../../../../appConfig";


export default function PosScreenPage()
{
	useSignals();
	const navigate = useNavigate();

	const isLoading = useMemo(() => signal(true), []);
	const activeSession = useMemo(() => signal<PosSessionDto | null>(null), []);
	const isCloseDialogOpen = useMemo(() => signal(false), []);

	useEffect(() =>
	{
		document.title = `نقطة البيع | ${ APP_NAME }`;

		const fetchSession = async () =>
		{
			const terminalIdStr = localStorage.getItem("pos_terminal_id");
			if (!terminalIdStr)
			{
				navigate("/pos", {replace: true});
				return;
			}

			try
			{
				const res = await Services.posSessionsApi.GetActiveSession(Number(terminalIdStr));
				if (res.data)
				{
					activeSession.value = res.data;
				}
				else
				{
					navigate("/pos", {replace: true});
				}
			}
			catch
			{
				navigate("/pos", {replace: true});
			}
			finally
			{
				isLoading.value = false;
			}
		};

		fetchSession();
	}, [navigate]);

	if (isLoading.value)
	{
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<Loader2 className="w-10 h-10 animate-spin text-primary"/>
			</div>
		);
	}

	if (!activeSession.value) return null;

	return (
		<div className="min-h-screen flex flex-col bg-muted/10" dir="rtl">
			<header
				className="h-16 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm shrink-0">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" onClick={ () => navigate("/dashboard") }>
						<ArrowRight className="w-5 h-5"/>
					</Button>
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
							<ShoppingCart className="w-4 h-4"/>
						</div>
						<div className="flex flex-col">
							<span
								className="font-bold text-sm leading-none">{ activeSession.value.posTerminalName }</span>
							<span
								className="text-xs text-muted-foreground mt-1">{ activeSession.value.cashierUsername }</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button
						variant="destructive"
						className="gap-2"
						onClick={ () => isCloseDialogOpen.value = true }
					>
						<LogOut className="w-4 h-4"/>
						إغلاق الوردية
					</Button>
				</div>
			</header>

			<main className="flex-1 flex items-center justify-center p-6">
				<div className="text-center space-y-4 max-w-md">
					<div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
						<ShoppingCart className="w-10 h-10 text-muted-foreground"/>
					</div>
					<h2 className="text-2xl font-bold">شاشة المبيعات قيد التطوير</h2>
					<p className="text-muted-foreground">
						هنا ستكون واجهة نقطة البيع الرئيسية (اختيار المنتجات، الباركود، الدفع، وطباعة الفاتورة).
					</p>
				</div>
			</main>

			<CloseSessionDialog
				open={ isCloseDialogOpen.value }
				onOpenChange={ (open) => isCloseDialogOpen.value = open }
				session={ activeSession.value }
				onSuccess={ () =>
				{
					localStorage.removeItem("pos_terminal_id");
					navigate("/dashboard", {replace: true});
				} }
			/>
		</div>
	);
}