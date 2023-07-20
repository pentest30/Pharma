import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import {
  CommandClickEventArgs,
  CommandModel,
  EditSettingsModel,
  GridComponent,
  row,
  RowSelectEventArgs,
  ToolbarItem,
} from "@syncfusion/ej2-angular-grids";
import {
  ConfimDialogComponent,
  ConfirmDialogModel,
} from "src/app/confim-dialog/confim-dialog.component";
import { AuthService } from "src/app/services/auth.service";
import { OrdersService } from "src/app/services/orders.service";
import { SignalRService } from "src/app/services/signal-r.service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { Order } from "../sales-models/Order";

@Component({
  selector: "app-all-pending-orders",
  templateUrl: "./all-pending-orders.component.html",
  styleUrls: ["./all-pending-orders.component.sass"],
})
export class AllPendingOrdersComponent implements OnInit {
  public commandPending: CommandModel[];
  public commandPendingLine: CommandModel[];
  
  @ViewChild("grid2") public grid2: GridComponent;
  @ViewChild("detailgrid") public detailgrid: GridComponent;
  pendingOrder: Order[];
  public gridLines: any;
  public editSettings: EditSettingsModel;
  public quantityRules: object;

  public isLoading : boolean = false;
  selectedOrder: Order = null;
  public toolbar: any;
  constructor(
    private service: OrdersService,
    private notif: NotificationHelper,
    private dialog: MatDialog,  
    private signalRService :SignalRService,
    private _authService : AuthService

  ) {

  }

