import { DeliveryReceipt } from "./DeliveryReceipt";

export interface DeliveryReceiptItem  {
    deliveryReceiptId: string | null;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    salePrice: number;
    expiryDate: Date | string | null;
    purchaseUnitPrice: number;

    deliveryReceipt: DeliveryReceipt;
    packing: number;
    packingNumber: number;
    pFS: number;
    ppa: number;
    /**vrac */
    bulk: number;

}
export class CreateReceiptItemCommand  {
    id: string;
    deliveryReceiptId: string;
    organizationId: string;
    docRef: string;
    deliveryReceiptNumber: string;
    invoiceNumber: string;
    invoiceId: string;
    invoiceDate: Date | string;
    deliveryReceiptDate: Date | string;
    /**Montant total TTC */
    totalAmount: number;
    /**Montant total TVA */
    taxTotalAmount: number;
    /**Montant total HT de la réception  */
    receiptsAmountExcTax: number;
    /**Montant total des remises */
    discountTotalAmount: number;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    purchaseUnitPrice: number;
    salePrice: number;
    expiryDate: Date | string | null;
    packing: number;
    packingNumber: number;
    pfs: number;
    ppa: number;
    /**vrac */
    bulk: number;
    vendorBatchNumber: string;
    internalBatchNumber: string;
}