import { type TFunction } from "i18next";
import * as numberToWords from "number-to-words";
import { Currency, CurrencyOld } from "../entities";
// mark methods that uses old currencies methods as old
// allowing the normal methods to accept Currency entity
// so now it can work will in old version of balance transfer and new version
export class NumbertoWordsService
{
	private static t: TFunction | null = null;
	private static currentLanguage: string = "ar";

	private static masculineUnits: string[] = [];
	private static feminineUnits: string[] = [];
	private static tens: string[] = [];
	private static teens: string[] = [];
	private static feminineTeens: string[] = [];
	private static hundreds: string[] = [];

	public static init(t: TFunction, language: string)
	{
		this.t = t;
		this.currentLanguage = language;

		if (language === "ar")
		{
			this.initArabic(t);
		}
	}

	private static initArabic(t: TFunction)
	{
		this.masculineUnits = [
			t("numberToWords.masculineUnits.0"),
			t("numberToWords.masculineUnits.1"),
			t("numberToWords.masculineUnits.2"),
			t("numberToWords.masculineUnits.3"),
			t("numberToWords.masculineUnits.4"),
			t("numberToWords.masculineUnits.5"),
			t("numberToWords.masculineUnits.6"),
			t("numberToWords.masculineUnits.7"),
			t("numberToWords.masculineUnits.8"),
			t("numberToWords.masculineUnits.9")
		];

		this.feminineUnits = [
			t("numberToWords.feminineUnits.0"),
			t("numberToWords.feminineUnits.1"),
			t("numberToWords.feminineUnits.2"),
			t("numberToWords.feminineUnits.3"),
			t("numberToWords.feminineUnits.4"),
			t("numberToWords.feminineUnits.5"),
			t("numberToWords.feminineUnits.6"),
			t("numberToWords.feminineUnits.7"),
			t("numberToWords.feminineUnits.8"),
			t("numberToWords.feminineUnits.9")
		];

		this.tens = [
			t("numberToWords.tens.0"),
			t("numberToWords.tens.1"),
			t("numberToWords.tens.2"),
			t("numberToWords.tens.3"),
			t("numberToWords.tens.4"),
			t("numberToWords.tens.5"),
			t("numberToWords.tens.6"),
			t("numberToWords.tens.7"),
			t("numberToWords.tens.8"),
			t("numberToWords.tens.9")
		];

		this.teens = [
			t("numberToWords.teens.11"),
			t("numberToWords.teens.12"),
			t("numberToWords.teens.13"),
			t("numberToWords.teens.14"),
			t("numberToWords.teens.15"),
			t("numberToWords.teens.16"),
			t("numberToWords.teens.17"),
			t("numberToWords.teens.18"),
			t("numberToWords.teens.19")
		];

		this.feminineTeens = [
			t("numberToWords.feminineTeens.11"),
			t("numberToWords.feminineTeens.12"),
			t("numberToWords.feminineTeens.13"),
			t("numberToWords.feminineTeens.14"),
			t("numberToWords.feminineTeens.15"),
			t("numberToWords.feminineTeens.16"),
			t("numberToWords.feminineTeens.17"),
			t("numberToWords.feminineTeens.18"),
			t("numberToWords.feminineTeens.19")
		];

		this.hundreds = [
			t("numberToWords.hundreds.0"),
			t("numberToWords.hundreds.1"),
			t("numberToWords.hundreds.2"),
			t("numberToWords.hundreds.3"),
			t("numberToWords.hundreds.4"),
			t("numberToWords.hundreds.5"),
			t("numberToWords.hundreds.6"),
			t("numberToWords.hundreds.7"),
			t("numberToWords.hundreds.8"),
			t("numberToWords.hundreds.9")
		];
	}

	private static getT(): TFunction
	{
		if (!this.t)
		{
			throw new Error("NumbertoWordsService not initialized. Call NumbertoWordsService.init(t, language) first.");
		}
		return this.t;
	}

	static ConvertAmountOld(amount: number, currency: CurrencyOld): string
	{
		const integerPart = Math.floor(amount);
		const fractionPart = Math.round((amount - integerPart) * 100);

		if (this.currentLanguage === "en")
		{
			// Use library for English
			let result = "";

			if (integerPart > 0)
			{
				result += numberToWords.toWords(integerPart) + " " + this.getCurrencyWordOld(integerPart, currency, false);
			}

			if (fractionPart > 0)
			{
				if (result)
				{
					result += " and ";
				}
				result += numberToWords.toWords(fractionPart) + " " + this.getCurrencyWordOld(fractionPart, currency, true);
			}

			if (integerPart === 0 && fractionPart === 0)
			{
				result = `zero ${ currency.name }`;
			}

			return result;
		}

		// Arabic custom code
		const t = this.getT();
		let result = "";

		if (integerPart > 0)
		{
			result += this.ConvertArabic(integerPart, currency.isFeminine) + " "
				+ this.getCurrencyWordOld(integerPart, currency, false);
		}

		if (fractionPart > 0)
		{
			if (result)
			{
				result += " " + t("numberToWords.and") + " ";
			}
			result += this.ConvertArabic(fractionPart, currency.isFeminine) + " "
				+ this.getCurrencyWordOld(fractionPart, currency, true);
		}

		if (integerPart === 0 && fractionPart === 0)
		{
			result = `${ t("numberToWords.zero") } ${ currency.name }`;
		}

		return result;
	}

