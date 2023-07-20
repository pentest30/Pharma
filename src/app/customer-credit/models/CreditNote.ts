import { CreditNoteItem } from "./CreditNoteItem";

export class CreditNote {
    id: string;
    organizationId: string;
    supplierId: string;
    productReturn: boolean;
    claimNumber: string;
    claimNote: string;
    claimDate: Date | string | null;
    creditNoteDate: Date | string;
    orderId: string;
    orderDate: Date | string;
    orderNumber: number;                
    invoiceId: string;
    onvoiceDate: Date | string;        
    invoiceNumber: string;        
    customerId: string;        
    customerName: string;        
    customerAddress: string;        
    customerCode: string;               

    sequenceNumber: number;        
    totalPackage: number | null;        
    totalPackageThermolabile: number | null;
    creditNoteType: string;
    
    totalTTC: number;        
    totalHT: number;        
    totalDiscount: number;
    totalDisplayedDiscount: number;
    totalTax: number;
    createdBy: string;        
    updatedBy: string;        
    sectorCode: string;        
    sector: string;        
    codeRegion: string;        
    region: string;       
    numberOfPrints: number;        
    printedBy: string;        
    printedByName: string;
    creditNoteItems: CreditNoteItem[];
    state: string;
    validatedByUserId: string | null;
    validatedOn: Date | string | null;
}