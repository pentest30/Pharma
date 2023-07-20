import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-all-reserved-qnt',
  templateUrl: './all-reserved-qnt.component.html',
  styleUrls: ['./all-reserved-qnt.component.sass']
})
export class AllReservedQntComponent extends BaseComponent implements OnInit {
  toolbar  : any [];
  reservedQuantities : any = [];
  loading : boolean = false;
  @ViewChild('grid') public grid: GridComponent;
  constructor(private _auth: AuthService,private ordersService:OrdersService) { super(_auth, "")}

  async ngOnInit() {
    this.toolbar =  ['ExcelExport'];
    this.loading = true;
    this.reservedQuantities = await this.ordersService.getAllReservedQuantities().toPromise(); 
    this.loading = false;
  }
  toolbarClick($event) {
    this.grid.excelExport();
  }
}
