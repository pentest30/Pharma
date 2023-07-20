import { DeliveryReceiptItem } from "./DeliveryReceiptItem";
import { SupplierInvoice } from "./SupplierInvoice";

export class DeliveryReceipt {
        id: string;
        docRef: string;
        deliveryReceiptNumber: string;
        invoiceNumber: string;
        invoiceId: string;
        invoice: SupplierInvoice;
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
        status: number;
        items: DeliveryReceiptItem[];
        organizationId: string;
        deliveryReceiptSequenceNumber: number;

    }