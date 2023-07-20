import { DeleiveryOrderItem } from "./DeleiveryOrderItem";

export class DeleiveryOrder  
{
    id: string;      
    orderId: string;      
    deleiveryOrderDate: Date | string;
    orderDate: Date | string;

    customerId: string;
    organizationId: string;

    customerName: string;
    supplierId: string;
    totalPackage: number;
    totalPackageThermolabile: number;
    deleiveryOrderNumberSequence: number;
    /**
     * gets or sets deleivery order status
     * validated == true, canceled == false
     */
    validated: boolean;
    createdBy: string;
    updatedBy: string;
    deleiveryOrderItems: DeleiveryOrderItem[];
    OrderIdentifier:string;
    CodeAx:string;

}

export class CreateDeleiveryOrderCommand {
    orderId: string;
}