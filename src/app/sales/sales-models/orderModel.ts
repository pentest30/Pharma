import { OrderItem } from "./orderItem";

export interface OrderModel {
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
    createdByUserId: string;
    orderItems: OrderItem[];
}

