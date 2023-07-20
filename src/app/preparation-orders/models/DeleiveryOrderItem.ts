export interface DeleiveryOrderItem  {
    id: string;
    deleiveryOrderId: string | null;      
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    unitPrice: number;
    purchaseUnitPrice: number;
    discount: number;
    extraDiscount: number;
    tax: number;
    vendorBatchNumber: string;
    internalBatchNumber: string;
    expiryDate: Date | string | null;
    pfs: number;
    ppaHT: number;
}