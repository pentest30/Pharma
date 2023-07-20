import { DeliveryReceipt } from "./DeliveryReceipt";
import { SupplierInvoiceItem } from "./SupplierInvoiceItem";
import { SupplierOrder } from "./SupplierOrder";

export class SupplierInvoice  {
    id: string;
    /**///  */
    invoiceDate: Date | string;

    /**gets or sets customer id */
    customerId: string;

    /**gets or sets customer's name */
    customerName: string;

    /**gets or sets supplier id */
    supplierId: string;

    /**gets or sets supplier name */
    supplierName: string;

    /**gets or sets order status */
    invoiceStatus: number;

    /**///  */
    expectedDeliveryDate: Date | string | null;

    /**gets or sets document's reference */
    refDocument: string;
    /**///  */

    invoiceNumber: string;
    /**///  */

    order: SupplierOrder;
    /**///  */
    orderId: string;
    /**motant total */
    totalAmount: number;
    /**Montant des réceptions */
    totalAmountExlTax: number;
    receiptsAmount: number;

    remainingAmount: number;
    items: SupplierInvoiceItem[];
    receipts: DeliveryReceipt[];
}
export class GetInternalBnInvoiceQuery {
    vendorBatchNumber: string;
    supplierId: string;
    productId: string;
}