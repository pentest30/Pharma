import { Quota } from "./quota.model";

export  class ReservedQuota {
    quotas : Quota[] = [];
    quantityReserved : number;
    productId : string;
  requestId: any;
}