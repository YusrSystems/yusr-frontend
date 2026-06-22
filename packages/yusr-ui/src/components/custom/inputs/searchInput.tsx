import { Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebouncedCallback } from "use-debounce";
import { InputOld } from "../../pure/input";


export type SearchInputParams = {
	onSearch: (searchText?: string) => void;
	onType?: (value: string) => void;
	className?: string;
};

export function SearchInput({onSearch, onType, className}: SearchInputParams)
{
	const {t} = useTranslation("common");
	const [searchText, setSearchText] = useState<string>("");

	const debouncedAction = useDebouncedCallback((value: string) =>
	{
		if (!value.trim())
		{
			onSearch(undefined);
		}
		else
		{
			onSearch(value);
		}
	}, 500);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const val = e.target.value;
		setSearchText(val);
		onType?.(val);

		if (!val)
		{
			debouncedAction.cancel();
			onSearch(undefined);
		}
		else
		{
			debouncedAction(val);
		}
	};

	return (
		<div
			className={ `p-3 rounded-t-xl border-x border-t flex flex-col sm:flex-row gap-4 bg-muted z-0 ${ className }` }>
			<div className="relative w-full flex gap-2">
				{ /* Search Icon & Input */ }
				<div className="relative flex-1 z-10">
					<Search
						className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
					<InputOld
						value={ searchText }
						onChange={ handleInputChange }
						placeholder={ t("searchPlaceholder") }
						className="ps-10 bg-background border focus-visible:ring-1"
					/>
				</div>
			</div>
		</div>
	);
}
