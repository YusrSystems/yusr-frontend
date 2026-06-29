import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "../../utils/cn";


interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root>
{
	indicatorClassName?: string;
}

function Progress({
	className,
	indicatorClassName,
	value,
	...props
}: ProgressProps)
{
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={ cn(
				"relative flex h-1 w-full items-center overflow-hidden rounded-full bg-muted",
				className
			) }
			{ ...props }
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={ cn(
					"h-full flex-1 transition-all bg-primary",
					indicatorClassName
				) }
				style={ {transform: `translateX(-${ 100 - (value ?? 0) }%)`} }
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };