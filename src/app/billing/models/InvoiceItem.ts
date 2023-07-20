export class InvoiceItem  {
  
    id: string | null;      

    invoiceId: string | null;      
    
    lineNum: number;

    productId: string;
    
    productCode: string;
    
    productName: string;
    
    vendorBatchNumber: string;
    
    internalBatchNumber: string;
    
    expiryDate: Date | string;
    
    quantity: number;
    pfs: number;
    ppaHT: number;
    ppaTTC: number;
    unitPrice: number;
    
    purchaseDiscountUnitPrice: number;
    unitPriceInclTax: number;
    
    discountRate: number;
    
    displayedDiscountRate: number;

    tax: number;
    
    totalTax: number;
    
    totalDiscount: number;
    
    displayedTotalDiscount: number;
    totalExlTax: number;
    totalInlTax: number;
  returnedQty: any;
    
}
