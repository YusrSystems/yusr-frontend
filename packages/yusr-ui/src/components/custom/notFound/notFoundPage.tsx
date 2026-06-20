import { ArrowRight, FileQuestion, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../pure/button";


export function NotFoundPage()
{
	const {t} = useTranslation("common");
	const navigate = useNavigate();

	return (
		<div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
			{/* Background Visual Hint */ }
			<div className="absolute -z-10 select-none">
				<h1 className="text-[20rem]! font-bold opacity-[0.1]">404</h1>
			</div>

			{/* Main Content */ }
			<div
				className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
				<FileQuestion className="h-12 w-12"/>
			</div>

			<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{ t("notFound.title") }</h1>

			<p className="mt-6 max-w-md text-lg text-muted-foreground leading-relaxed">
				{ t("notFound.description") }
			</p>

			{/* Actions */ }
			<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
				<Button asChild size="lg" className="h-12 rounded-full px-8 shadow-lg shadow-primary/20">
					<Link to="/">
						<Home className="ml-2 h-4 w-4"/>
						{ t("notFound.goHome") }
					</Link>
				</Button>

				<Button variant="ghost" size="lg" className="h-12 rounded-full px-8" onClick={ () => navigate(-1) }>
					<ArrowRight className="ml-2 h-4 w-4"/>
					{ t("notFound.goBack") }
				</Button>
			</div>
		</div>
	);
}