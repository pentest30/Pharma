import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Navigation, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { enableRipple, L10n, loadCldr, setCulture } from '@syncfusion/ej2-base';
import { OrdersService } from 'src/app/services/orders.service';
import { CalculMethodHelper } from 'src/app/shared/CalculMethodHelper';
import { Order } from '../sales-models/Order';
import { OrderItem } from '../sales-models/orderItem';
import * as EJ2_LOCALE from "@syncfusion/ej2-locale/src/fr.json";

loadCldr(
  require('cldr-data/main/fr/numbers.json'),
  require('cldr-data/main/fr/ca-gregorian.json'),
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/fr/timeZoneNames.json'),
  require('cldr-data/supplemental/weekData.json'),
  require('cldr-data/main/fr/units.json'),
  require('cldr-data/main/fr/layout.json'),
  require('cldr-data/main/fr/measurementSystemNames.json'),
);
enableRipple(true);
setCulture("fr"); // Change the Grid culture 
L10n.load({fr: EJ2_LOCALE.fr});
@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.sass']
})
export class OrderDetailComponent implements OnInit {
  
  navigation: Navigation;
  isLoading: boolean = false;
  order: any;
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
    private orderService: OrdersService,
    private calculHelper: CalculMethodHelper,
    private dialogRef: MatDialogRef<OrderDetailComponent>,
     @Inject(MAT_DIALOG_DATA) private data,
  ) { 
    loadCldr(require('./../../shared/trans.json'));
    loadCldr(require('./../../sales/numbers.json'));
  }

  ngOnInit(): void {
    this.gridLines = 'Both';
    try { 
      this.order = this.data.order;
      this.isLoading = true;
    } catch (error) {
      this.isLoading = false;
    }
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  async getOrder(id) {
    this.order = await this.orderService.GetOrderById(id).toPromise();
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
