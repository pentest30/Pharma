import * as internal from "stream";
import { SupplierOrderItem } from "./SupplierOrderItem";

export class SupplierOrder  {
        id: string;

        /**gets or sets order date */
        orderDate: Date | string;

        /**gets or sets customer id */
        customerId: string;

        /**gets or sets customer's name */
        customerName: string;

        /**gets or sets supplier id */
        supplierId: string;

        /**gets or sets supplier name */
        supplierName: string;

        /**gets or sets order status */
        orderStatus: number;

        /**///  */
        expectedDeliveryDate: Date | string | null;

        /**gets or sets document's reference */
        refDocument: string;

        /**///  */
        psychotropic: boolean;

        /**///  */
        orderItems: SupplierOrderItem[];
        orderTotal: any;
        orderDiscount: any;
        supplierOrderNumberSequence: number;

        /**///  */
    }