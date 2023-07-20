import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridComponent, GridModel, GroupSettingsModel, RowSelectEventArgs, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, ODataAdaptor, Predicate, ReturnOption  } from "@syncfusion/ej2-data";
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { PreparationOrderDetailComponent } from '../preparation-order-detail/preparation-order-detail.component';
import { PreparationOrderEditionComponent } from '../preparation-order-edition/preparation-order-edition.component';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { AddOpAgentsComponent } from '../add-op-agents/add-op-agents.component';

@Component({
  selector: 'app-controlled-op',
  templateUrl: './controlled-op.component.html',
  styleUrls: ['./controlled-op.component.sass']
})
export class ControlledOpComponent implements OnInit {
  gridLines: string;
  data: DataManager;
  filters: object = {};
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid') public grid: GridComponent;
  isOpen: any;
  barcodeFormControl = new FormControl();
  @ViewChild('barcodeRef') barcodeRef: ElementRef;

  barCode: string ="";
  EditByScan: boolean = false;
  items: any;
  blByOrder: any;
  loading: boolean;
  filterSettings: { type: string; };
  public groupOptions: GroupSettingsModel;
  @ViewChild('groupSettingsCaptionTemplate') public template: any;

  public childGrid: GridModel = {
    dataSource: [],
    queryString: 'orderId',
    width : "47%",
    columns: [
        { field: 'orderId', headerText: 'N°', textAlign: 'Right', width: 80 , visible : false},
        { field: 'barCode', headerText: 'Code barre', width: 100 },
        { field: 'pickingZoneName', headerText: 'N° lot', width: 100 },

    ],
  };
  constructor(
    private authService : AuthService,
    private orderPreparationService : PreparationOrdersService,
    private notif: NotificationHelper,
    private orderService : OrdersService,
    private dialog: MatDialog,
    private permService: PermissionService
  ) { }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key == 'F1') {
      event.preventDefault();
      this.barcodeRef.nativeElement.focus();
    }
  }
  ngOnInit(): void {
    this.groupOptions = {};// captionTemplate: this.template, columns: ['orderIdentifier'] };

    this.gridLines = "Both";
    this.loadData();
    this.selectionOptions = { }//checkboxMode: 'ResetOnRowClick'};
  }
  loadData() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "preparationOrders" + "/control/search",
      adaptor: new UrlAdaptor(),

      headers: [{ Authorization: "Bearer " + this.authService.getToken, "barCode":this.barCode }],
    });

  }

  begin(args): any {

    if(args.requestType === "filtering") {
      console.log(args);
      if(!args ||!args.columns)
      return;
      if(args.columns.length) {
        args.columns.forEach(element => {
          let value = element.properties.value;
          if(element.properties.field == "orderIdentifier") {
            let str = element.properties.value.split("/");
            value = str[1].replace(/^0+/, '');
            this.grid.filterByColumn('orderIdentifier', 'equal', value);
          }
          Object.assign(this.filters, { [element.properties.field ]: value});
        });
      }
    }
  }
  complete(args): any {
    console.log(args);
    if(args.requestType === "filtering") {

    }
    if(args.requestType === "refresh") {
      let row ;
      console.log(args, this.data);

      if(args.rows && args.rows.length > 0)
      row = args.rows.shift();

      if(row && this.EditByScan) {
         this.edit(row.data);
      }
    }

  }
  rowSelected(args: RowSelectEventArgs) {
    console.log(args.data);

  }
  public dataBound(e) {
    this.barcodeRef.nativeElement.focus();
    this.grid.height = window.innerHeight - 400;
    // if(this.grid)
    // this.grid.groupColumn("orderId");
    // this.grid.refresh();

  }
  async view(order) {
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bl: Bl,
      pickingZoneId : order.pickingZoneId,
    };
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(PreparationOrderDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.barcodeRef.nativeElement.focus();

      });
    }
  }

  async edit(order) {
    if(this.grid.getSelectedRecords().length==0)
    {
      this.grid.selectedRowIndex=order.index
    
    }
    if(this.barCode!='' &&this.EditByScan)
    {
    order = await this.orderPreparationService.getByBarCode(this.barCode).toPromise();
    if (!order) return;
    this.grid.selectRow(0);
    let temp= 
    JSON.parse(JSON.stringify(this.grid.getSelectedRecords()[0]))
    order.pickingZoneId=temp['pickingZoneId']
    order.pickingZoneName=temp['pickingZoneName']
    //20000000125019
    }
    // else
    // {
    //   let test=this.grid.getSelectedRecords();
    //   let temp =JSON.parse(JSON.stringify(this.grid.getSelectedRecords()[0]))
    //   order.pickingZoneId=temp['pickingZoneId']
    //   order.pickingZoneName=temp['pickingZoneName']
    // }
    this.EditByScan=false; 
 
    var Bl = await this.orderPreparationService.getById(order.id).toPromise();

    // var Bl = await this.orderPreparationService.getById(order.id).toPromise();
    console.log(Bl, order.pickingZoneName);
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
        if(res ==null) this.loadData();
        this.barcodeRef.nativeElement.focus();
      });
    }
  }
  async getEditZone(barCode) {
    this.barCode = barCode; 

    this.loadData(); 
    this.grid.selectedRowIndex = 0;
    this.grid.selectRow(0);

    this.EditByScan = true; 
    // this.edit(null);
  } 
  checkLastBl(order) {
    let groupedItemsByProduct = this.groupBy(order.orderItems);

    let isQuantityCorrect = [];
    groupedItemsByProduct.forEach(element => {
      const sumByProduct = this.items.filter(c => c.productId == element.productId && c.status != 20).reduce((sum, currentValue) => {
        return sum + currentValue.quantity;
      }, 0);
      console.log(sumByProduct  , element.controlled , element.initial);
      if(element.controlled != element.initial && sumByProduct + element.controlled > element.initial ) {
        isQuantityCorrect.push(false);
        this.notif.showNotification('mat-warn',"Les quantité du produit depasse celle du bon de commande",'top','right');
      } else isQuantityCorrect.push(true);

    });
    console.log(isQuantityCorrect);
    if(isQuantityCorrect.find(ele => !ele) != null ) return false; else return true;
  }
  canSaveOrAdd(order) {
    let canSave = [];
    this.items.map(ele => {
      let qte = this.getQuantityMaxToAdd(ele.productId,order);
      canSave.push(qte);
    });
    console.log(canSave)

    if(canSave.find(ele => ele < 0) == null) {
      //this.errorMessage = 'Barrer au moins une ligne / ou quantité insufisante';
      return true;

    }
    else return false;
  }
  getQuantityMaxToAdd(productId: any,order) {
    let groupedItemsByProduct = this.groupBy(order.orderItems);
    console.log(groupedItemsByProduct);
    let quantity = 0;
    let find = groupedItemsByProduct.find(c => c.productId == productId);
    this.items.forEach(element => {
      if(element.productId == productId && element.status != 20) quantity+= element.quantity;
    });
    console.log(find.quantity, quantity)

    return (find.quantity == 0) ? 0 : find.quantity - quantity
  }
  groupBy(list) {
    var result = [];
    let controlledOrderItem = this.blByOrder.items;

    list.forEach(element => {
      let quantityControlled = 0;
      let controlledOrderItemByProduct = controlledOrderItem.filter(e => e.productId == element.productId && e.isControlled)

      controlledOrderItemByProduct.forEach(e => {
        if(e.status != 20 ) quantityControlled+=e.quantity;
      });
      // Add their sum of ages
      var listByProduct = list.filter( c => c.productId == element.productId);

      const sumOfQuantity = listByProduct.reduce((sum, currentValue) => {
        return sum + currentValue.quantity;
      }, 0);

      const minDiscount = listByProduct.reduce((min, currentValue) => {

        if(currentValue.discount < min) min = currentValue.discount;
        return min;
      }, 100);
      let find = result.find(c => c.productId == element.productId);

      if(find == null) {
        result.push({
          productId : element.productId,
          productName : element.productName,
          quantity : sumOfQuantity - quantityControlled,
          initial: sumOfQuantity,
          controlled: quantityControlled,
          discount: minDiscount
        });
      }

    });
    return result;
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
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';    
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(AddOpAgentsComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
        this.loadData();
        this.barcodeRef.nativeElement.focus();

      });
    }
  }
  toggleSearch($event) {
    console.log($event);
    if($event.checked) this.filterSettings = { type : 'Menu'};
    else  this.filterSettings = { type: 'FilterBar' };
  }
  getRate(items, all) {
    let count = items.filter(c => c.countNotControlled != 0).length;
    return ((all -count) / all) * 100 ;
  }
}