	static ConvertAmount(amount: number, currency: Currency): string
	{
		const integerPart = Math.floor(amount);
		const fractionPart = Math.round((amount - integerPart) * 100);

		if (this.currentLanguage === "en")
		{
			// Use library for English
			let result = "";

			if (integerPart > 0)
			{
				result += numberToWords.toWords(integerPart) + " " + this.getCurrencyWord(integerPart, currency, false);
			}

			if (fractionPart > 0)
			{
				if (result)
				{
					result += " and ";
				}
				result += numberToWords.toWords(fractionPart) + " " + this.getCurrencyWord(fractionPart, currency, true);
			}

			if (integerPart === 0 && fractionPart === 0)
			{
				result = `zero ${ currency.name.value }`;
			}

			return result;
		}

		// Arabic custom code
		const t = this.getT();
		let result = "";

		if (integerPart > 0)
		{
			result += this.ConvertArabic(integerPart, currency.isFeminine.value) + " "
				+ this.getCurrencyWord(integerPart, currency, false);
		}

		if (fractionPart > 0)
		{
			if (result)
			{
				result += " " + t("numberToWords.and") + " ";
			}
			result += this.ConvertArabic(fractionPart, currency.isFeminine.value) + " "
				+ this.getCurrencyWord(fractionPart, currency, true);
		}

		if (integerPart === 0 && fractionPart === 0)
		{
			result = `${ t("numberToWords.zero") } ${ currency.name.value }`;
		}

		return result;
	}

	static Convert(num: number, isFeminine = false): string
	{
		if (this.currentLanguage === "en")
		{
			return numberToWords.toWords(num);
		}
		return this.ConvertArabic(num, isFeminine);
	}

	private static ConvertArabic(num: number, isFeminine = false): string
	{
		const t = this.getT();

		if (num === 0)
		{
			return t("numberToWords.zero");
		}

		let parts = [];

		if (num >= 1_000_000_000)
		{
			const billions = Math.floor(num / 1_000_000_000);
			parts.push(
				this.convertHundredsArabic(billions, false) + " "
				+ (billions > 2 ? t("numberToWords.billions") : t("numberToWords.billion"))
			);
			num %= 1_000_000_000;
		}

		if (num >= 1_000_000)
		{
			const millions = Math.floor(num / 1_000_000);
			parts.push(
				this.convertHundredsArabic(millions, false) + " "
				+ (millions > 2 ? t("numberToWords.millions") : t("numberToWords.million"))
			);
			num %= 1_000_000;
		}

		if (num >= 1000)
		{
			const thousands = Math.floor(num / 1000);
			if (thousands === 1)
			{
				parts.push(t("numberToWords.oneThousand"));
			}
			else if (thousands === 2)
			{
				parts.push(t("numberToWords.twoThousand"));
			}
			else
			{
				parts.push(this.convertHundredsArabic(thousands, false) + " " + t("numberToWords.thousands"));
			}
			num %= 1000;
		}

		if (num > 0)
		{
			parts.push(this.convertHundredsArabic(num, isFeminine));
		}

		if (parts.length === 0)
		{
			return "";
		}
		else if (parts.length === 1)
		{
			return parts[0];
		}
		else
		{
			const lastPart = parts.pop();
			return parts.join(" ") + " " + t("numberToWords.and") + " " + lastPart;
		}
	}

	private static convertHundredsArabic(num: number, isFeminine = false): string
	{
		const t = this.getT();
		const hundredsDigit = Math.floor(num / 100);
		const rest = num % 100;

		if (rest === 0)
		{
			return this.hundreds[hundredsDigit] ?? "";
		}

		let result = "";

		if (hundredsDigit > 0)
		{
			result += this.hundreds[hundredsDigit];
		}

		let restWords = "";

		if (rest >= 11 && rest <= 19)
		{
			restWords = isFeminine ? this.feminineTeens[rest - 11] ?? "" : this.teens[rest - 11] ?? "";
		}
		else
		{
			const unitsDigit = rest % 10;
			const tensDigit = Math.floor(rest / 10);

			const unitsArray = isFeminine ? this.feminineUnits : this.masculineUnits;
			const unitWord = unitsArray[unitsDigit] ?? "";
			const tenWord = this.tens[tensDigit] ?? "";

			if (unitsDigit > 0 && tensDigit > 1)
			{
				restWords = unitWord + " " + t("numberToWords.and") + " " + tenWord;
			}
			else if (unitsDigit > 0 && tensDigit === 1)
			{
				restWords = this.teens[unitsDigit + 9] ?? "";
			}
			else if (unitsDigit > 0)
			{
				restWords = unitWord;
			}
			else if (tensDigit > 0)
			{
				restWords = tenWord;
			}
		}

		if (result && restWords)
		{
			return result + " " + t("numberToWords.and") + " " + restWords;
		}

		return result || restWords;
	}

	private static getCurrencyWord(value: number, currency: Currency, sub: boolean): string
	{
		if (value === 0)
		{
			return sub ? currency.subPlural.value : currency.plural.value;
		}

		if (value === 1 || value === 2)
		{
			return sub ? currency.subName.value : currency.name.value;
		}

		if (value >= 3 && value <= 10)
		{
			return sub ? currency.subPlural.value : currency.plural.value;
		}

		return sub ? currency.subName.value : currency.name.value;
	}

	private static getCurrencyWordOld(value: number, currency: CurrencyOld, sub: boolean): string
	{
		if (value === 0)
		{
			return sub ? currency.subPlural : currency.plural;
		}

		if (value === 1 || value === 2)
		{
			return sub ? currency.subName : currency.name;
		}

		if (value >= 3 && value <= 10)
		{
			return sub ? currency.subPlural : currency.plural;
		}

		return sub ? currency.subName : currency.name;
	}
}
