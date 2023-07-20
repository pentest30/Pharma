export class Discount  {
    id: string | null;
    organizationId: string;
    productId: string;
    thresholdQuantity: number;
    discountRate: number;
    from: Date | string;
    to: Date | string;
    productFullName: string;
    fromDateShort: string;
    toDateShort: string;
}