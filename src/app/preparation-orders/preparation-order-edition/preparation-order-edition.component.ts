import { ChangeDetectorRef, Component, HostListener, Inject, OnInit, Pipe, PipeTransform, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column, CommandClickEventArgs, CommandModel, Edit, EditEventArgs, EditSettingsModel, GridComponent, IEditCell, KeyboardEventArgs, RowSelectEventArgs } from '@syncfusion/ej2-angular-grids';

import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PreparationOrderItem } from '../models/PreparationOrderItem';
import * as uuid from 'uuid';
import { InventSumService } from 'src/app/services/inventory.service';
import { AutoComplete, DropDownList } from '@syncfusion/ej2-dropdowns';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { ProductService } from 'src/app/services/product.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { EditPreparationItemFormComponent } from '../edit-preparation-item-form/edit-preparation-item-form.component';
import { select } from '@syncfusion/ej2-base';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { PromptPackingComponent } from '../prompt-packing/prompt-packing.component';
import { AddOpAgentsComponent } from '../add-op-agents/add-op-agents.component';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-preparation-order-edition',
  templateUrl: './preparation-order-edition.component.html',
  styleUrls: ['./preparation-order-edition.component.sass']
})
export class PreparationOrderEditionComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  op: any;
  public quantityRules: object;
  public toolbarItems: object[] ;
  public editOptions: EditSettingsModel;
  public filterSettings: Object;
  
  public packingPickingZoneControl:any;
  public commands: CommandModel[];
  gridLines: string;
  dialogOpend: boolean = false;
  products: any = [];
  items: any = [];
  barredProduct: any= [];
  error: boolean = false;
  editableRowData: any;
  deepCloneItems: any = [];
  zones: any = [];
  currentZone: any;
  packingRules: { required: any[]; max: any[]; };
  nameRules: { required: any[]; };
  order: any;
  groupedItemsByProduct: any[] = [];
  blsOrder: Object;
  controlledOrderItem: PreparationOrderItem[] = [];
  blByOrder: any;
  errorMessage: string;
  filledProduct: any[] = [];
  blItem: PreparationOrderItem;
  batchs: any[] = [];
  quantityMax: number;
  public batchParams: IEditCell;
  public batchElem : HTMLElement;
  public batchObj : DropDownList;
  public fields: Object = { text: 'fullName', value: 'fullName' }; 
  public fieldsBatch: Object = { text: 'internalBatchNumber', value: 'internalBatchNumber' }; 
  index: any = 0;
  loading: boolean = false;
  canAddOrSave: boolean = true;
  customAttributes: { class: string; };
  setFocus: any;
  @ViewChildren(DropDownListComponent) childrenComponent: QueryList<any>;
  currentGroupZone: any;
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight ;//-480 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  } 
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private orderPreparationService : PreparationOrdersService,
    private orderService : OrdersService,
    private pickingZoneService : PickingZoneService,
    private inventoryService: InventSumService,
    private dialogRef: MatDialogRef<PreparationOrderEditionComponent>,
    private dialog: MatDialog,
    private notif : NotificationHelper,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogHelper: DialogHelper
  ) {
    this.gridLines = 'Both';
    this.toolbarItems = [
      { text: 'Dupliquer la ligne (F3 / +)', tooltipText: 'Dupliquer', id: 'addarticle' },
      { text: 'Barrer Ligne (-)', tooltipText: 'Barrer', id: 'deletearticle' },
      
      { text: 'Sauvgarder (F2)', tooltipText: 'Valider le contrôle', id: 'saveorder' },
      { text: 'Annuler (ESC)', tooltipText: 'Fermer', id: 'cancel' }

    ];
    // this.commands = [
    //   { type: 'None', buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'}},
    //   // { type: 'None', buttonOption: { iconCss: 'e-icons e-edit', cssClass: 'e-flat'} },

    // ];
    this.filterSettings = { type: 'Menu' };
    this.editOptions = { allowEditing: false, allowAdding: false,
       allowDeleting: false, mode: 'Normal',
    showDeleteConfirmDialog:true };
    this.quantityRules = {
      required:[this.customQuantityValidationFn,"Valeur min  1"],
      max: [this.customMaxValidation.bind(this), "Quantité Max"],
      moduloValidator:[this.customModuloPackingValidation.bind(this), "Quantité modulo colisage doit egale a 0"]
      };
     



      
    
  }

@HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.dialogOpend) return;
    
    switch (event.key) {
      case "*":
        event.preventDefault();
        var selectedData=this.grid.getSelectedRecords()[0];
        if( selectedData["isControlled"]==1) return;
        this.setFocus=this.grid.getColumnByField("quantity");      
        this.EditItem("quantity",selectedData,this.grid.selectedRowIndex,false,
        selectedData['internalBatchNumber'])  ;
        break;
      case "F3":
        case "+":
        event.preventDefault();
        this.addNewProduct();
        break;
      case "F2":
        event.preventDefault();
        this.save();
        break;
      // case "+":
      //   event.preventDefault();
      //   this.addNewProduct();
      //   break;
      case "-":
        case "Delete":
        event.preventDefault();
        let orderItem = this.items[this.grid.selectedRowIndex];
        this.delete(orderItem);
        break;
      case "Escape":
        
        event.preventDefault();
        this.close();
        break;
        case "Enter":
          let test =this.grid.selectedRowIndex;
          event.preventDefault();
          this.makeItControlled();
          break;
    }
  }
  isEditing:boolean=false;
  async ngOnInit() {
    // this.cachedProduct = (await this.dbService.getAll('products')).shift();
    this.customAttributes = {class: 'customcss'};
    this.op = this.data.bl; 
    this.op.preparationOrderExecuters=this.op.preparationOrderExecuters.filter(e=>e.pickingZoneId==this.data.pickingZoneId);
    this.op.preparationOrderVerifiers=this.op.preparationOrderVerifiers.filter(e=>e.pickingZoneId==this.data.pickingZoneId);
    this.items  = Object.assign(this.op.preparationOrderItems.filter
      (c => c.pickingZoneId == this.data.pickingZoneId));
      this.items=(<Array<PreparationOrderItem>>this.items).map(e=>
        {
        e.previousInternalBatchNumber=e.internalBatchNumber;
        return e;

        }
      );

    this.zones = await this.pickingZoneService.getAll().toPromise();
    this.op.pickingZoneId=this.data.pickingZoneId;
    this.op.pickingZoneName=this.data.pickingZoneName;
    this.blByOrder = (<any>await this.orderPreparationService.getBlByOrder(this.op.orderId, this.data.pickingZoneId).toPromise());
    this.controlledOrderItem = this.blByOrder.items;
    this.deepCloneItems = JSON.parse(JSON.stringify(this.items));
    this.order = await this.orderService.GetOrderById(this.op.orderId).toPromise();
    this.currentGroupZone = this.zones.find(ele => ele.zoneGroupId == this.op.zoneGroupId);
    this.currentZone = this.zones.find(ele => ele.id ==  this.data.pickingZoneId);
    this.groupedItemsByProduct = this.groupBy(this.order.orderItems);
          if(this.currentZone.zoneType==30)
      { 
        this.op.packingPickingZoneControl=this.packingPickingZoneControl=this.items
        .reduce((sum, current) => sum + current.quantity/current.packing, 0); 
      }

  }

  clickHandler(args: ClickEventArgs): void {
    if(this.loading) return;
    switch (args.item.id) {
      case 'addarticle':
        this.addNewProduct();
        break;
      case 'deletearticle':
        let opItem = this.items[this.grid.selectedRowIndex];
        this.delete(opItem);
        break;
      case 'saveorder':
        this.save();
        break;
      case 'cancel':
        this.close();
        break;
      default:
        break;
    }
  }
 
  customQuantityValidationFn(args) {
    if(args.value >= 1){
      return true;
    } else
    return false;
  }

  public dataBound(e) {
    if (this.index !== null) { 
      this.grid.selectRow(this.index); 
    } else this.grid.selectRow(0); 
    if(this.currentZone.zoneType==30)
    { 
      this.op.packingPickingZoneControl=this.packingPickingZoneControl=this.items
      .reduce((sum, current) => sum + current.quantity/current.packing, 0); 
    }
    // let changedHeight = this.grid.element.getBoundingClientRect().height - parseInt(this.grid.height as string); 
    //dynamically setting the grid height including header and footer 
    // this.grid.height = parseInt(this.grid.height as string) - changedHeight; 
   // this.grid.height = window.innerHeight - 350;

  }
  
  customMaxValidation(args) {
    return this.getQuantityMaxByProduct(parseInt(args.value));
  }

  getQuantityMaxByProduct(quantityEdited) {
    let quantityMax = 0;
    let quantity = 0; 
    // Check quantity is less then  packing quantity if zone is not origin
    if(this.editableRowData && this.editableRowData.packing != 0 && quantityEdited > this.editableRowData.packing && this.currentZone.zoneType == 40) return false ;
    // // Check Quantity modulo packing is always 0 if zone type is origin
    if(this.editableRowData.packing!=0  && quantityEdited % this.editableRowData.packing !=  0 && this.currentZone.zoneType == 30) return false ;
    if(quantityEdited > this.editableRowData.packing && this.currentZone.zoneType != 30&&this.currentZone.zoneType != 10 ) return false ;
    // Check Quantity cumulated by productis less then cumulated in order
    let items = this.items.filter(ele => ele.productId == this.editableRowData.productId && ele.status != 20);
    items.forEach(element => {
      if(element.id == this.editableRowData.id ) quantity+=quantityEdited;
      else  quantity+=element.quantity;
    });
    quantityMax = this.groupedItemsByProduct.find(ele => ele.productId == this.editableRowData.productId).quantity;
    if(quantity > quantityMax) return false;
    else return true;
  }
  customModuloPackingValidation(args) {

    // Check Quantity modulo packing is always 0 if zone type is origin
    if(parseInt(args.value) % this.editableRowData.packing !=  0 &&
     this.currentZone.zoneType == 30) return false ;

    else return true;

  }  
  public batchesParams : IEditCell;
 
 

  load(args){
    document.getElementsByClassName('e-grid')[0].addEventListener('keydown', this.keyDownHandler.bind(this));
    
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  keyDownHandler(e: KeyboardEventArgs) {
    if(this.loading) return;
    this.dialogOpend=true;
    if (e.key === 'F2') {
          e.preventDefault();
          // this.grid.endEdit();
          e.cancel = true;
    }
    this.dialogOpend=false;
  }
  keyPressed(e) {
 
    if (e.key === "Enter") {
      return;
    }
  
  }
  commandClick(args: CommandClickEventArgs): void {
    if(args.commandColumn.buttonOption.iconCss.includes("e-edit")) this.addLine(args.rowData);
    else this.delete(args.rowData)
  }
  async delete(row) {
    if(row.oldQuantity>row.quantity)
    {
      this.error = true;
      
      this.errorMessage = 'Ligne ne peut pas être barrée';
      
      return;
      }
    if(row.isControlled)
    {
    this.error = true;
    
    this.errorMessage = 'Ligne dèjà controlèe !';
    
    return;
    }
    if(row.status == 90 || row.oldQuantity==0) this.items = this.items.filter(ele => ele.id != row.id);
    else if(row.status == 30)
    this.items = this.items.filter(ele => ele.id != row.id);
    else {
 
      this.items.map(ele => {
        if( ele.id == row.id) {
          ele.status = 20;
          ele.isControlled=true;
          ele.controlError='';

        }
      });
    }
    this.filledProduct = <any[]>await this.fillProducts();
    this.canSaveOrAdd()

    this.items = [...this.items];

  }
  getQuantityMaxToAdd(productId: any) {
    let quantity = 0;
    if(!this.groupedItemsByProduct || this.groupedItemsByProduct==null || this.groupedItemsByProduct.length==0)
    this.groupBy(this.order.orderItems);
    let find = this.groupedItemsByProduct.find(c => c.productId == productId);
    this.items.forEach(element => {
      if(element.productId == productId && element.status != 20)
      {
         quantity+=parseInt(element.quantity)
         find.packing=element.packing;
      }
    });
    let qty=find.quantity;
    if( this.currentZone.zoneType!=10)
    {
    if  (this.currentZone.zoneType==30 )
      qty=parseInt(find.quantity ) -(parseInt(find.quantity) %   parseInt(find.packing) );
    else      
      qty=parseInt(find.quantity) %   parseInt(find.packing) ;
    }
      return qty -   quantity;
  }
  async onBatchSelection(selectedBatch) {
    this.items.map( ele => {

      if(ele.status == 90) {

        ele.expiryDate = selectedBatch.itemData.expiryDate;
        ele.internalBatchNumber = selectedBatch.itemData.internalBatchNumber;

        ele.discount = (selectedBatch.itemData.discount == null) ? 0 : selectedBatch.itemData.discount;
        ele.extraDiscount = selectedBatch.itemData.extraDiscount;
        ele.ppaHT = selectedBatch.itemData.ppaHT;
        ele.packing = selectedBatch.itemData.packing;
        ele.vendorBatchNumber = selectedBatch.itemData.vendorBatchNumber;
        console.log("QuantityMax",this.quantityMax);
        console.log("SelectedBatchPacking",selectedBatch);

        if(this.currentZone.zoneType == 10 || this.currentZone.zoneType == 20 ) {
          ele.quantity = this.quantityMax;
          ele.packingQuantity = Math.round(ele.quantity /  ele.packing);
        }
        if(this.currentZone.zoneType == 30 ) {
          if(selectedBatch.itemData.packing < this.quantityMax ){
            let packingQuantity = Math.floor(this.quantityMax /  ele.packing);
            ele.quantity = packingQuantity * selectedBatch.itemData.packing ;

          } else {
            ele.quantity = this.quantityMax;
          }
          ele.packingQuantity = Math.floor(ele.quantity /  ele.packing);
          this.items.map( ele => {
            if(ele.status == 90) {
              ele.quantity = parseInt(ele.quantity);
              if(this.canAddOrSave == true) this.addLine(ele);
              else this.error = true;
            }
          });

        }
        if(this.currentZone.zoneType == 40 ) {
          if(selectedBatch.itemData.packing < this.quantityMax )
          ele.quantity = selectedBatch.itemData.packing - 1

          else ele.quantity = this.quantityMax;
          ele.packingQuantity = 0;

        }
      }
    });
   this.grid.refresh();
   this.grid.selectedRowIndex = this.items.length - 1;
   this.grid.selectRow(this.grid.selectedRowIndex);

  }
  async rowSelected(args: RowSelectEventArgs) {
    

  }
  async onProductSelection(selectedProduct) {
    this.quantityMax = this.getQuantityMaxToAdd(selectedProduct.itemData.id);

    this.items.map(async ele => {
      if(ele.status == 90) {
        ele.productId = selectedProduct.itemData.productId;
        ele.productName = selectedProduct.itemData.productName;
        ele.productCode = selectedProduct.itemData.productCode;
        ele.defaultLocation = selectedProduct.itemData.defaultLocation;
        ele.pickingZoneId = this.currentZone.id;
        ele.pickingZoneName = this.currentZone.name;
        ele.zoneGroupId = this.currentZone.zoneGroupId;
        ele.zoneGroupName = this.currentZone.zoneGroup.name;

        this.batchs = await this.inventoryService.getStockForPreparation
        (this.op.organizationId, selectedProduct.itemData.productCode,selectedProduct.itemData.zoneName).toPromise();
      
      }
    })
    this.grid.selectedRowIndex = this.items.length - 1;
    this.grid.selectRow(this.grid.selectedRowIndex);
    this.index = this.grid.selectedRowIndex ;
    this.grid.refresh();

  }
  onChange() {
    this.canSaveOrAdd();
  }
  onQuantityChange(rawData) {
    console.log("QuantityChange",rawData.target.value);
    this.items.map( ele => {
      if(ele.status == 90) {
        ele.quantity = parseInt(rawData.target.value);
        if(this.canAddOrSave == true) this.addLine(ele);
        else this.error = true;
      }
    });
    this.grid.refresh();
    this.grid.selectedRowIndex = this.items.length - 1;
    this.grid.selectRow(this.grid.selectedRowIndex);
    this.index = this.grid.selectedRowIndex ;

  }
  addLine(row) {
    if(this.canAddOrSave == true ) {
      this.items.map( ele => {
        if(ele.status == 90) ele.status = 30;
      });
      this.grid.refresh();
      this.grid.selectedRowIndex = this.items.length - 1;
      this.grid.selectRow(this.grid.selectedRowIndex);  
      this.index = this.grid.selectedRowIndex ;

    }
   
  }
  makeItControlled()
  {
 

    let i=this.grid.selectedRowIndex;    
    if(this.items[i].status!=20)
    {
    this.items[i].isControlled=!this.items[i].isControlled;
    let qte = this.getQuantityMaxToAdd(this.items[i].productId);
    if(qte<0)
    {
    this.items[i].isControlled=false;
    this.items[i].controlError="Quantité insuffisante";
    this.canAddOrSave = false;
    }
    else

    {
      this.items[i].controlError="";
      
    }

    }
    if(this.items[i].isControlled &&this.items.length>i+1)
    {
      
    this.index=i+1;
    this.grid.refresh();  
    this.grid.selectRow(i+1);
    }
    else
    {
      //fill packings & agents before save =>suggest F2
      this.grid.refresh();
     
    }  
    this.canSaveOrAdd();
    // if(this.canAddOrSave && !this.items.some(e=>!e.isControlled && e.status!=20))
    // this.save();

  }
  async addNewProduct() {
    
    let selectedData=JSON.parse(JSON.stringify(this.grid.getSelectedRecords()[0]))
     
    selectedData["id"]= uuid.v4();
    selectedData.status=10;
     selectedData["quantity"]=
     this.getQuantityMaxToAdd(selectedData.productId);
     if(selectedData["quantity"]==0) return;
     selectedData["oldQuantity"]=0;
     let oldBatch=selectedData.internalBatchNumber
     selectedData.internalBatchNumber=null;
     selectedData.expiryDate=null;
     selectedData.ppaHT=0;
     selectedData.ppaPFS=0;
     selectedData.pfs=0;
    this.items.push(selectedData);
    
     this.grid.refresh();  
      let ind=this.items.length-1;
      this.grid.selectRow(ind);
      this.index=ind;
      this.setFocus=this.grid.getColumnByField("internalBatchNumber");   
      this.EditItem("internalBatchNumber",selectedData,ind,true,oldBatch)          ;


  }
  
  public onCreateDropDowProduct(args){ 
    this.changeDetectorRef.detectChanges();
  } 
  fillProducts() {

    let products = [...new Set(this.groupedItemsByProduct.map(item =>  [item.productId, item])).values()]; 

    return new Promise(resolve => {
      let products = [];
     for (let index = 0; index < products.length; index++) {
        const element = products[index];
        let exist = this.groupedItemsByProduct.find(ele => ele.productId == element.id);
        if (exist != null && this.getQuantityMaxToAdd(exist.productId) > 0) products.push(element);
      }
      // for (let index = 0; index < this.cachedProduct.length; index++) {
      //   const element = this.cachedProduct[index];
      //   let exist = this.groupedItemsByProduct.find(ele => ele.productId == element.id);
      //   if (exist != null && this.getQuantityMaxToAdd(exist.productId) > 0) products.push(element);
      // }
      // Cas fridge zone
      if(this.currentZone.zoneType == 10) products.filter(c => c.pickingZoneId == this.currentZone.id);
      resolve(products);
    });
  
  }

  async canSaveOrAdd():Promise<boolean>{

    if(this.currentZone.zoneType==30)
    { 
      this.op.packingPickingZoneControl=this.packingPickingZoneControl=this.items
      .reduce((sum, current) => sum + current.quantity/current.packing, 0); 
    }
    let canSave = [];
    this.items.map(ele => {
      let qte = this.getQuantityMaxToAdd(ele.productId);
      canSave.push(qte);
    });
    if(canSave.filter(ele => ele < 0).length > 0) {
      this.error = true;
      this.errorMessage = 'Barrer au moins une ligne / ou quantité insufisante';
      this.canAddOrSave = false;
      return false;
    }

      //have all items been controlled?
      if(this.items.some(ele => 
        !ele.isControlled && ele.status==20
        ))
        {
          this.error = true;
          this.errorMessage = 'Toutes les lignes doivent être barrées ou controlées( Touche Entrer )';
          this.canAddOrSave = false;
         return false; 
        }
  

        
    
   
  this.error=false
  this.errorMessage =''
      this.canAddOrSave = true;
      return true;

  
    

  }
  closeDirectly:boolean=false;
  async save() {

    

    if(!this.canAddOrSave) return;
    if(!this.loading) {
      //#region force packing prompt
      //#region if B1 automatically assign packing  or if it still other zones
      if(this.currentZone.zoneType==30)
      { 
        this.op.packingPickingZoneControl=this.packingPickingZoneControl=this.items
        .reduce((sum, current) => sum + current.quantity/current.packing, 0); 
      }
      
      // if(this.blByOrder.countBlNotControlled == 1)
      

      // this.op.packingPickingZoneControl=this.packingPickingZoneControl=0;
      // else
      //#endregion
      if(!(this.packingPickingZoneControl &&this.packingPickingZoneControl!=null && this.packingPickingZoneControl>0))
      {
 

  
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          packing:this.packingPickingZoneControl
        };
        dialogConfig.disableClose = false;
        
        dialogConfig.autoFocus = true;
        dialogConfig.maxWidth = '30vw';
        dialogConfig.backdropClass='backdropBackground';
        dialogConfig.maxHeight = "30vh";
        dialogConfig.height = "100%";
        dialogConfig.width = "30%";    
        if(!this.dialogOpend)  {
          var modalRef = this.dialog.open(PromptPackingComponent, dialogConfig);
          this.dialogOpend = true;
          modalRef.afterClosed().subscribe(res => {
            this.dialogOpend = false;
            if(res && res!=null && res>0)
            {
              this.canAddOrSave = true;
              this.errorMessage="";
              this.error=false;
              this.op.packingPickingZoneControl=
               this.packingPickingZoneControl=res;   
               this.closeDirectly=true;
               this.loading=false;
               this.save();
            } 
            
          });
          return;
        }


      }

let temp:any;
temp=await this.orderPreparationService.getById(this.data.bl.id).toPromise();
temp.preparationOrderExecuters=temp.preparationOrderExecuters.filter(e=>e.pickingZoneId==this.data.pickingZoneId);
temp.preparationOrderVerifiers=temp.preparationOrderVerifiers.filter(e=>e.pickingZoneId==this.data.pickingZoneId);
temp.countExecuters=temp.preparationOrderExecuters.length;
temp.countVerifiers=temp.preparationOrderVerifiers.length;
      //#endregion
            //#region force executors selection prompt
            if(!temp.countVerifiers ||!temp.countExecuters||
              temp.countVerifiers==null ||!temp.countExecuters==null||
              temp.countVerifiers==0||temp.countExecuters==0
            )
            {    
              const dialogConfig = new MatDialogConfig();
              dialogConfig.data = {
                bl: this.data.bl,
                pickingZoneId : this.data.pickingZoneId,
                pickingZoneName: this.data.pickingZoneName
              };
              dialogConfig.disableClose = true;
              dialogConfig.autoFocus = true;
              dialogConfig.maxWidth = '100vw';
              dialogConfig.maxHeight = "100vh";
              dialogConfig.height = "100%";
              dialogConfig.width = "100%";
              dialogConfig.backdropClass='backdropBackground';
              dialogConfig.panelClass= 'full-screen-modal';    
              if(!this.dialogOpend)  {
                var modalRef1 = this.dialog.open(AddOpAgentsComponent, dialogConfig);
                this.dialogOpend = true;
                let res=await modalRef1.afterClosed().toPromise();
                this.dialogOpend = false;
                this.loading=false; 
                 if(res && res!=null)
                {
                  //this.op=this.orderPreparationService.getById(this.op.id);                  
                  this.canAddOrSave = true;
                  this.errorMessage="";
                  this.error=false;  
                  this.closeDirectly=true;
                  this.save();
                } 
              
                return;
              }  
      
      
            }
      if(this.dialogOpend) return;
            //#endregion
      this.loading = true; 
      let command = {
      id : this.op.id,
      totalPackage:!this.packingPickingZoneControl?0:((this.currentZone.zoneType != 10) ? this.packingPickingZoneControl : 0),
      TotalPackageThermolabile: !this.packingPickingZoneControl?0:((this.currentZone.zoneType == 10) ? this.packingPickingZoneControl : 0),
      preparationOrderItems: this.items
    };
    // Check if last bl to controll , all order quantity is valid
    let checkLastBlresult = true;
    if(this.blByOrder.countBlNotControlled == 1) checkLastBlresult = this.checkLastBl();
    if(this.canAddOrSave == true && checkLastBlresult == true) {
 
      let result = <any>await this.orderPreparationService.update(command).toPromise();
      if(result==null)
	  {
        await this.orderPreparationService.controlOp(this.op.id).toPromise();
        this.notif.showNotification('mat-success',"Zone contrôlée avec succès" ,'top','right');
        this.items = [];
        this.op = null;
        this.close();
      } else {
        this.items.map(ele => {
          let invalidItem = result.invalidItems.find(c => c.internalBatchNumber == ele.internalBatchNumber && c.productCode == ele.productCode);
          if(invalidItem != null) {
ele.controlError = Object.keys(invalidItem.orderItemValidationErrors).map(k => invalidItem.orderItemValidationErrors[k]).join("\n") ;
            ele.isControlled = false;
            ele.status=10;
          }
          return ele;
        });
       this.loading = false;
       this.grid.refresh();
        // Display line with errors and activate update for them

      }
	     this.loading = false;

      }
      else {
        this.loading = false;

        this.error = true;
      }
    

    }
    else
      this.notif.showNotification('mat-warn',"Veuillez attendre la fin de l'opération en cours ..." ,'top','right');
} 
 
  checkLastBl() {
    let isQuantityCorrect = [];
    this.groupedItemsByProduct.forEach(element => {
      const sumByProduct = this.items.filter(c => c.productId == element.productId && c.status != 20).reduce((sum, currentValue) => {
        return sum + currentValue.quantity;
      }, 0);
      if(sumByProduct + element.controlled > element.initial) {
        isQuantityCorrect.push(false);
        this.error = true;
        this.errorMessage = 'Les quantité du produit '+ element.productName +'depasse celle du bon de commande';
      } else isQuantityCorrect.push(true);

    });
    if(isQuantityCorrect.find(ele => !ele) != null ) return false; else return true;
  }
  groupBy(list) {
    var result = [];

    list.forEach(element => {
      let quantityControlled = 0;
      let controlledOrderItemByProduct = this.controlledOrderItem.filter(e => e.productId == element.productId && e.isControlled)
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
          productCode : element.productCode,
          defaultLocation : element.defaultLocation,

          quantity : sumOfQuantity - quantityControlled,
          initial: sumOfQuantity,
          controlled: quantityControlled,
          discount: minDiscount
        });
      }

    }); 
    return result;
  }
  async close (){
    if(this.closeDirectly)
    this.dialogRef.close(null);
    if(this.op.controlled)
    this.dialogOpend=true;
    let confirm = await this.dialogHelper.confirmDialog(this.dialog,'Êtes-vous sûr de vouloir annuler les modifications', false);
    if(confirm) {
      this.dialogRef.close(null);
    }
    this.dialogOpend=false;
  }
  async EditItem(focusField,data,index,add=false,internalBatchNumber) {

    this.batchs = 
    await this.inventoryService.getStockForPreparation
    (this.op.organizationId, data["productCode"],data["pickingZoneName"]).toPromise();
    if(add)
    {
    this.batchs=this.batchs.filter(b=>b.internalBatchNumber!=internalBatchNumber)

    }
    const dialogConfig = new MatDialogConfig();
     dialogConfig.data = { 
      batches:this.batchs
      ,
      line:data,
      items:this.items,
      currentZone:this.currentZone,
      orderId:this.op.orderId
     
    };
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.dialogOpend)  {
      var modalRef = this.dialog.open(EditPreparationItemFormComponent, dialogConfig);
      this.dialogOpend = true;
      modalRef.afterClosed().subscribe(res => {

        this.dialogOpend = false; 
        if(res != null) {

          if(add &&(res.quantity<=0 || res.internalBatchNumber==null))
          {
          this.items=(this.items as Array<any>).filter((e,ind)=>ind!=index);
          this.index=index=0;

          }
          else
          {
          this.items[index]=res;
          if(!res.ppaHT ||res.ppaHT==null) 
          this.items[index].ppaHT=0;
          }
          this.grid.refresh();
          this.grid.selectRow(index);
          

        }
        else
        {
          if(add)
          {
          this.items=(this.items as Array<any>).filter(((e,ind)=>ind!=index));
          this.index=index=0;
          }
        }
        (<HTMLElement>(document.getElementsByClassName('e-grid')[0])).focus();
        
      });
    }
  }
 
}
