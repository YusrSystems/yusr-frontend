import type PaymentMethodOld from "@/core/data/paymentMethod";
import {PaymentMethodSlice} from "@/core/data/paymentMethod";
import PaymentMethodsApiServiceOld from "@/core/networking/paymentMethodApiServiceOld";
import ChangePaymentMethodDialogOld from "@/features/paymentMethods/changePaymentMethodDialogOld";
import {type BasicSearchableSelectParamsOld, ChangableSearchableSelect} from "yusr-ui";
import {SystemPermissionsResources} from "../../auth/systemPermissionsResources";
import {useAppSelector} from "../../state/store";

export default function PaymentMethodsSearchableSelectOld(
    {...props}: BasicSearchableSelectParamsOld<PaymentMethodOld>
) {
    const PaymentMethodState = useAppSelector((state) => state.paymentMethod);
    const authState = useAppSelector((state) => state.auth);

    return (
        <ChangableSearchableSelect<PaymentMethodOld, {
            filterDataOutside?: boolean;
        }>
            labelKey="name"
            createKey="name"
            state={PaymentMethodState}
            apiService={new PaymentMethodsApiServiceOld()}
            systemPermissionsResources={SystemPermissionsResources.PaymentMethods}
            entityActions={{
                filter: PaymentMethodSlice.entityActions.filter,
                refresh: PaymentMethodSlice.entityActions.refresh
            }}
            allowAdd={false}
            allowUpdate={false}
            changeDialog={ChangePaymentMethodDialogOld}
            changeDialogProps={{
                filterDataOutside: true
            }}
            authPermissions={authState.loggedInUser?.role?.permissions ?? []}
            {...props}
        />
    );
}
