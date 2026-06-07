import { Services } from "@/core/services/services";
import { Outlet } from "react-router-dom";
import { Button, i18n, SidebarInset, SidebarProvider, SidebarTrigger } from "yusr-ui";
import { SideBar } from "../features/sideBar/sideBar";
const AppLayout = () =>
{
  return (
    <div>
      { !Services.auth.isVerifiedAccount && <CompleteAccountVerificationFixedItem /> }
      <SidebarProvider>
        <SideBar variant="inset" />
        <SidebarInset>
          <SidebarTrigger className="m-3" />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
function CompleteAccountVerificationFixedItem()
{
  return (
    <Button className="bg-blue-500 text-white p-5 fixed z-50 bottom-10 inset-e-10">
      { i18n.t("common:accountVerification.completeButton") }
    </Button>
  );
}
export default AppLayout;
