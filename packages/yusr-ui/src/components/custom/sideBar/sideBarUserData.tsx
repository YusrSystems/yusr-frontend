import { Avatar, AvatarFallback, AvatarImage } from "../../pure/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../pure/sidebar";
import { User } from "../../../entities";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Badge } from "../../pure/badge";
import { Separator } from "../../pure/separator";
import { useSignals } from "@preact/signals-react/runtime";
import type { Signal } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import { useEffect, useMemo } from "react";
import { Building2, ShieldCheck, Unlink, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google";
import { ContinueWithGoogleCubit } from "../../../stateManager/continueWithGoogleCubit.ts";
import { BaseServices } from "../../../services";
import { PasswordField } from "../index.ts";
import { toast } from "sonner";


export function SideBarUserData({user}: { user: User | undefined })
{
	useSignals();
	const {i18n} = useTranslation("common");
	const isDialogOpen = useMemo(() => signal<boolean>(false), []);
	const dir = i18n.dir();
	const cubit = useMemo(() => new ContinueWithGoogleCubit(), []);
	useEffect(() =>
	{
		void cubit.init();
	}, []);

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						dir={ dir }
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
						onClick={ () => (isDialogOpen.value = true) }
					>
						<Avatar className="h-8 w-8 rounded-lg grayscale">
							<AvatarImage src="/avatars/shadcn.jpg" alt={ user?.username.value }/>
							<AvatarFallback className="rounded-lg">
								{ user?.username.value?.slice(0, 2).toUpperCase() ?? "??" }
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-start text-sm leading-tight">
							<span className="truncate font-medium">{ user?.username.value }</span>
							<span className="truncate text-xs text-muted-foreground">
                                { user?.roleName.value }
                            </span>
						</div>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>

			<UserInfoDialog user={ user } isOpen={ isDialogOpen } cubit={ cubit }/>
		</>
	);
}

function UserInfoDialog({
	user,
	isOpen,
	cubit
}: {
	user: User | undefined;
	isOpen: Signal<boolean>;
	cubit: ContinueWithGoogleCubit;
})
{
	useSignals();
	const {t, i18n} = useTranslation("common");
	const dir = i18n.dir();

	const isDisconnectDialogOpen = useMemo(() => signal<boolean>(false), []);
	const disconnectPassword = useMemo(() => signal<string>(""), []);

	return (
		<>
			<Dialog open={ isOpen.value } onOpenChange={ (open) => (isOpen.value = open) }>
				<DialogContent
					className="sm:max-w-sm transition-transform duration-200"
					dir={ dir }
				>
					<DialogHeader>
						<DialogTitle>{ t("sidebar.userInfo.title") }</DialogTitle>
						<DialogDescription>{ t("sidebar.userInfo.description") }</DialogDescription>
					</DialogHeader>

					<div className="flex items-center gap-4 py-2">
						<Avatar className="h-14 w-14 shrink-0 ">
							<AvatarImage src="/avatars/shadcn.jpg" alt={ user?.username.value }/>
							<AvatarFallback className="text-base">
								{ user?.username.value?.slice(0, 2).toUpperCase() ?? "??" }
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-1 text-start">
							<p className="font-semibold leading-none">{ user?.username.value }</p>
							<Badge
								variant={ user?.isActive.value ? "default" : "secondary" }
								className="w-fit text-xs"
							>
								{ user?.isActive.value
									? t("sidebar.userInfo.active")
									: t("sidebar.userInfo.inactive") }
							</Badge>
						</div>
					</div>

					<Separator/>

					<div className="grid gap-3 text-sm">
						<InfoRow
							icon={ <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground"/> }
							label={ t("sidebar.userInfo.role") }
							value={ user?.roleName.value }
						/>
						<InfoRow
							icon={ <Building2 className="h-4 w-4 shrink-0 text-muted-foreground"/> }
							label={ t("sidebar.userInfo.branch") }
							value={ user?.branchName.value }
						/>
						<InfoRow
							icon={ <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground"/> }
							label={ t("sidebar.userInfo.username") }
							value={ user?.username.value }
						/>

						<Separator/>

						<GoogleRow
							cubit={ cubit }
							onRequestDisconnect={ () => (isDisconnectDialogOpen.value = true) }
						/>
					</div>
				</DialogContent>
			</Dialog>

			<DisconnectGoogleDialog
				isOpen={ isDisconnectDialogOpen }
				password={ disconnectPassword }
				cubit={ cubit }
				dir={ dir }
			/>
		</>
	);
}

function InfoRow({
	icon,
	label,
	value
}: {
	icon: React.ReactNode;
	label: string;
	value: string | undefined;
})
{
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-2 text-muted-foreground">
				{ icon }
				<span>{ label }</span>
			</div>
			<span className="font-medium text-foreground">{ value ?? "—" }</span>
		</div>
	);
}

function GoogleRow({
	cubit,
	onRequestDisconnect
}: {
	cubit: ContinueWithGoogleCubit;
	onRequestDisconnect: () => void;
})
{
	useSignals();
	const {t} = useTranslation("common");
	const user = BaseServices.auth.loggedInUser;
	const metadata = user?.userMetadata?.value;
	const isConnected = Boolean(metadata?.connectedEmail.value);
	const email = metadata?.connectedEmail.value;
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="flex items-center gap-2 text-muted-foreground">
				<span> { isConnected && t("changeDialog.cancel") } { t("sidebar.userInfo.google.connect") } { t("sidebar.userInfo.google.label") }</span>

			</div>

			{ isConnected ? (
				<button
					onClick={ onRequestDisconnect }
					title={ t("sidebar.userInfo.google.disconnect") }
					className="group flex items-center gap-1.5 rounded-md px-2 py-0.5
                               text-xs font-medium text-foreground transition-colors
                               hover:bg-destructive/10 hover:text-destructive"
				>
					<span className="max-w-[130px] truncate">{ email }</span>
					<Unlink className="h-3 w-3 shrink-0 "/>
				</button>
			) : (
				<div className="flex items-center justify-center gap-1">
					<GoogleLogin onSuccess={ async (res) =>
					{
						const token = res.credential;
						if (!token)
						{
							throw new Error("Token not provided");
						}
						await cubit.Connect(token);
					} }
					             shape={ "circle" }
					             type={ "icon" }
					             auto_select={ false }
					             text={ "signup_with" }
					             size={ "large" }
					/>
				</div>
			) }
		</div>
	);
}

