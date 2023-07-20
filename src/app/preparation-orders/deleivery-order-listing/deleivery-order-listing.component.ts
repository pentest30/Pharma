import { Component, OnInit, ViewChild } from '@angular/core';
import { CommandClickEventArgs, GridComponent, GridModel } from '@syncfusion/ej2-angular-grids';
import { DeleiveryOrder } from '../models/DeleiveryOrder';
import { DeleiveryOrderItem } from '../models/DeleiveryOrderItem';
import { DataManager, UrlAdaptor, Query, ODataAdaptor, Predicate, ReturnOption  } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { DeleiveryOrderService } from 'src/app/services/deleivery-order.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from 'src/app/services/permission.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-deleivery-order-listing',
  templateUrl: './deleivery-order-listing.component.html',
  styleUrls: ['./deleivery-order-listing.component.sass']
})
export class DeleiveryOrderListingComponent extends BaseComponent implements OnInit {

  gridLines: string;
  isBuyer: boolean;
  isBuyerGroup: boolean;
  isOpen: any;
  data: DataManager;
  totalHtt: number;
  total: number;
  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('detailgrid') public detailgrid: GridComponent;
  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'deleiveryOrderId',
    columns: [
        { field: 'deleiveryOrderId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'productCode', headerText: 'Code produit', width: 150 },
        { field: 'productName', headerText: 'Nom', width: 250 },
        { field: 'vendorBatchNumber', headerText: 'Lot Fr', width: 150  },
        { field: 'internalBatchNumber', headerText: 'Lot Int', width: 150 },
        { field: 'unitPrice', headerText: 'P.V', width: 150 , type:"number", format:"N2"},
        { field: 'discount', headerText: 'Remise', width: 150, type:"number", format:"N2"  },
        { field: 'tax', headerText: 'tax', width: 150 , type:"number", format:"N2"},
        { field: 'quantity', headerText: 'Qnt', width: 150 },
        { field: 'pfs', headerText: 'SHP', width: 150 , type:"number", format:"N2"},
        { field: 'ppaHT', headerText: 'PPA HT', width: 150 , type:"number", format:"N2"},
        { field: 'expiryDate', headerText: 'DDP', width: 150 ,format:'dd/MM/yyyy', type:'date'},
    ],
};
  commandListing: { type: string; title: string; buttonOption: { iconCss: string; cssClass: string; }; }[];
  constructor(
    private authService : AuthService,
    private invoiceService : InvoiceService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private permService: PermissionService,
    private route: Router
  ) {
    super(authService,"deleivery-orders/");
  }

  ngOnInit(): void {
    this.commandListing = [
      { type: 'None',title:'Générer Facture',  buttonOption: { iconCss: 'e-icons e-file', cssClass: 'e-flat'} },
  
    ];
    this.loadData();
    this.isBuyer = this.permService.isBuyer();
    this.isBuyerGroup = this.permService.isBuyerGroup();
  }
  add() {
  
  }
  ListingCommandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.title == 'Générer Facture') this.generateInvoice(args.rowData);

  }
  public dataBound(e) {
    this.total = 0;
    this.totalHtt = 0;

    var details :  DeleiveryOrderItem[] = [];
    for (let index = 0; index < this.grid.getCurrentViewRecords().length; index++) {
      const element = this.grid.getCurrentViewRecords()[index] as DeleiveryOrder;

      for (let index = 0; index < element.deleiveryOrderItems.length; index++) {
        const item = element.deleiveryOrderItems[index];
        details.push(item);
        
      }
    }
    this.childGrid.dataSource = details;
    this.grid.selectRow(0);
    this.grid.height = window.innerHeight - 300;
  }
  async generateInvoice(row) {
    await this.invoiceService.add(row.id).toPromise();
    this.notif.showNotification('mat-success','Facture généreé avec succès','top','right');

  }
}
