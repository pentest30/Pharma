export class TransactionType { 
    transactionTypeName: string;
    id: string;
    blocked: boolean;
    codeTransaction: TransactionTypeCode;

}
export enum TransactionTypeCode  {
    STOCK_ENTRY = 10,
    STOCK_RELEASE = 20,
    STOCK_ADJUSTMENT = 30,
    STOCK_TRANSFER = 40,
}