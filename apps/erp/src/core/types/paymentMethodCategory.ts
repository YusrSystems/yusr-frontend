export enum PaymentMethodCategory
{
	Cash = 1,
	BankCard = 2,
	BankTransfer = 3,
	DigitalWallet = 4,
	CustomerAccount = 5,
	BuyNowPayLater = 6,
	GiftCardVoucher = 7,
	Cheque = 8,
	Other = 99
}

export function getPaymentMethodCategoryName(category: PaymentMethodCategory): string
{
	switch (category)
	{
		case PaymentMethodCategory.Cash:
			return "نقدي (الصندوق)";
		case PaymentMethodCategory.BankCard:
			return "مدى / بطاقة ائتمانية (شبكة)";
		case PaymentMethodCategory.BankTransfer:
			return "تحويل بنكي مباشر";
		case PaymentMethodCategory.DigitalWallet:
			return "محفظة إلكترونية (Apple Pay, STC Pay)";
		case PaymentMethodCategory.CustomerAccount:
			return "آجل / على حساب العميل";
		case PaymentMethodCategory.BuyNowPayLater:
			return "اشتر الآن وادفع لاحقاً (تمارا / تابي)";
		case PaymentMethodCategory.GiftCardVoucher:
			return "قسيمة هدايا / كوبون";
		case PaymentMethodCategory.Cheque:
			return "شيك بنكي";
		case PaymentMethodCategory.Other:
			return "طرق أخرى";
		default:
			return "-";
	}
}

export function getPaymentMethodCategoryOptions()
{
	return [
		{label: "نقدي (الصندوق)", value: PaymentMethodCategory.Cash},
		{label: "مدى / بطاقة ائتمانية (شبكة)", value: PaymentMethodCategory.BankCard},
		{label: "تحويل بنكي مباشر", value: PaymentMethodCategory.BankTransfer},
		{label: "محفظة إلكترونية (Apple Pay, STC Pay)", value: PaymentMethodCategory.DigitalWallet},
		{label: "آجل / على حساب العميل", value: PaymentMethodCategory.CustomerAccount},
		{label: "اشتر الآن وادفع لاحقاً (تمارا / تابي)", value: PaymentMethodCategory.BuyNowPayLater},
		{label: "قسيمة هدايا / كوبون", value: PaymentMethodCategory.GiftCardVoucher},
		{label: "شيك بنكي", value: PaymentMethodCategory.Cheque},
		{label: "طرق أخرى", value: PaymentMethodCategory.Other}
	];
}