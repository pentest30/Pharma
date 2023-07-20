import { SupplierOrder } from "./SupplierOrder";

export class SupplierOrderItem  {
    id: string | null;      
    orderId: string | null;      
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    
    expiryDate: Date | string | null;
    minExpiryDate: Date | string | null;

    order: SupplierOrder;
    daysInStock: number;
    /**quantité facturée */
    invoicedQuantity: number;

    /**quantité reçue */
    receivedQuantity: number;

    /**Quantité restante */
    remainingQuantity: number;
}
export class CreateSupplierOrderItem  {
    orderId: string;
    id: string;
    productId: string;
    quantity: number;
    oldQuantity: number;
    supplierOrganizationId: string;
    minExpiryDate: Date | string | null;
    expectedDeliveryDate: Date | string | null;
    internalBatchNumber: string = '';
    productCode: string;
    psychotropic: boolean;
    extraDiscount: number;
    discount: number;
    documentRef: string;
    productName: string;
    unitPrice: number;
    vendorBatchNumber: string = '';
    expiryDate: Date | string | null;
    orderDate: Date | string;
    customerName: string = '';
    supplierName: string;
}