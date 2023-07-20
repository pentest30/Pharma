import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { InventSumService } from 'src/app/services/inventory.service';
import { QuotaService } from 'src/app/services/quota.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supervisor-transfert',
  templateUrl: './supervisor-transfert.component.html',
  styleUrls: ['./supervisor-transfert.component.sass']
})
export class SupervisorTransfertComponent extends BaseComponent implements OnInit {

  salespersonsSourceId : string;
  salespersonsDestinationId : string;
  productId : string ;
  quotaDate : Date;
  salespersons : any [] = [];
  customers : any [] = [];
  currentUser: any;
  listCustomers : any [] = []; 
  myGroup : FormGroup;
  canSave = false;
  public customerState : string[] = ["Actif", "Bloqué"];
  withLiberation = false;
  @ViewChild('grid') public grid: GridComponent;
  data: DataManager;
  constructor(private dialogRef: MatDialogRef<SupervisorTransfertComponent>,
    private quotaService: QuotaService, 
    private notif: NotificationHelper,
    private inventService : InventSumService,
    private userService: UserService,
    private authService: AuthService,
    private customerService : CustomerService,
    private fb: FormBuilder) {
      super(null, null);
     }

  async ngOnInit() {
    this.createFrom();
    this.currentUser = await this.authService.getUser();
    var currentId = this.currentUser.sub;
    this.salespersons = await this.userService.getSalesPersonsBySupervisor(currentId).toPromise();
  }
  toggle($event){
    this.withLiberation = $event.checked;
  }
  async save() {
   
    var salesPersonName = this.salespersons.find(x=>x.id ==this. salespersonsDestinationId).userName;
    var command = {
      salespersonsSourceId: this.salespersonsSourceId,
      salespersonsDestinationId: this.salespersonsDestinationId,
      customers : this.listCustomers,
      SalespersonsDestination : salesPersonName
    };
    var r = await this.customerService.updateActualSalesPerson(command).toPromise();
    if(this.withLiberation) {
      var result = await this.quotaService.transferQuotaSalesPerson(command).toPromise();
    }
    this.notif.showNotification(
      "mat-success",
      "Réaffectation des client a été terminée avec succès",
      "top",
      "right"
    );
    this.close();


  }
  close() {
    this.dialogRef.close();
  }
  onSelectSalesPersonDest($event) {
    if(!$event) {
      this.canSaveCommand();
      return;
    }
    this.canSaveCommand();
  }
  onSelectSalesPerson($event) {
    if(!$event) {
      this.canSaveCommand();
      return;
    }
   
    this.customerService.customerBySalesPersonById($event).subscribe(res=> {
      this.customers = res;
       this.loadData();
      //this.listCustomers = [res[0].id]
      this.selectAllForDropdownItems(this.customers);
      
    });
    this.canSaveCommand();
  }
  loadData(): void {
    this.data = new DataManager({
      url: environment.ResourceServer.Endpoint + "customers/supervisor/search",
      adaptor: new UrlAdaptor(),
      headers: [{ Authorization: "Bearer " + this.authService.getToken , salesPersonId : this.salespersonsSourceId}],
      
    }); 
    this.grid.dataSource = this.data;
    
  }
  onSelectCustomers($event) {
   // console.log(this.listCustomers)
   this.canSaveCommand();

  }
  canSaveCommand() : void {
    if (this.salespersonsDestinationId && this.salespersonsSourceId && this.listCustomers.length > 0) {
      if (this.salespersonsDestinationId != this.salespersonsSourceId) {
      this.canSave = true;
    }
    else  this.canSave = false;
    }
    else
      this.canSave = false;
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }
  private createFrom() {
    this.myGroup = this.fb.group({
      salespersonsDestinationId: [this.salespersonsDestinationId, [Validators.required]],
      salespersonsSourceId: [this.salespersonsSourceId, [Validators.required]],
      
    });
  }
}