  async ngOnInit() {
    this.gridLines = "Both";
    this.toolbar =  ['ExcelExport'];
    this.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' };

    this.commandPending = [
      {
        type: "None",
        title: "supprimer",
        buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
      },
    ];
    this.commandPendingLine = [
      {
        type: "None",
        title: "supprimer",
        buttonOption: { iconCss: "e-icons e-delete", cssClass: "e-flat" },
      },
    ];
   
    this.loadData();

    this.signalRService.getPendingOrderMessage().subscribe(msg=> {
      
      if( msg.userId != this._authService.profile.sub ){
        var item = this.pendingOrder.find(x=>x.id == msg.orderId );
        if(item) {
          this.notif.showNotification('mat-warn','La commande N°' + item.orderNumber + ' a été modifiée. Veuillez actualiser le listing SVP.','top','right');
        }
         else   this.notif.showNotification('mat-warn','Une commande a été modifiée. Veuillez actualiser le listing SVP.','top','right');

      }
      

    });

    this.quantityRules = {required:[this.customQuantityValidationFn,"Valeur min  1"]};

  }
  customQuantityValidationFn(args) {
    if(eval(args.value) >= 1){ 
      return true; 
    } else {
      return false; 

    }

  }
  actionComplete(args) {
    let  oldQuantity ;
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      oldQuantity = args.rowData['quantity'];

    }
    if ((args.requestType === 'save')) {

      let lineOrder = Object.assign({}, args.rowData);
      lineOrder.quantity =  eval(args.data.quantity);
      lineOrder.orderId = this.selectedOrder.id;
      lineOrder.supplierOrganizationId = this.selectedOrder.supplierId;
      lineOrder.customerId = this.selectedOrder.customerId;
      lineOrder.createdByUserId = this.selectedOrder.createdByUserId;

      // if( eval(args.data.quantity) > args.rowData.quantity) {

      //   let rows = this.selectedOrder.orderItems.map(ele => {
      //     if(ele.id == lineOrder.id) return args.rowData 
      //     else return ele;
      //   });

      //   this.selectedOrder.orderItems = rows;
      //   this.detailgrid.dataSource = [];
      //   this.detailgrid.dataSource = this.selectedOrder.orderItems ;
      //   this.detailgrid.refresh();
      //   this.notif.showNotification('mat-success','Quantité Superieur à la quantité reservé par la commerciale','top','right');

      // } else {


      // }
      this.updatePendingLineOrder(lineOrder, args.rowData);
      this.detailgrid.refresh();
    }
  }
  async updatePendingLineOrder(lineOrder, oldLineOrder) {
    let lastVersionPendingOrder = <Order>await this.service.GetSalesPersonPendingOrder(this.selectedOrder.id, this.selectedOrder.customerId, this.selectedOrder.createdByUserId).toPromise();
    let lastVersionLine = lastVersionPendingOrder.orderItems.find(c => c.id == lineOrder.id);
    if(lastVersionLine.quantity != oldLineOrder.quantity) {
      this.notif.showNotification('mat-success','La quantité a été changée par un autre utilisateur','top','right');

      let rows = this.selectedOrder.orderItems.map(ele => {
        if(ele.id == lineOrder.id) return lastVersionLine 
        else return ele;
      });
      this.detailgrid.dataSource = [];
      this.detailgrid.dataSource = rows ;     
    } else {
      await this.service.updateItemV2(this.selectedOrder.id, lineOrder).toPromise();
      this.service.updateItemV2(this.selectedOrder.id, lineOrder).subscribe(result => {
        this.notif.showNotification('mat-success','Quantité mise à jour avec succès','top','right');
        let rows = this.selectedOrder.orderItems.map(ele => {
          if(ele.id == lineOrder.id) return lineOrder 
          else return ele;
        });
        this.detailgrid.dataSource = [];
        this.detailgrid.dataSource = rows ;
      }, (error) => {
        let rows = this.selectedOrder.orderItems.map(ele => {
          if(ele.id == lineOrder.id) return oldLineOrder 
          else return ele;
        });
        this.detailgrid.dataSource = [];
        this.detailgrid.dataSource = rows ;
        this.notif.showNotification('mat-warn',error,'top','right');
      });
    }
   
    this.detailgrid.refresh();      

  }

  loadData() {
    this.isLoading = true;
    this.service.getAllPendingOrdersForSupervisor().subscribe((resp) => {
      this.isLoading = false;
      this.pendingOrder = resp;
      if(this.grid2!=undefined)      
        this.grid2.refresh();
      if( this.detailgrid)
      this.detailgrid.refresh();
    });
  }
  rowSelected(args: RowSelectEventArgs) {
    var row = this.grid2.getSelectedRecords()[0];
    this.selectedOrder = row as Order;
    this.detailgrid.dataSource = [];
    let orderItems = (row as any).orderItems;
    orderItems.map(c => {
      c.quantity = c.quantity.toString();
      return c;
    });
    this.detailgrid.dataSource = orderItems;
    this.detailgrid.refresh();
  }
  async pendingCommandClick(args: CommandClickEventArgs) {
    if (args.commandColumn.title == "supprimer") {
      let confirm = await this.confirmDialog(
        "Êtes-vous sûr(e) de vouloir supprimer la commande?",
        false
      );
      if (confirm) {
        this.deletePendingOrder(args.rowData);
      }
    }
  }
  async pendingLineCommandClick(args: CommandClickEventArgs) {
    var count = this.selectedOrder.orderItems.length;

    let confirm =
      count > 1
        ? await this.confirmDialog(
            "Êtes-vous sûr(e) de vouloir supprimer cette ligne?",
            false
          )
        : await this.confirmDialog(
            "La suppression de cette ligne entraîne la suppression de la commande, Êtes-vous sûr(e) de vouloir continuer?",
            false
          );
    if (confirm && count > 1) {
      var item = args.rowData as any;
      item.quantity = -1 * item.quantity;
      item.orderId = this.selectedOrder.id;
      item.supplierOrganizationId = this.selectedOrder.supplierId;
      item.customerId = this.selectedOrder.customerId;
      item.createdByUserId = this.selectedOrder.createdByUserId;
      await this.service.updateItemV2(this.selectedOrder.id, item).toPromise();
    } else if (confirm) {
      await this.deletePendingOrder(this.selectedOrder);
    }
    this.loadData();
  }
  async deletePendingOrder(selectedOrder) {
    for (const element of selectedOrder.orderItems) {
      element.quantity = -1 * element.quantity;
      element.orderId = selectedOrder.id;
      element.supplierOrganizationId = selectedOrder.supplierId;
      element.customerId = selectedOrder.customerId;
      element.createdByUserId = selectedOrder.createdByUserId;
      element.pickingZoneOrder = 0;
      await this.service.updateItemV2(selectedOrder.id, element).toPromise();
    }
    this.service.cancelPendingOrder(selectedOrder).subscribe(
      (res) => {
        this.notif.showNotification(
          "mat-success",
          "La commande a été annulée avec succès",
          "top",
          "right"
        );
        let orders = this.pendingOrder.filter(
          (order) => order.id != selectedOrder.id
        );
        this.pendingOrder = orders;
        //this.dataSourceCachedOrders = new MatTableDataSource(this.cachedOrders);
      },
      (error) => {
        this.notif.showNotification("mat-success", error, "top", "right");
      }
    );
  }
  async confirmDialog(message, focusNo: boolean = true) {
    const dialogData = new ConfirmDialogModel(
      "Avertissement",
      message,
      focusNo
    );
    const dialogRef = this.dialog.open(ConfimDialogComponent, {
      maxWidth: "400px",
      data: dialogData,
    });

    let dialogResult = await dialogRef.afterClosed().toPromise();
    if (dialogResult) return true;
    else return false;
  }
  public toolbarClick(args: any): void {
    this.detailgrid.excelExport();
};
}
