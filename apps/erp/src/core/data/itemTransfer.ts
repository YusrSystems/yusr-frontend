import type { Signal } from "@preact/signals-react";
import {
	ChangeableEntity,
	ChangeableEntityMode,
	DateService,
	Dto,
	i18n,
	type IStatusWorkflowEntity,
	Validators
} from "yusr-ui";
import { ItemUoM, type ItemUoMDto } from "./itemUoM";
import { type IStatusWorkflowDto, TransactionStatus } from "#/types/transactionStatus.ts";
import type { IRowVerDto, IRowVerEntity } from "#/types/rowVer.ts";


export class ItemTransfersItemDto extends Dto
{
	public itemTransferId!: number;
	public itemId!: number;
	public itemName!: string;
	public itemUoMId!: number;
	public unitName!: string;
	public quantity!: number;
	public maxQuantity!: number;
	public uoMs: ItemUoMDto[] = [];
}

export class ItemTransfersItem extends ChangeableEntity<ItemTransfersItemDto>
{
	public itemTransferId: Signal<number>;
	public itemId: Signal<number>;
	public itemName: Signal<string>;
	public itemUoMId: Signal<number>;
	public unitName: Signal<string>;
	public quantity: Signal<number>;
	public maxQuantity: Signal<number>;
	public uoMs: Signal<ItemUoM[]>;

	constructor(dto?: Partial<ItemTransfersItemDto> | undefined)
	{
		super(dto, [], ChangeableEntityMode.Create);

		this.itemTransferId = this.assign("itemTransferId", dto?.itemTransferId ?? 0);
		this.itemId = this.assign("itemId", dto?.itemId ?? 0);
		this.itemName = this.assign("itemName", dto?.itemName ?? "");
		this.itemUoMId = this.assign("itemUoMId", dto?.itemUoMId ?? 0);
		this.unitName = this.assign("unitName", dto?.unitName ?? "");
		this.quantity = this.assign("quantity", dto?.quantity ?? 0);
		this.maxQuantity = this.assign("maxQuantity", dto?.maxQuantity ?? 0);
		this.uoMs = this.assign(
			"uoMs",
			(dto?.uoMs ?? []).map((m) =>
				m instanceof ItemUoM ? m : new ItemUoM(m)
			)
		);
	}
}

export class ItemTransferDto extends Dto implements IStatusWorkflowDto, IRowVerDto
{
	public description?: string;
	public date!: string;
	public fromStoreId!: number;
	public fromStoreName?: string;
	public toStoreId!: number;
	public toStoreName?: string;
	public itemTransfersItems!: ItemTransfersItemDto[];
	public rowVer!: number;
	public transactionStatus: TransactionStatus = TransactionStatus.Draft;
}

export default class ItemTransfer extends ChangeableEntity<ItemTransferDto> implements IStatusWorkflowEntity, IRowVerEntity
{
	public description: Signal<string | undefined>;
	public date: Signal<string>;
	public fromStoreId: Signal<number | undefined>;
	public fromStoreName: Signal<string | undefined>;
	public toStoreId: Signal<number | undefined>;
	public toStoreName: Signal<string | undefined>;
	public itemTransfersItems: Signal<ItemTransfersItem[]>;
	public rowVer: Signal<number>;
	public transactionStatus: Signal<TransactionStatus>;

	constructor(dto?: Partial<ItemTransferDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "date",
			selector: (d) => d.date,
			validators: [Validators.required(i18n.t("stocking:itemTransfers.transferDateRequired"))]
		}, {
			field: "fromStoreId",
			selector: (d) => d.fromStoreId,
			validators: [Validators.required(i18n.t("stocking:itemTransfers.fromStoreRequired"))]
		}, {
			field: "toStoreId",
			selector: (d) => d.toStoreId,
			validators: [
				Validators.required(i18n.t("stocking:itemTransfers.toStoreRequired")),
				Validators.custom(
					(val, formData) => val !== formData.fromStoreId,
					i18n.t("stocking:itemTransfers.sameStoreError")
				)
			]
		}, {
			field: "itemTransfersItems",
			selector: (d) => d.itemTransfersItems,
			validators: [Validators.arrayMinLength(1, i18n.t("stocking:itemTransfers.itemsRequired"))]
		}], mode);

		this.description = this.assign("description", dto?.description ?? undefined);
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.fromStoreId = this.assign("fromStoreId", dto?.fromStoreId ?? undefined);
		this.fromStoreName = this.assign("fromStoreName", dto?.fromStoreName ?? undefined);
		this.toStoreId = this.assign("toStoreId", dto?.toStoreId ?? undefined);
		this.toStoreName = this.assign("toStoreName", dto?.toStoreName ?? undefined);
		const itemsList = (dto?.itemTransfersItems ?? []).map((s) => new ItemTransfersItem(s));
		this.itemTransfersItems = this.assign("itemTransfersItems", itemsList);
		this.rowVer = this.assign("rowVer", dto?.rowVer);
		this.transactionStatus = this.assign("transactionStatus", dto?.transactionStatus ?? TransactionStatus.Draft);
	}
}