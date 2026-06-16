import { i18n, Separator } from "yusr-ui";
import { Services } from "../services/services";


export default function VerifyAccountWrapper({children}: { children: React.ReactNode; })
{
	const isVerified = Services.auth.isVerifiedAccount;

	return (
		<div>
			<div
				style={ !isVerified
					? {
						pointerEvents: "none",
						filter: "blur(3px)"
					}
					: {} }
			>
				{ children }
			</div>

			{ !isVerified && (
				<div className="fixed inset-0 flex justify-center items-center">
					<div className="flex max-w-sm flex-col gap-4 text-sm bg-black p-4 rounded-2xl">
						<div className="flex flex-col gap-1.5">
							<div
								className="leading-none font-medium">{ i18n.t("common:accountVerification.title") }</div>
							<div className="text-muted-foreground">
								{ i18n.t("common:accountVerification.description") }
							</div>
						</div>
						<Separator/>
						<div>
							<div className="font-medium">
								{ i18n.t("common:accountVerification.howToVerify") }
							</div>
						</div>
						<div>
							<div className="font-medium">
								{ i18n.t("common:accountVerification.instructions") }
							</div>
						</div>
					</div>
				</div>
			) }
		</div>
	);
}