function DisconnectGoogleDialog({
	isOpen,
	password,
	cubit,
	dir
}: {
	isOpen: Signal<boolean>;
	password: Signal<string>;
	cubit: ContinueWithGoogleCubit;
	dir: "ltr" | "rtl";
})
{
	useSignals();
	const {t} = useTranslation(["common", "login"]);

	const close = () =>
	{
		isOpen.value = false;
		password.value = "";
	};

	const handleConfirm = async () =>
	{
		if (password.value.length < 8)
		{
			toast.error(t("login:password.minLengthError"));
			return;
		}
		await cubit.disconnect(password.value);
		close();
	};

	return (
		<Dialog open={ isOpen.value } onOpenChange={ (open) => (open ? (isOpen.value = true) : close()) }>
			<DialogContent className="sm:max-w-sm" dir={ dir }>
				<DialogHeader>
					<DialogTitle>{ t("sidebar.userInfo.google.disconnectDialog.title") }</DialogTitle>
					<DialogDescription>
						{ t("sidebar.userInfo.google.disconnectDialog.description") }
					</DialogDescription>
				</DialogHeader>

				<PasswordField
					label={ t("sidebar.userInfo.google.disconnectDialog.passwordLabel") }
					id="disconnectPassword"
					placeholder={ t("sidebar.userInfo.google.disconnectDialog.passwordPlaceholder") }
					value={ password }
					required
				/>

				<div className="flex justify-end gap-2 pt-2">
					<button
						type="button"
						onClick={ close }
						className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
					>
						{ t("sidebar.userInfo.google.disconnectDialog.cancel") }
					</button>
					<button
						type="button"
						onClick={ handleConfirm }
						className="rounded-md px-3 py-1.5 text-xs font-medium text-white bg-destructive hover:bg-destructive/90 transition-colors"
					>
						{ t("sidebar.userInfo.google.disconnectDialog.confirm") }
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}