import type {Signal} from "@preact/signals-react";
import {type TFunction} from "i18next";
import {i18n} from "../locales";
import {ChangeableEntity, type ChangeableEntityMode, Dto} from "../stateManager";
import {type ValidationRuleOld, Validators} from "../validation";
import {BaseEntity} from "./baseEntity";
import {City, CityDto, type CityOld} from "./city";

export class BranchOld extends BaseEntity {
    public name!: string;
    public cityId!: number;
    public city!: CityOld;
    public street!: string;
    public district!: string;
    public buildingNumber!: string;
    public postalCode!: string;

    constructor(init?: Partial<BranchOld>) {
        super();
        Object.assign(this, init);
    }
}

export class BranchValidationRules {
    public static validationRules = (
        t: TFunction<"commonEntities", undefined>
    ): ValidationRuleOld<Partial<BranchOld>>[] => [{
        field: "name",
        selector: (d) => d.name,
        validators: [Validators.required(t("branches.nameRequired"))]
    }, {
        field: "cityId",
        selector: (d) => d.cityId,
        validators: [Validators.required(t("branches.cityRequired"))]
    }, {
        field: "buildingNumber",
        selector: (d) => d.buildingNumber,
        validators: [Validators.optional(
            Validators.exactLength(4, t("branches.buildingNumberLength")),
            Validators.numeric(t("branches.buildingNumberNumeric"))
        )]
    }, {
        field: "postalCode",
        selector: (d) => d.postalCode,
        validators: [Validators.optional(
            Validators.exactLength(5, t("branches.postalCodeLength")),
            Validators.numeric(t("branches.postalCodeNumeric"))
        )]
    }];
}

export class BranchDto extends Dto {
    public name!: string;
    public cityId?: number;
    public cityName?: number;
    public street?: string;
    public district?: string;
    public buildingNumber?: string;
    public postalCode?: string;
    public city?: CityDto;
}

export class Branch extends ChangeableEntity<BranchDto> {
    public name: Signal<string>;
    public cityId: Signal<number | undefined>;
    public cityName: Signal<string | undefined>;
    public street: Signal<string | undefined>;
    public district: Signal<string | undefined>;
    public buildingNumber: Signal<string | undefined>;
    public postalCode: Signal<string | undefined>;
    public city: Signal<City | undefined>;

    constructor(dto: Partial<BranchDto> | undefined, mode: ChangeableEntityMode = "create") {
        super(dto, [{
            field: "name",
            selector: (d) => d.name,
            validators: [Validators.required(i18n.t("commonEntities:branches.nameRequired"))]
        }, {
            field: "cityId",
            selector: (d) => d.cityId,
            validators: [Validators.required(i18n.t("commonEntities:branches.cityRequired"))]
        }, {
            field: "buildingNumber",
            selector: (d) => d.buildingNumber,
            validators: [Validators.optional(
                Validators.exactLength(4, i18n.t("commonEntities:branches.buildingNumberLength")),
                Validators.numeric(i18n.t("commonEntities:branches.buildingNumberNumeric"))
            )]
        }, {
            field: "postalCode",
            selector: (d) => d.postalCode,
            validators: [Validators.optional(
                Validators.exactLength(5, i18n.t("commonEntities:branches.postalCodeLength")),
                Validators.numeric(i18n.t("commonEntities:branches.postalCodeNumeric"))
            )]
        }], mode);

        this.name = this.assign("name", dto?.name ?? "");
        this.cityId = this.assign("cityId", dto?.cityId ?? undefined);
        this.cityName = this.assign("cityName", dto?.cityName ?? undefined);
        this.street = this.assign("street", dto?.street ?? undefined);
        this.district = this.assign("district", dto?.district ?? undefined);
        this.buildingNumber = this.assign("buildingNumber", dto?.buildingNumber ?? undefined);
        this.postalCode = this.assign("postalCode", dto?.postalCode ?? undefined);
        this.city = this.assign("city", new City({...dto?.city}));
    }
}
