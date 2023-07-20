import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CommandClickEventArgs, CommandModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { log } from 'console';
import { ThemeService } from 'ng2-charts';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { DateHelper } from 'src/app/shared/date-helper';
import { DialogHelper } from 'src/app/shared/DialogHelper';
import { ErrorParseHelper, Result } from 'src/app/shared/helpers/ErrorParseHelper';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Order } from '../sales-models/Order';

@Component({
  selector: 'app-orders-list-dt',
  templateUrl: './orders-list-dt.component.html',
  styleUrls: ['./orders-list-dt.component.sass']
})
export class OrdersListDtComponent extends BaseComponent implements OnInit {
  public commandListing: CommandModel[];
  public dropStates: string[] = ["En attente","Confirmé / Imprimée","Enregistrée","Acceptée/Confirmée","En cours de traitement","En route","Terminée","Annulée","Rejetée","En cours de préparation","Consolidée","Expédiée","Créée sur AX","En cours de chargement", "Facturée","En cours de prélèvement", "Prélevée", "Accusé de réception", "Erreur de syncronisation", "Annulée sur AX", "Partiellement créée sur AX"];
  public fields: object = { text: 'orderStatus', value: 'orderStatus' };
  public dropTypesOrder: string[]  = ["Psychotrope", "Non Psychotrope"];
  public fieldType: object = { text: 'type', value: 'orderType' };
  supplierId: any;
  public pageSettings: Object;
  isOpen: any;
  isDt : boolean = false;
  constructor(private changeDetectorRef: ChangeDetectorRef,
    private service  : OrdersService,
    private customerService : CustomerService,
    private notif: NotificationHelper,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private dialogHelper: DialogHelper,
    private dateHelper: DateHelper,
    private fb: FormBuilder,
    private _auth: AuthService,
    private parseErrorHelper: ErrorParseHelper,
    private orderService:OrdersService) {
      super(_auth,"sales/");
  }

  ngOnInit(): void {
    this.commandListing = [
      { type: 'None',title:'Détail', buttonOption: { iconCss: 'e-icons e-eye', cssClass: 'e-flat'} },
       { type: 'None',title:'Validation', buttonOption: { iconCss: 'e-icons e-arrow-right-up', cssClass: 'e-flat'}},
      { type: 'None',title:'Annuler',buttonOption: { iconCss: 'e-icons e-delete', cssClass: 'e-flat'}}
      
    ];
    this.pageSettings = { pageSizes: true, pageSize: 12 };
    this.supplierId = this._auth.profile["organizationId"];
    this.isDt =this.permissionService.isDt() || this.permissionService.isDtGroup();
    this.loadPsyOrders();
  }
 
  private loadPsyOrders() {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "suppliers/" + this.supplierId + "/orders/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this._auth.getToken, "isPsy": true }],
    });
  }

  dataBound($event) {

  }
  begin($event) {

  }
  onChange($event) {

  }
  view(order) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { 
      order: order, 
    };
    dialogConfig.disableClose = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = "100vh";
    dialogConfig.height = "100%";
    dialogConfig.width = "100%";
    dialogConfig.panelClass= 'full-screen-modal';
    if(!this.isOpen)  {
      var modalRef = this.dialog.open(OrderDetailComponent, dialogConfig);
      this.isOpen = true;
      modalRef.afterClosed().subscribe(res => {
        this.isOpen = false;
      });
    }
  }
  async ListingCommandClick(args: CommandClickEventArgs) {
    console.log(args);
    
    if(args.commandColumn.title == 'Détail'){
      this.view(args.rowData);
       return;
    }
    else if(args.commandColumn.title == 'Validation') {
      
      if(!this.permissionService.isDt() || !this.permissionService.isDtGroup()){
        this.notif.showNotification('mat-warn',"Vous ne pouvez pas Valider cette commande. contacter le service DT",'top','right'); 
        return;
      }
      this.generateOps(args.rowData); 
      return;
    }
    //if(args.commandColumn.title == 'Imprimer') {this.print(args.rowData); return;}
   // if(args.commandColumn.title == 'Imprimer une commande') {this.printOrder(args.rowData);return;}
    else if(args.commandColumn.title == 'Annuler' && ((args.rowData as Order).orderStatus  == 30 ||(args.rowData as Order).orderStatus  == 40||(args.rowData as Order).orderStatus  == 90)) {
      let response = await this.dialogHelper.confirmDialog(this.dialog,'Êtes Vous sûr de bien vouloir supprimer la commande.');
      if(response){
        this.cancelOrder(args.rowData);
        return;
      }
      else {
        this.notif.showNotification('mat-warn',"Vous ne pouvez pas annuler cette commande.",'top','right'); 
        return;
      }
    }
   

  }
  async cancelOrder(rowData) {
    var r =  await this.service.empytOrder(rowData).toPromise();
    if(!r){
     this.notif.showNotification('mat-success',"Commande a été Annulée avec succès",'top','right');
      this.loadPsyOrders();
   }
     else this.notif.showNotification('mat-warn',this.parseErrorHelper.parse(<Result>r),'top','right');
   }
   refresh() {
    this.loadPsyOrders();
   }
  async generateOps(row){    
    if(row.orderStatus != 10){
    this.notif.showNotification('mat-warn',"Génération des OPs est impossible !",'top','right');  
    return;
    }
    var response=

    await this.orderService.generateOps(
      {
        orderId: row.orderId
      }
    )
    .toPromise();
    if(response==null)
    {
      this.notif.showNotification('mat-success',"Ops générés avec succès",'top','right');
      this.loadPsyOrders();
    }
    else
    { 
      let resultError = this.parseErrorHelper.parse(<Result>response);
      this.notif.showNotification('mat-warn',resultError,'top','right');   
    }
  }

}
