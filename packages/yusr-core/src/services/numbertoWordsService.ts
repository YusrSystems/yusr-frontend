import type { Currency } from "../entities";

export class NumbertoWordsService 
{
  private static masculineUnits: string[] = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  private static feminineUnits: string[] = ['', 'واحدة', 'اثنتان', 'ثلاث', 'أربع', 'خمس', 'ست', 'سبع', 'ثمان', 'تسع'];

  private static tens: string[] = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  private static teens: string[] = ['أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  private static feminineTeens: string[] = ['إحدى عشرة', 'اثنتا عشرة', 'ثلاث عشرة', 'أربع عشرة', 'خمس عشرة', 'ست عشرة', 'سبع عشرة', 'ثماني عشرة', 'تسع عشرة'];

  private static hundreds: string[] = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];


  static ConvertAmount(amount: number, currency: Currency): string 
  {
    const integerPart = Math.floor(amount);
    const fractionPart = Math.round((amount - integerPart) * 100);

    let result = '';

    if (integerPart > 0) {
      result += this.Convert(integerPart, currency.isFeminine) + ' ' + this.getCurrencyWord(integerPart, currency, false);
    }

    if (fractionPart > 0) {
      if (result) result += ' و ';
      result += this.Convert(fractionPart, currency.isFeminine) + ' ' + this.getCurrencyWord(fractionPart, currency, true);
    }

    if (integerPart === 0 && fractionPart === 0) {
      result = `صفر ${currency.name}`;
    }

    return result;
  }

  public static Convert(num: number, isFeminine = false): string {
    if (num === 0) return 'صفر';

    let parts = [];

    if (num >= 1_000_000_000) {
      const billions = Math.floor(num / 1_000_000_000);
      parts.push(this.convertHundreds(billions, false) + ' مليار' + (billions > 2 ? 'ات' : ''));
      num %= 1_000_000_000;
    }

    if (num >= 1_000_000) {
      const millions = Math.floor(num / 1_000_000);
      parts.push(this.convertHundreds(millions, false) + ' مليون' + (millions > 2 ? 'ات' : ''));
      num %= 1_000_000;
    }

    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (thousands === 1) parts.push('ألف');
      else if (thousands === 2) parts.push('ألفان');
      else parts.push(this.convertHundreds(thousands, false) + ' آلاف');
      num %= 1000;
    }

    if (num > 0) {
      parts.push(this.convertHundreds(num, isFeminine));
    }

    return parts.join(' و ');
  }

  private static convertHundreds(num: number, isFeminine = false): string {
    const hundredsDigit = Math.floor(num / 100);
    const rest = num % 100;

    let result = '';

    if (hundredsDigit > 0) result += this.hundreds[hundredsDigit];

    if (rest > 0) {
      if (result) result += ' و ';


      if (rest >= 11 && rest <= 19) {
        result += isFeminine ? this.feminineTeens[rest - 11] : this.teens[rest - 11];
      } else {
        const unitsDigit = rest % 10;
        const tensDigit = Math.floor(rest / 10);

        const unitsArray = isFeminine ? this.feminineUnits : this.masculineUnits;
        const unitWord = unitsArray[unitsDigit];
        const tenWord = this.tens[tensDigit];

        if (unitsDigit > 0 && tensDigit > 0) {
          result += unitWord + ' و ' + tenWord;
        } else if (tensDigit > 0) {
          result += tenWord;
        } else {
          result += unitWord;
        }
      }
    }

    return result;
  }

  private static getCurrencyWord(value: number, currency: Currency, sub: boolean): string {
    if (value === 0) 
        return sub? currency.subPlural : currency.plural;

    if (value === 1 || value === 2) 
        return sub? currency.subName : currency.name;

    if (value >= 3 && value <= 10) 
        return sub? currency.subPlural : currency.plural;

    return sub? currency.subName : currency.name;
  }
}