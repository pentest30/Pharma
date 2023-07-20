import { Address } from "src/app/address/address-model";
import { EmailModel } from "src/app/email/email-model";
import { PhoneNumber } from "src/app/phone/phone";
import { ProductClass } from "src/app/product-class/models/product-class-model";
import { TaxGroup } from "src/app/tax-group/models/tax-group";

export class Client {
    id : string;
    onlineCustomer?: boolean;
    isPickUpLocation?: boolean;
    deliveryTypeDescription?: string;
    deliveryType?: number;
    allowedProductClasses?: ProductClass[];
    taxGroupId?:string;
    quotaEligibility?: boolean;
    defaultSalesPerson?: string;
    defaultSalesGroup: string;
    defaultDeliverySector:string;
    organizationStatus: number;
    organizationStatusDescription:string;
    organizationName: string;
    organizationId:string;
    dept: number;
    paymentMethod: string;
    limitCredit : number;
    code : string;
    paymentMode : number;
    paymentDeadline: number

 }
export enum PaymentMode
{
    Chéque = 0,
    Transfert = 1,
    Carte = 2
}
