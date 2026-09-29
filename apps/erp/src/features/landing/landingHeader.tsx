import logoDark from "@/assets/yusrLogoOnly_Dark.png";
import logoLight from "@/assets/yusrLogoOnly_Light.png";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, LanguageToggle, ThemeToggle } from "yusr-ui";


export default function LandingHeader()
{
	const {t} = useTranslation("common");
	return (
		<header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-lg">
			<div
				className="mx-auto flex ltr:flex-row-reverse max-w-6xl items-center justify-between px-3 sm:px-6 py-2.5 sm:py-4">
				<div className="flex items-center w-8 sm:w-10 shrink-0">
					<img
						src={ logoLight }
						alt="YusrLogo"
						className="block dark:hidden h-auto w-full object-contain"
					/>
					<img
						src={ logoDark }
						alt="YusrLogo"
						className="hidden dark:block h-auto w-full object-contain"
					/>
				</div>
				<div className="flex ltr:flex-row-reverse items-center gap-1.5 sm:gap-3">
					<ThemeToggle/>
					<LanguageToggle/>
					<Link to="/login">
						<Button size="sm" variant="outline" className="sm:h-9 sm:px-4 sm:text-sm">
							{ t("login") }
						</Button>
					</Link>
					<Link to="/register">
						<Button size="sm" variant="default" className="sm:h-9 sm:px-4 sm:text-sm font-semibold">
							<span className="sm:hidden">{ t("registerMobile", "ابدأ الآن") }</span>
							<span className="hidden sm:inline">{ t("register") }</span>
						</Button>
					</Link>
				</div>
			</div>
		</header>
	);
}