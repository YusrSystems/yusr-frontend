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
import { StocktakingItem, type StocktakingItemDto } from "./stocktakingItem";
import { type IStatusWorkflowDto, TransactionStatus } from "#/types/transactionStatus.ts";
import type { IRowVerDto, IRowVerEntity } from "#/types/rowVer.ts";


export class StocktakingDto extends Dto implements IStatusWorkflowDto, IRowVerDto
{
	public description?: string;
	public date!: string;
	public storeId?: number;
	public storeName?: string;
	public items: StocktakingItemDto[] = [];
	public rowVer!: number;
	public transactionStatus: TransactionStatus = TransactionStatus.Draft;
	public isOpeningBalance?: boolean;
}

export default class Stocktaking extends ChangeableEntity<StocktakingDto> implements IStatusWorkflowEntity, IRowVerEntity
{
	public description: Signal<string | undefined>;
	public date: Signal<string>;
	public storeId: Signal<number | undefined>;
	public storeName: Signal<string | undefined>;
	public items: Signal<StocktakingItem[]>;
	public rowVer: Signal<number>;
	public transactionStatus: Signal<TransactionStatus>;
	public isOpeningBalance: Signal<boolean>;

	constructor(dto: Partial<StocktakingDto> | undefined, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [{
			field: "storeId",
			selector: (d) => d.storeId,
			validators: [Validators.required(i18n.t("stocking:stocktakings.storeRequired"))]
		}, {
			field: "date",
			selector: (d) => d.date,
			validators: [Validators.required(i18n.t("stocking:stocktakings.dateRequired"))]
		}, {
			field: "items",
			selector: (d) => d.items,
			validators: [Validators.arrayMinLength(1, i18n.t("stocking:stocktakings.itemsRequired"))]
		}], mode);

		this.description = this.assign("description", dto?.description ?? "");
		this.date = this.assign("date", dto?.date ?? DateService.formatDateOnly(new Date()));
		this.storeId = this.assign("storeId", dto?.storeId ?? 0);
		this.storeName = this.assign("storeName", dto?.storeName ?? "");
		const itemsList = (dto?.items ?? []).map((s) => new StocktakingItem(s));
		this.items = this.assign("items", itemsList);
		this.rowVer = this.assign("rowVer", dto?.rowVer);
		this.transactionStatus = this.assign("transactionStatus", dto?.transactionStatus ?? TransactionStatus.Draft);
		this.isOpeningBalance = this.assign("isOpeningBalance", dto?.isOpeningBalance ?? false);
	}

	override validate(dto?: Partial<StocktakingDto>): boolean
	{
		const isBaseValid = super.validate(dto);
		const areItemsValid = this.items.value.every(item => item.validate());
		return isBaseValid && areItemsValid;
	}
}