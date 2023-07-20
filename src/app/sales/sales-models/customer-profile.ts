import { Address } from "src/app/address/address-model";


export class CustomerProfile {
    id : string;
    code : string;
    name: string;
    debt : number;
    paymentDeadline : number;
    phoneNumber : string;
    sector  :string;
    limitCredit : number;
    monthlyObjective : number;
    paymentMethod : string;
    address : Address ;
    customerStatus : string;
    organizationId : string;
    customerGroup : string;

}