import { OrderItem } from "./orderItem";

export class Order {
    id: string;
    customerId: string | null;
    customerName: string;
    supplierId: string | null;
    supplierName: string;
    orderStatus: number;
    orderDiscount: number;
    orderTotal: number;
    orderNumber: string;
    paymentStatus: number;
    expectedShippingDate: Date | string | null;
    refDocument: string;
    orderType: string;
    type: string;
    orderItems: OrderItem[];
    commandType : string;
    orderId : string;
    createdDateTime : Date;
    updatedDateTime : Date;
    psychotropic: boolean;
    createdByUserId: any;
    totalDiscountHT: number;
    toBeRespected: boolean;


}