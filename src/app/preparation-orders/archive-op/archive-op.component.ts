import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridComponent, GroupSettingsModel, RowSelectEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, ODataAdaptor, Predicate, ReturnOption  } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { AddOpAgentsComponent } from '../add-op-agents/add-op-agents.component';
import { OpConsolidationComponent } from '../op-consolidation/op-consolidation.component';
import { PreparationOrderDetailComponent } from '../preparation-order-detail/preparation-order-detail.component';
import { PreparationOrderEditionComponent } from '../preparation-order-edition/preparation-order-edition.component';

@Component({
  selector: 'app-archive-op',
  templateUrl: './archive-op.component.html',
  styleUrls: ['./archive-op.component.sass']
})
export class ArchiveOpComponent  extends BaseComponent  implements OnInit {

  gridLines: string;
  data: DataManager;
  filters: object = {};
  public dropStates: string[] = ["En préparation","Préparé","Contrôlé","Consolidé","En Zone d'expédition","Commande annulée"]
  public fields: object = { text: 'preparationOrderStatus', value: 'preparationOrderStatus' };
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  isOpen: any;
  barcodeFormControl = new FormControl(); 
  barCode: string ="";
  EditByScan: boolean = false;
  groupOptions: GroupSettingsModel;
  @ViewChild('groupSettingsCaptionTemplate') public template: any; 
  constructor(
    private authService : AuthService,
    private orderPreparationService : PreparationOrdersService,
    private notif: NotificationHelper,
    private dialog: MatDialog,
    private permService: PermissionService,
    private router: Router
  ) { 
    super(authService,"preparationOrders/");
  }

  ngOnInit(): void {
    this.gridLines = "Both";
    this.groupOptions = { showDropArea: true };

    this.loadData();
    this.selectionOptions = { checkboxMode: 'ResetOnRowClick'};
 

  }
  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "preparationOrders" + "/archive/search",
      adaptor: new UrlAdaptor(),
  
      headers: [{ Authorization: "Bearer " + this.authService.getToken, "barCode":this.barCode }],
    });
  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 350;
  }
  async printBl(row) {
    await this.orderPreparationService.printBl(row.id).toPromise();
    this.notif.showNotification('mat-warn',"BL" + row.PreparationOrderNumberSequence+ "Imprimé avec succès",'top','right');
    // this.loadData();
  }
  async printSelectedBl() {
    const selectedrecords: any[] = this.grid.getSelectedRecords();  // Get the selected records.
    console.log(selectedrecords);
    let Bls = [];
    for (let index = 0; index < selectedrecords.length; index++) {
      const element = selectedrecords[index];
      Bls.push(element.id);
    }
    await this.orderPreparationService.PrintBulkBl({ids : Bls}).toPromise();
    this.notif.showNotification('mat-warn',"BLs Selectionnés Imprimés avec succès",'top','right');
  }
  async printPendingBl() {
    await this.orderPreparationService.printPendingBl(this.filters).toPromise();
    this.notif.showNotification('mat-warn',"BLs en attente Imprimés avec succès",'top','right');
    // this.loadData();

  }
  // begin(args): any { 
  //   if(args.requestType === "filtering") { 
  //     console.log(args);
  //     args.columns.forEach(element => {
  //       console.log(element.properties.field,element.properties.value);
  //       Object.assign(this.filters, { [element.properties.field ]: element.properties.value});
  //       console.log(this.filters);
  //     });
  //   } 
  // } 
  complete(args): any { 
    if(args.requestType === "filtering") { 
      console.log(args);
    } 
  } 
  rowSelected(args: RowSelectEventArgs) {
  }
  async view(order) {
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      bl: Bl, 
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal'
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(PreparationOrderDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;

      });
    }
  }

  async edit(order) {
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      bl: Bl, 
      pickingZoneId : order.pickingZoneId,
      pickingZoneName: order.pickingZoneName
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(PreparationOrderEditionComponent, dialogConfig);
      this.isOpen = true;
      this.EditByScan = false;
      this.barcodeFormControl.setValue("");
      this.barCode = '';
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.loadData();
      });
    }
  }
  async getEditZone(barCode) {
    this.barCode = barCode;
    this.loadData();
    console.log(this.data);
    this.grid.selectedRowIndex = 0;

    this.EditByScan = true;
  }
  async addExecuterController(op) {
    var Bl = await this.orderPreparationService.getById(op.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      bl: Bl, 
      pickingZoneId : op.pickingZoneId,
      pickingZoneName: op.pickingZoneName
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(AddOpAgentsComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.loadData();
      });
    }
  }
  consolidate(row) {
    console.log(row);
    this.router.navigate(['/preparation-orders/consolidation-op'], { queryParams: { barecode: row.barCode } });


  }
  control(row) {
    console.log(row);
    this.router.navigate(['/preparation-orders/form-op'], { queryParams: { barecode: row.barCode+row.pickingZoneOrder } });

  }
  ship(row) {
    console.log(row);
    this.router.navigate(['/preparation-orders/expedition-op'], { queryParams: { orderIdentifier: row.orderIdentifier } });

  }
}
 