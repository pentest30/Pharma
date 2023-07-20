export class TransferLogItem {
    transferLogId : string;
    productCode : string;
    productName : string; 
    internalBatchNumber : string;
    quantity : number;
    expiryDate : Date;
    zoneSourceName  :string;
    zoneDestName  :string;
    stockStateName : string
}
 export class TransferLog {
    transferLogSequenceNumber :string;
    id: string;
    zoneId: string;
    zoneDestId: string;
    stockStateId: string;
    items : TransferLogItem[] = [];

 }