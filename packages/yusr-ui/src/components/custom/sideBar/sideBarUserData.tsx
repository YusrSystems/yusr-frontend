import { Avatar, AvatarFallback, AvatarImage } from "../../pure/avatar";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../../pure/sidebar";
import { User } from "../../../entities";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../pure/dialog";
import { Separator } from "../../pure/separator";
import { Skeleton } from "../../pure/skeleton";
import { Button } from "../../pure/button.tsx";
import { useSignals } from "@preact/signals-react/runtime";
import type { Signal } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import React, { useEffect, useMemo } from "react";
import { Building2, ChevronRight, Loader2, ShieldCheck, Unlink, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GoogleLogin } from "@react-oauth/google";
import { ContinueWithGoogleLoadingState } from "../../../stateManager/continueWithGoogleCubit.ts";
import { BaseCubits, BaseServices } from "../../../services";
import { PasswordField } from "../index.ts";
import { toast } from "sonner";


export function SideBarUserData()
{
	useSignals();
	const {i18n} = useTranslation("common");
	const isDialogOpen = useMemo(() => signal<boolean>(false), []);
	const dir = i18n.dir();

	useEffect(() =>
	{
		void BaseCubits.continueWithGoogle.init();
	}, []);

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						size="lg"
						dir={ dir }
						className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer group"
						onClick={ () => (isDialogOpen.value = true) }
					>
						<Avatar className="h-8 w-8 rounded-full">
							<AvatarImage
								src={ BaseCubits.continueWithGoogle.userMetadata.value.picture.value ?? "/avatars/shadcn.jpg" }
								alt={ BaseServices.auth.loggedInUser?.username.value }
								referrerPolicy="no-referrer"
							/>
							<AvatarFallback className="rounded-full bg-primary/10 text-primary font-medium">
								{ BaseServices.auth.loggedInUser?.username.value?.slice(0, 2).toUpperCase() ?? "??" }
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-start text-sm leading-tight">
							<span className="truncate font-medium">
								{ BaseServices.auth.loggedInUser?.username.value }
							</span>
							<span className="truncate text-xs text-muted-foreground">
								{ BaseServices.auth.loggedInUser?.roleName.value }
							</span>
						</div>
						<ChevronRight
							className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 ltr:rotate-0 rtl:rotate-180"
						/>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>

			<UserInfoDialog user={ BaseServices.auth.loggedInUser } isOpen={ isDialogOpen }/>
		</>
	);
}

