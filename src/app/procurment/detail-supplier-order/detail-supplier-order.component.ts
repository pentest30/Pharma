import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Navigation, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { loadCldr } from '@syncfusion/ej2-base';
import { SupplierOrderService } from 'src/app/services/supplier-order.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { DetailSupplierInvoiceComponent } from '../detail-supplier-invoice/detail-supplier-invoice.component';

@Component({
  selector: 'app-detail-supplier-order',
  templateUrl: './detail-supplier-order.component.html',
  styleUrls: ['./detail-supplier-order.component.sass']
})
export class DetailSupplierOrderComponent implements OnInit {

  navigation: Navigation;
  isLoading: boolean = false;
  supplierOrder: any;
  @ViewChild('detailgrid') public grid: GridComponent;
  gridLines: string;

  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 350 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      default:
        break;
    }
  }
  constructor(
    public router: Router,
    private calculHelper: CalculMethodHelper,
    private supplierOrderService: SupplierOrderService,

    private dialogRef: MatDialogRef<DetailSupplierInvoiceComponent>,
     @Inject(MAT_DIALOG_DATA) private data,
  ) { 
    loadCldr(require('./../../shared/trans.json'));
    loadCldr(require('./../../sales/numbers.json'));
  }

  async ngOnInit(): Promise<void> {
    this.gridLines = 'Both';
    try { 
      this.supplierOrder = this.data.supplierOrder;
      this.isLoading = true;
    } catch (error) {
      this.isLoading = false;
    }
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }

  close() {
    this.dialogRef.close();
  }
  getTotalHt(orderItem) {
    return this.calculHelper.getTotalHt(orderItem.unitPrice, orderItem.quantity);
  }

  getTotalTva(orderItem) {
    let ht = this.calculHelper.getTotalHt(orderItem.unitPrice , orderItem.quantity);
    let totalDiscount = this.calculHelper.getTotalDiscount(orderItem.discount * 100, orderItem.extraDiscount * 100, ht);
    return this.calculHelper.getTotalTva(orderItem.tax, ht, totalDiscount);
  }
  getTotalDiscount(orderItem) {
    let ht = this.calculHelper.getTotalHt(orderItem.unitPrice , orderItem.quantity);
    return this.calculHelper.getTotalDiscount(orderItem.discount * 100, orderItem.extraDiscount * 100, ht);
  }
  getTotalTTC(orderItem) {
    return this.calculHelper.getTotalTTC(orderItem.unitPrice,orderItem.quantity, orderItem.discount, orderItem.extraDiscount, orderItem.tax);
  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 350;
  }

}
