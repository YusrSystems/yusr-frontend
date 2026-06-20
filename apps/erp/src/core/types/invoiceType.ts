export const InvoiceType = {
    Sell: 1,
    Purchase: 2,
    SellReturn: 3,
    Quotation: 4,
    PurchaseReturn: 5
} as const;

export type InvoiceType = (typeof InvoiceType)[keyof typeof InvoiceType];