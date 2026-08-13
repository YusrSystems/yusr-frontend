import { Signal } from "@preact/signals-react";
import { ChangeableEntity, ChangeableEntityMode, Dto, UserDto, Validators } from "yusr-ui";
import type { PaymentMethodDto } from "./paymentMethod";
import type { PosSessionDto } from "@/core/data/posSession.ts";


export class PosTerminalFavoriteItemDto extends Dto
{
	public posTerminalId!: number;
	public itemId!: number;
	public itemName!: string;
	public displayOrder!: number;
}

export class PosTerminalDto extends Dto
{
	public name!: string;
	public storeId!: number;
	public branchId!: number;
	public branchName!: string;
	public storeName!: string;
	public defaultPartnerId?: number;
	public defaultPartnerName?: string;
	public activeSession?: PosSessionDto;
	public allowedPaymentMethods: PaymentMethodDto[] = [];
	public posTerminalUsers: UserDto[] = [];
	public favoriteItems: PosTerminalFavoriteItemDto[] = [];
}

export class PosTerminal extends ChangeableEntity<PosTerminalDto>
{
	public name: Signal<string>;
	public storeId: Signal<number | undefined>;
	public branchId: Signal<number | undefined>;
	public branchName: Signal<string | undefined>;
	public storeName: Signal<string | undefined>;
	public defaultPartnerId: Signal<number | undefined>;
	public defaultPartnerName: Signal<string | undefined>;
	public allowedPaymentMethods: Signal<PaymentMethodDto[]>;
	public posTerminalUsers: Signal<UserDto[]>;
	public favoriteItems: Signal<PosTerminalFavoriteItemDto[]>;

	constructor(dto?: Partial<PosTerminalDto>, mode: ChangeableEntityMode = ChangeableEntityMode.Create)
	{
		super(dto, [
			{field: "name", selector: d => d.name, validators: [Validators.required("الاسم مطلوب")]},
			{field: "storeId", selector: d => d.storeId, validators: [Validators.required("المستودع مطلوب")]},
			{field: "branchId", selector: d => d.branchId, validators: [Validators.required("الفرع مطلوب")]}
		], mode);

		this.name = this.assign("name", dto?.name ?? "");
		this.storeId = this.assign("storeId", dto?.storeId);
		this.branchId = this.assign("branchId", dto?.branchId);
		this.branchName = this.assign("branchName", dto?.branchName);
		this.storeName = this.assign("storeName", dto?.storeName);
		this.defaultPartnerId = this.assign("defaultPartnerId", dto?.defaultPartnerId);
		this.defaultPartnerName = this.assign("defaultPartnerName", dto?.defaultPartnerName);
		this.allowedPaymentMethods = this.assign("allowedPaymentMethods", dto?.allowedPaymentMethods ?? []);
		this.posTerminalUsers = this.assign("posTerminalUsers", dto?.posTerminalUsers ?? []);
		this.favoriteItems = this.assign("favoriteItems", dto?.favoriteItems ?? []);
	}
}