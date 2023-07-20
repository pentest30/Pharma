import { Injectable } from "@angular/core";
import { SalesModule } from "../sales/sales.module";

@Injectable()
export class CalculMethodHelper {
 
  
   // Method for Procurment Module 
    calculWholesaleMargin(discountPurchasePrice, salesPrice) {
        let value = (salesPrice - discountPurchasePrice) / discountPurchasePrice;
        let result = (Math.ceil(value * 100)) / 100;
        return result;
    }
    calculPharmacistMargin(ppaHT, salesPrice) {
        let value = ((ppaHT - salesPrice) / salesPrice);
        let result = (Math.ceil(value * 100)) / 100;
        return result;
    }
    getDiscountPurchasePrice(purchaseUnitPrice: any, discount: any) {
        return purchaseUnitPrice - (purchaseUnitPrice * discount);
    }
    calculUg(quantity, discount) {
        return eval(quantity.toString()) * discount ;
    }
    //%remise=1-(1/(1+%UG))
    calulTauxUg(discount) {
        return (discount / (1 - discount));
    }
    // Calcul Hors Tax 
    getTotalHt(unitPrice, quantity) {
        return (parseFloat)((unitPrice * quantity).toFixed(2));
    }
    // Calcul total Discount (La somme des remises ) les remise en pourcentage (20% ...)
    getTotalDiscount(discount, extraDiscount, totalht) {
        let extraDiscountValue = (extraDiscount == undefined) ? 0 : extraDiscount / 100;
        let discountValue = (discount == undefined || discount == null) ? 0 : discount / 100;
        return (parseFloat)(((discountValue + extraDiscountValue) * totalht).toFixed(2));
    }
    // Get total tva 
    getTotalTva(tax: any, ht: number, totalDiscount: number) {
        return (tax ) * (ht - totalDiscount);
    }

    getTotalDiscountCart(rows: any[]) {
        let totalDiscount= 0;
        for (let index = 0; index < rows.length; index++) {
          const element = rows[index];
          let ht = this.getTotalHt(element.unitPrice , eval(element.quantity.toString()));
          let totalDiscountLine = this.getTotalDiscount(element.discount, element.extraDiscount, ht);
          totalDiscount = totalDiscount + totalDiscountLine;
        }
        return (parseFloat)(totalDiscount.toFixed(2));
    }
    getTotalTVACart(rows:any[]) {
        let totalTVA= 0;
        for (let index = 0; index < rows.length; index++) {
          const element = rows[index];
          let ht = this.getTotalHt(element.unitPrice , eval(element.quantity.toString()));
          let totalDiscount = this.getTotalDiscount(element.discount, element.extraDiscount, ht);
          let totalTva = this.getTotalTva(element.tax, ht, totalDiscount);
          totalTVA = totalTVA + totalTva;
        }
        return (parseFloat)(totalTVA.toFixed(2));
    }
    getTotalTTC(unitPrice, quantity, discount, extraDiscount, tax) {
        let ht = this.getTotalHt(unitPrice , eval(quantity.toString()));
        let totalDiscount = this.getTotalDiscount(discount, extraDiscount, ht);
        let totalTva = this.getTotalTva(tax, ht, totalDiscount);
        return ht - totalDiscount + totalTva;
    }
    getTotalTTCCart(rows: any[]) {
        let totalTTC = 0;
        for (let index = 0; index < rows.length; index++) {
          const element = rows[index];
          totalTTC = totalTTC + this.getTotalTTC(element.unitPrice, eval(element.quantity.toString()), element.discount, element.extraDiscount, element.tax);
        }
        return (parseFloat)(totalTTC.toFixed(2));
    }
    calculPpaPFS(ppaTTC: any, pfs: any) {
        return ppaTTC + pfs;
    }
    calculPpaTTC(tax: any, ppaHt: any) {
        let value = (parseFloat) ((((tax == null ? 1 : tax)  * parseFloat(ppaHt))  + parseFloat(ppaHt)).toFixed(3));
        return value;
    }
}