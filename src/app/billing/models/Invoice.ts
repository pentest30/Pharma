import { InvoiceItem } from "./InvoiceItem";

    export class Invoice  {
        organizationId: string;
        id: string;

        orderId: string;
        invoiceId: string;

        deliveryOrderId: string;
        invoiceDate: Date | string;
        
        orderDate: Date | string;
        
        orderNumber: number;
        
        customerId: string;
        
        customerName: string;
        
        customerAddress: string;
        
        customerCode: string;

        supplierId: string;
        
        sequenceNumber: number;
        
        totalPackage: number;
        
        totalPackageThermolabile: number;

        invoiceType: number;
        
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
       
        dueDate: Date | string;
        
        numberDueDays: number;

        numberOfPrints: number;
        
        printedBy: string;
        
        printedByName: string;

        invoiceItems: InvoiceItem[];
    }
