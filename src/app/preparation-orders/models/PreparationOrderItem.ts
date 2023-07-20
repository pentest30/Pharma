export class PreparationOrderItem {
    id: string | null;
    orderId: string | null;
    productId: string;
    productName: string;
    productCode: string;
    quantity: number;
    internalBatchNumber: string;
    discount: number;
    extraDiscount: number;
    pickingZoneId: string | null;
    pickingZoneName: string;
    zoneGroupId: string | null;
    zoneGroupName: string;
    pickingZoneOrder: number;
    defaultLocation: string;
    expiryDate: Date | string | null;
    ppaHT: number;
    packing: number;
    packingQuantity: number | null;
    status: number;
    isControlled: boolean;
    controlError:string|null;
    previousInternalBatchNumber:string

}
export enum StripedLineReason {
    NotAvailable = 10,
    BatchInputError = 20,
    ExpirationDateSoon= 30,
    DamagedProduct = 40,
    CommercialDecision = 50,
    DtDecision = 60,
    BatchRecall = 70,
    InputBeforeReceipt = 80,
    NotTransferred = 90,
    SystemError = 100

}