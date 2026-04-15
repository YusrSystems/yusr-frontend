import { SystemPermissionsActions } from "@/app/core/auth/systemPermissionsActions";
import { SystemPermissionsResources } from "@/app/core/auth/systemPermissionsResources";
import { Database, FileBarChart, LayoutDashboard, Pencil, Plus, Trash2 } from "lucide-react";

export const ArabicLabels: Record<string, string> = {
  [SystemPermissionsResources.Branches]: "الفروع",
  [SystemPermissionsResources.Passengers]: "المسافرين",
  [SystemPermissionsResources.Routes]: "الخطوط",
  [SystemPermissionsResources.Settings]: "الإعدادات",
  [SystemPermissionsResources.Trips]: "الرحلات",
  [SystemPermissionsResources.Users]: "المستخدمين",
  [SystemPermissionsResources.Roles]: "الأدوار",
  [SystemPermissionsResources.Dashboard]: "لوحة التحكم",
  [SystemPermissionsResources.TripUnblock]: "التعديل على الرحلات بعد 24 ساعة من انطلاقها",
  [SystemPermissionsResources.TicketReport]: "تقارير التذاكر",
  [SystemPermissionsResources.DepositReport]: "تقارير الأمانات",
  [SystemPermissionsResources.TripTicketsReport]: "تقارير تذاكر الرحلة",
  [SystemPermissionsResources.TripDepositsReport]: "تقارير إيداعات الرحلة",
  [SystemPermissionsActions.Add]: "إضافة",
  [SystemPermissionsActions.Update]: "تعديل",
  [SystemPermissionsActions.Delete]: "حذف"
};

export const ActionIcons: Record<string, React.ReactNode> = {
  [SystemPermissionsActions.Add]: <Plus className="w-4 h-4 text-blue-500" />,
  [SystemPermissionsActions.Update]: <Pencil className="w-4 h-4 text-orange-500" />,
  [SystemPermissionsActions.Delete]: <Trash2 className="w-4 h-4 text-red-500" />
};

export const PERMISSION_SECTIONS = [{
  id: "tables",
  title: "بيانات النظام الأساسية",
  icon: <Database className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.Trips,
    SystemPermissionsResources.Passengers,
    SystemPermissionsResources.Routes,
    SystemPermissionsResources.Branches,
    SystemPermissionsResources.Roles,
    SystemPermissionsResources.Users
  ]
}, {
  id: "system",
  title: "الإعدادات والتحكم",
  icon: <LayoutDashboard className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.Settings,
    SystemPermissionsResources.Dashboard,
    SystemPermissionsResources.TripUnblock
  ]
}, {
  id: "reports",
  title: "تقارير النظام",
  icon: <FileBarChart className="w-5 h-5" />,
  resources: [
    SystemPermissionsResources.TicketReport,
    SystemPermissionsResources.DepositReport,
    SystemPermissionsResources.TripTicketsReport,
    SystemPermissionsResources.TripDepositsReport
  ]
}];