function UserInfoDialog({
	user,
	isOpen
}: {
	user: User | undefined;
	isOpen: Signal<boolean>;
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
					className="sm:max-w-md transition-transform duration-200"
					dir={ dir }
				>
					<DialogHeader>
						<DialogTitle>{ t("sidebar.userInfo.title") }</DialogTitle>
						<DialogDescription>{ t("sidebar.userInfo.description") }</DialogDescription>
					</DialogHeader>

					<Separator/>

					<div className="flex items-center justify-center">
						<Avatar className="h-30 w-30 shrink-0 ring-4 ring-background shadow-sm mb-2">
							<AvatarImage
								src={ BaseCubits.continueWithGoogle.userMetadata.value.picture.value ?? "/avatars/shadcn.jpg" }
								alt={ user?.username.value }
								referrerPolicy="no-referrer"
							/>
							<AvatarFallback className="text-5xl bg-primary/10 text-primary font-medium">
								{ user?.username.value?.slice(0, 2).toUpperCase() ?? "??" }
							</AvatarFallback>
						</Avatar>
					</div>


					<div className="grid gap-1">
						<InfoRow
							icon={ <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground"/> }
							label={ t("sidebar.userInfo.username") }
							value={ user?.username.value }
						/>
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
					</div>

					<Separator/>

					<GoogleRow onRequestDisconnect={ () => (isDisconnectDialogOpen.value = true) }/>
				</DialogContent>
			</Dialog>

			<DisconnectGoogleDialog
				isOpen={ isDisconnectDialogOpen }
				password={ disconnectPassword }
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
		<div
			className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 -mx-2 hover:bg-muted/50 transition-colors">
			<div className="flex items-center gap-2 text-muted-foreground text-sm">
				{ icon }
				<span>{ label }</span>
			</div>
			<span className="text-sm font-medium text-foreground truncate max-w-[55%] text-end">
				{ value ?? "—" }
			</span>
		</div>
	);
}

function GoogleRow({
	onRequestDisconnect
}: {
	onRequestDisconnect: () => void;
})
{
	useSignals();
	const {t} = useTranslation("common");

	const isInitializing = BaseCubits.continueWithGoogle.userMetadata.value.picture === undefined
		&& BaseCubits.continueWithGoogle.state.value instanceof ContinueWithGoogleLoadingState;

	const connectedEmail = BaseCubits.continueWithGoogle.userMetadata.value.connectedEmail.value;
	const isConnected = Boolean(connectedEmail);

	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
			<div className="flex items-center gap-2.5">
				<GoogleGlyph className="h-5 w-5 shrink-0"/>
				<div className="grid leading-tight">
					<span className="text-sm font-medium">{ t("sidebar.userInfo.google.label") }</span>
					{ isConnected && (
						<span className="text-xs text-muted-foreground truncate max-w-[180px]">
							{ connectedEmail }
						</span>
					) }
				</div>
			</div>

			{ isInitializing ? (
				<Skeleton className="h-7 w-16 rounded-md"/>
			) : isConnected ? (
				<div className="flex items-center gap-3">
					<Button
						variant="destructive"
						size="sm"
						onClick={ onRequestDisconnect }
						title={ t("sidebar.userInfo.google.disconnect") }
						className="h-7 px-2 text-xs"
					>
						<Unlink className="h-3 w-3 sm:mr-1 shrink-0"/>
						<span className="hidden sm:inline">{ t("sidebar.userInfo.google.disconnect") }</span>
					</Button>
				</div>
			) : (
				<GoogleLogin
					shape={ "circle" }
					type={ "standard" }
					auto_select={ false }
					text={ "signup_with" }
					size={ "medium" }
					theme={ "filled_black" }
					width={ "100" }
					onSuccess={ async (res) =>
					{
						const token = res.credential;
						if (!token)
						{
							throw new Error("Token not provided");
						}
						await BaseCubits.continueWithGoogle.Connect(token);
					} }
				/>
			) }
		</div>
	);
}

function GoogleGlyph({className}: { className?: string })
{
	return (
		<svg className={ className } viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
			<path fill="#FFC107"
			      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
			<path fill="#FF3D00"
			      d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
			<path fill="#4CAF50"
			      d="M24 44c5.4 0 10.3-1.8 14-5.4l-6.5-5.4C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5C9.6 39.6 16.2 44 24 44z"/>
			<path fill="#1976D2"
			      d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.5 5.4C41.8 35.6 44 30.3 44 24c0-1.3-.1-2.7-.4-3.5z"/>
		</svg>
	);
}

function DisconnectGoogleDialog({
	isOpen,
	password,
	dir
}: {
	isOpen: Signal<boolean>;
	password: Signal<string>;
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
		await BaseCubits.continueWithGoogle.disconnect(password.value);
		close();
	};

	const isLoading = BaseCubits.continueWithGoogle.state.value instanceof ContinueWithGoogleLoadingState;

	return (
		<Dialog open={ isOpen.value } onOpenChange={ (open) => (open ? (isOpen.value = true) : close()) }>

			<DialogContent className="sm:max-w-sm" dir={ dir }>
				<DialogHeader>
					<div className="flex items-center gap-2 text-destructive">
						<Unlink className="h-4 w-4"/>
						<DialogTitle className="text-destructive">
							{ t("sidebar.userInfo.google.disconnectDialog.title") }
						</DialogTitle>
					</div>
					<DialogDescription>
						{ t("sidebar.userInfo.google.disconnectDialog.description") }
					</DialogDescription>
				</DialogHeader>

				{ isLoading ? (
					<div className="p-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
						<Loader2 className="h-6 w-6 animate-spin text-primary"/>
						<Skeleton className="h-3 w-32"/>
					</div>
				) : (
					<>
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
								disabled={ isLoading }
								className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
							>
								{ t("sidebar.userInfo.google.disconnectDialog.cancel") }
							</button>
							<button
								type="button"
								onClick={ handleConfirm }
								disabled={ isLoading }
								className="rounded-md px-3 py-1.5 text-xs font-medium text-white bg-destructive hover:bg-destructive/90 transition-colors"
							>
								{ t("sidebar.userInfo.google.disconnectDialog.confirm") }
							</button>
						</div>
					</>
				) }
			</DialogContent>

		</Dialog>
	);
}