import { Order } from "./Order";

export class OrderItem  {
    id: string | null;      
    orderId: string;      
    productId: string;
    customerId: string;
    productName: string;
    productCode: string;
    quantity: number;
    quantityString: string;
    unitPrice: number;
    discount: number;
    extraDiscount: number;
    tax: number;
    unitPriceInclTax: number;
    internalBatchNumber: string;
    color: string;
    size: string;
    order: Order;
    totalInlTax: number;
    totalExlTax: number; 
    discountValue: number;
    expiryDate: Date;
    purchaseUnitPrice: number;
    ppaPFS: number;
    pfs:number;
    orderNumber: string;
    pickingZoneId: string | null;
    pickingZoneName: string;
    zoneGroupId: string | null;
    zoneGroupName: string;
    packing: number;
}

export class OrderItemCreateCommand { 
    id: string | null;
    orderId: string;
    customerId: string;
    productId: string;
    orderType: number;
    productCode: string;
    color: string;
    size: string;
    quantity: number;
    supplierOrganizationId: string | null;
    minExpiryDate: Date | string | null;
    internalBatchNumber: string | null;
    extraDiscount: number;
    ppaPFS: number;
    pfs:number;
    documentRef: string;
    pickingZoneId: string | null;
    pickingZoneName: string;
    zoneGroupId: string | null;
    zoneGroupName: string;
    packing: number;
    thermolabile : boolean;
    defaultLocation : string | null;
    pickingZoneOrder : number;
    tax: number;
    toBeRespected: boolean;
    specialOrder : boolean

}
export class OrderItemDeleteCommand {
    orderId: string;
    productId: string;
    supplierId: string;
    color: string;
    size: string;
}
export class SendOrderByPharmacistCommand {
    id: string;
    supplierId: string;
    customerId: string| null;
    ttc: number;
    tht: number;
    expectedShippingDate: Date | string | null;
    orderBenefit: number;
    orderBenefitRate: number;
    toBeRespected: boolean;
    isSpecialOrder: boolean;
    refDocument: string;

}
export class UpdateOrderBySalesPersonCommand
{
    id: string;
    supplierId: string;
    orderStatus: number;
    cancellationReason: number | null;
    rejectedReason: number | null;
}
export class ChangePaymentStateCommand {
    id: string;
    paymentStatus : number;
}
export class GetSalesPersonPendingOrderQueryV2 {
    orderId: string;
    customerId : string;
}
export class ChangeExtraDiscountCommand {
    id: string;
    discount: number;
    internalBatchNumber: string;
    productId: string;
    customerId: string;
   
}
export class UpdateOrderDiscountCommandV2 {
    id: string;
    customerId: string;
    DiscountLines : DiscountLine [] = [];
   
}
export class DiscountLine {
    discount: number;
    internalBatchNumber: string;
    productId: string;
}