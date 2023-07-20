import { SupplierInvoice } from "./SupplierInvoice";

export class SupplierInvoiceItem  {
        id: string;
        invoiceId: string;
        productId: string;
        productName: string;
        productCode: string;
        quantity: number;
      
        expiryDate: Date | string | null;
        invoice: SupplierInvoice;
        vendorBatchNumber: string;
        internalBatchNumber: string;
        color: string;
        size: string;
        totalInlTax: number;
        totalExlTax: number;
        packagingCode: string;
        pickingZoneId: string | null;
        pickingZoneName: string;
        packing: number;
        pfs: number;
        ppaHT: number;
        ppaTTC: number;
        ppaPFS: number;
        purchaseUnitPrice: number;
        /**prix achat remisé */
        purchasePriceIncDiscount: number;
        /**taux de remise achat */
        discount: number;
        salePrice: number;
        /**marge fournisseur */
        wholesaleMargin: number;

        /**marge pharmacien */
        pharmacistMargin: number;

        /**quantité facturée */
        invoicedQuantity: number;

        /**quantité reçue */
        receivedQuantity: number;

        /**Quantité restante */
        remainingQuantity: number;
    }
    export class CreateInvoiceItemCommand {
        invoiceId: string;
        orderId: string;
        productId: string;
        quantity: number;
        supplierOrganizationId: string;
        minExpiryDate: Date | string | null;
        expectedDeliveryDate: Date | string | null;
        internalBatchNumber: string;
        productCode: string;
        psychotropic: boolean;
        documentRef: string;
        productName: string;
        vendorBatchNumber: string;
        expiryDate: Date | string | null;
        invoiceDate: Date | string;
        invoiceNumber: string;
        totalAmount: number;
        totalAmountExlTax: number;
        receiptsAmount: number;
        remainingAmount: number;
        pfs: number;
        ppaHT: number;
        ppaTTC: number;
        ppaPFS: number;
        wholesaleMargin: number;
        pharmacistMargin: number;
        invoicedQuantity: number;
        receivedQuantity: number;
        remainingQuantity: number;
        purchaseUnitPrice: number;
        /**prix achat remisé */
        purchasePriceIncDiscount: number;
        /**taux de remise achat */
        discount: number;
        salePrice: number;

        packing: number;
        color: string;
        size: string;
        pickingZoneId: string | null;
        pickingZoneName: string;
        packagingCode: string ;
        supplierId: string;

        /**gets or sets supplier name */
        supplierName: string;

    }