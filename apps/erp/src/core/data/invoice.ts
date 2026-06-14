import {ChangeableEntity, Dto, i18n, StorageFile, Validators} from "yusr-ui";
import {
  EInvoiceStatus,
  type ImportExportType,
  InvoiceReturnStatus,
  InvoiceStatus,
  InvoiceType
} from "@/core/data/invoiceOld.ts";
import type {InvoiceVoucherDto} from "@/core/data/invoiceVoucher.ts";
import type {InvoiceItemDto} from "@/core/data/invoiceItem.ts";
import type {Signal} from "@preact/signals-react";

export class InvoiceDto extends Dto {
    public type!: InvoiceType;
    public originalInvoiceId?: number;
    public date!: string | Date;
    public delegateEmp?: string;
    public statusId!: InvoiceStatus;
    public eInvoiceStatus!: EInvoiceStatus;
    public fullAmount!: number;
    public paidAmount!: number;
    public settlementReason?: string;
    public settlementAmount!: number;
    public settlementPercent!: number;
    public returnStatusId!: InvoiceReturnStatus;
    public storeId!: number;
    public actionAccountId!: number;
    public notes?: string;
    public policy?: string;
    public importExportType?: ImportExportType;

    public createdAt!: string | Date;
    public createdBy!: number;
    public updatedAt!: string | Date;
    public updatedBy!: number;
    public rowVer!: number;

    public actionAccountName!: string;
    public storeName!: string;

    public invoiceItems: InvoiceItemDto[] = [];
    public invoiceVouchers: InvoiceVoucherDto[] = [];
    public invoiceFiles: StorageFile[] = [];
    public ignoreWarnings: boolean = false;
}

export default class Invoice extends ChangeableEntity<InvoiceDto> {
    public type: Signal<InvoiceType>;
    public originalInvoiceId: Signal<number | undefined>;
    public date: Signal<string | Date>;
    public delegateEmp: Signal<string | undefined>;
    public statusId: Signal<InvoiceStatus>;
    public eInvoiceStatus: Signal<EInvoiceStatus>;
    public fullAmount: Signal<number>;
    public paidAmount: Signal<number>;
    public settlementReason: Signal<string | undefined>;
    public settlementAmount: Signal<number>;
    public settlementPercent: Signal<number>;
    public returnStatusId: Signal<InvoiceReturnStatus>;
    public storeId: Signal<number>;
    public actionAccountId: Signal<number>;
    public notes: Signal<string | undefined>;
    public policy: Signal<string | undefined>;
    public importExportType: Signal<ImportExportType | undefined>;

    public createdAt: Signal<string | Date>;
    public createdBy: Signal<number>;
    public updatedAt: Signal<string | Date>;
    public updatedBy: Signal<number>;
    public rowVer: Signal<number>;

    public actionAccountName: Signal<string | undefined>;
    public storeName: Signal<string | undefined>;

    public invoiceItems: Signal<InvoiceItemDto[]>;
    public invoiceVouchers: Signal<InvoiceVoucherDto[]>;
    public invoiceFiles: Signal<StorageFile[]>;
    public ignoreWarnings: Signal<boolean>;

    constructor(dto?: Partial<InvoiceDto>) {
        super(dto, [{
            field: "type",
            selector: (d) => d.type,
            validators: [Validators.required(i18n.t("accounting:invoices.typeRequired"))]
        }, {
            field: "date",
            selector: (d) => d.date,
            validators: [Validators.required(i18n.t("accounting:invoices.dateRequired"))]
        }, {
            field: "storeId",
            selector: (d) => d.storeId,
            validators: [Validators.required(i18n.t("accounting:invoices.storeRequired"))]
        }, {
            field: "actionAccountId",
            selector: (d) => d.actionAccountId,
            validators: [Validators.required(i18n.t("accounting:invoices.accountRequired"))]
        }, {
            field: "invoiceItems",
            selector: (d) => d.invoiceItems,
            validators: [Validators.arrayMinLength(1, i18n.t("accounting:invoices.itemsRequired"))]
        }]);

        this.type = this.assign("type", dto?.type ?? InvoiceType.Sell);
        this.originalInvoiceId = this.assign("originalInvoiceId", dto?.originalInvoiceId);
        this.date = this.assign("date", dto?.date ?
            new Date(dto?.date).toLocaleDateString("en-CA")
            : new Date().toLocaleDateString("en-CA"));
        this.delegateEmp = this.assign("delegateEmp", dto?.delegateEmp);
        this.statusId = this.assign("statusId", dto?.statusId ?? InvoiceStatus.Valid);
        this.eInvoiceStatus = this.assign("eInvoiceStatus", dto?.eInvoiceStatus ?? EInvoiceStatus.NotSent);
        this.fullAmount = this.assign("fullAmount", dto?.fullAmount ?? 0);
        this.paidAmount = this.assign("paidAmount", dto?.paidAmount ?? 0);
        this.settlementReason = this.assign("settlementReason", dto?.settlementReason);
        this.settlementAmount = this.assign("settlementAmount", dto?.settlementAmount ?? 0);
        this.settlementPercent = this.assign("settlementPercent", dto?.settlementPercent ?? 0);
        this.returnStatusId = this.assign("returnStatusId", dto?.returnStatusId ?? InvoiceReturnStatus.NotReturned);
        this.storeId = this.assign("storeId", dto?.storeId ?? 0);
        this.actionAccountId = this.assign("actionAccountId", dto?.actionAccountId ?? 0);
        this.notes = this.assign("notes", dto?.notes);
        this.policy = this.assign("policy", dto?.policy);
        this.importExportType = this.assign("importExportType", dto?.importExportType);

        this.createdAt = this.assign("createdAt", dto?.createdAt ?? new Date());
        this.createdBy = this.assign("createdBy", dto?.createdBy ?? 0);
        this.updatedAt = this.assign("updatedAt", dto?.updatedAt ?? new Date());
        this.updatedBy = this.assign("updatedBy", dto?.updatedBy ?? 0);
        this.rowVer = this.assign("rowVer", dto?.rowVer ?? 0);

        this.actionAccountName = this.assign("actionAccountName", dto?.actionAccountName);
        this.storeName = this.assign("storeName", dto?.storeName);

        this.invoiceItems = this.assign("invoiceItems", dto?.invoiceItems ?? []);
        this.invoiceVouchers = this.assign("invoiceVouchers", dto?.invoiceVouchers ?? []);
        this.invoiceFiles = this.assign("invoiceFiles", dto?.invoiceFiles ?? []);
        this.ignoreWarnings = this.assign("ignoreWarnings", dto?.ignoreWarnings ?? false);
    }
}