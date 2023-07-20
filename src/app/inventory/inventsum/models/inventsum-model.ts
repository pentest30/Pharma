

export class InventSum {
    id? :string ;
    organizationId?: string;
    organizationName?:string;
    productId?: string;
    productFullName?: string;
    productCode?: string;
    vendorBatchNumber ?: string;
    internalBatchNumber ?: string;
    productionDate ?:Date;
    expiryDate ?:Date;
    bestBeforeDate ?:Date;
    color ?: string;
    size ?: string;
    tax ?: number;
    purchaseUnitPrice ?:number
    purchaseDiscountRatio ?:number
    salesUnitPrice ?:number
    salesDiscountRatio ?:number
    physicalOnhandQuantity ?:number
    physicalAvailableQuantity ?:number
    physicalReservedQuantity ?:number
    totalPhysicalAvailableQuantity?:number;
    physicalDispenseQuantity? : number;
    isPublic ?:boolean;
    siteId ?: string;
    siteName ?: string;
    warehouseId ?: string;
    warehouseName ?: string;
    minThresholdAlert ?:number;
    packagingCode : string;
    packing : number;
    pfs : number;
    ppaHT: number;
    ppaTTC:number;
    ppaPFS : number
    
}