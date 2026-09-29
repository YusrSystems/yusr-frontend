import { Services } from "@/core/services/services";
import { useSignals } from "@preact/signals-react/runtime";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { Button, SidebarInset, SidebarProvider, SidebarTrigger } from "yusr-ui";
import { SideBar } from "../features/sideBar/sideBar";
import { AppNavigator } from "./appNavigator";


const AppLayout = () =>
{
	useSignals();
	return (
		<div
			className="min-h-dvh h-dvh w-screen overflow-hidden print:h-auto print:w-auto print:overflow-visible flex flex-col">
			{ (Services.auth.stepsToComplete > 0) && <CompleteAccountVerificationFixedItem/> }
			<SidebarProvider>
				<SideBar variant="inset"/>
				<SidebarInset className="overflow-hidden print:overflow-visible flex flex-col min-h-0">
					<div className="flex items-center gap-2 p-1.5 sm:p-2 print:hidden shrink-0">
						<SidebarTrigger className="mx-2 sm:mx-3 shrink-0"/>
					</div>
					<div className="flex flex-1 flex-col min-h-0 overflow-hidden print:overflow-visible">
						<div
							className="@container/main flex flex-1 flex-col gap-2 overflow-y-auto print:overflow-visible">
							<Outlet/>
						</div>
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
};

function CompleteAccountVerificationFixedItem()
{
	useSignals();
	const {t} = useTranslation("common");
	const nextRoute = Services.auth.nextRoute;
	return (
		<Button
			className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 sm:p-5 text-xs sm:text-sm fixed z-50 bottom-3 sm:bottom-10 inset-e-3 sm:inset-e-10 shadow-xl rounded-xl sm:rounded-lg"
			onClick={ async () =>
			{
				await AppNavigator.navigate(nextRoute, true);
				if (nextRoute === "/branches")
				{
					toast.info(t("accountVerification.addCityToBranch"));
				}
				else if (nextRoute === "/settings")
				{
					toast.info(t("accountVerification.addCompanyPhone"));
				}
			} }
		>
			{ t("accountVerification.completeButton") }
		</Button>
	);
}

export default AppLayout;