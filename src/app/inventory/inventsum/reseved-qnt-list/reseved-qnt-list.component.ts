import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reseved-qnt-list',
  templateUrl: './reseved-qnt-list.component.html',
  styleUrls: ['./reseved-qnt-list.component.sass']
})
export class ResevedQntListComponent extends BaseComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  data: DataManager;
  loading : boolean = false;
  constructor( private _auth: AuthService,private ordersService:OrdersService  ) {
    super(_auth, "");
   
   }
  toolbar  : any [];
  ngOnInit(): void {
    this.loadData();
    this.toolbar =  ['ExcelExport'];
  
  }
  loadData() {
    this.loading = true;
    this.ordersService.getAllPendingOrdersDetails().subscribe((resp) => {
      this.grid.dataSource = resp;
      this.loading = false;
    });
  }
  
  public toolbarClick(args: any): void {   
    this.grid.excelExport();
}
}
