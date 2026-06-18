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
		<div>
			{ (Services.auth.stepsToComplete > 0) && <CompleteAccountVerificationFixedItem/> }
			<SidebarProvider>
				<SideBar variant="inset"/>
				<SidebarInset>
					<SidebarTrigger className="m-3"/>
					<div className="flex flex-1 flex-col">
						<div className="@container/main flex flex-1 flex-col gap-2">
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
			className="bg-blue-500 text-white p-5 fixed z-50 bottom-10 inset-e-10"
			onClick={ () =>
			{
				AppNavigator.navigate(nextRoute, true);
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
