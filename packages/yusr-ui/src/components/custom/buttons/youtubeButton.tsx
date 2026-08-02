import { signal } from "@preact/signals-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../../pure";
import { useMemo } from "react";
import { useSignals } from "@preact/signals-react/runtime";


interface YoutubeButtonProps
{
	title?: string;
	videoId?: string;
}

export function YoutubeButton({title = "شاهد الشرح عبر اليوتيوب", videoId = "VHwJkTexv3o"}: YoutubeButtonProps)
{
	useSignals();
	const isYoutubeDialogOpen = useMemo(() => signal(false), []);
	return (
		<Dialog
			open={ isYoutubeDialogOpen.value }
			onOpenChange={ (open) => (isYoutubeDialogOpen.value = open) }
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className=" hover:bg-red-100 py-2 ps-0 sm:ps-3"
					aria-label="Open YouTube Video"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="fill-red-600 size-7" viewBox="0 0 16 16">
						<path
							d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
					</svg>
					<h3 className="font-bold text-sm sm:text-base">{ title }</h3>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-[1000px] p-0 bg-black border-none overflow-hidden">

				<DialogTitle></DialogTitle>
				<DialogDescription></DialogDescription>

				<div className="aspect-video w-full">
					<iframe
						width="100%"
						height="100%"
						src={ `https://www.youtube.com/embed/${ videoId }?autoplay=1` }
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					></iframe>
				</div>
			</DialogContent>
		</Dialog>
	);
}