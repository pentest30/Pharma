import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { controllers } from 'chart.js';
import { UserApp } from 'src/app/membership/models/user-app';
import { AuthService } from 'src/app/services/auth.service';
import { ConsolidationOrderService } from 'src/app/services/consolidation-order.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { OrdersService } from 'src/app/services/orders.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-expedition',
  templateUrl: './expedition.component.html',
  styleUrls: ['./expedition.component.sass']
})
export class ExpeditionComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  public formGroup: FormGroup;
  zones = [];
  public consolidators: UserApp[] = [];
  gridData = [];
  defaultZones: any[];
  allOpByOrder: Object;
  currentZone: any;
  consolidationOrder: any;
  receptionist: any[] = [];
  constructor(
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private consolidationOrderService : ConsolidationOrderService,

    private userService: UserService,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<ExpeditionComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private permService: PermissionService
  ) { }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
    }
  }
  async ngOnInit() {
    this.consolidationOrder = this.data.data;
    this.consolidators = await this.employeeService.getAll(2).toPromise();
    let expeditors = await this.employeeService.getAll(5).toPromise();
    this.consolidators.concat(expeditors);
    await this.createFrom();

  }
 
  private async createFrom() {
    let fixedAgent = JSON.parse(localStorage.getItem('fixedAgent'));
    console.log(fixedAgent,this.consolidationOrder.consolidatedByName);
    this.formGroup = await this.fb.group({
      id: [this.consolidationOrder.id, [Validators.required]],
      consolidatedById: [((fixedAgent != null && this.consolidationOrder.consolidatedById != '00000000-0000-0000-0000-000000000000') || fixedAgent == null) ? this.consolidationOrder.consolidatedById : fixedAgent.consolidatedById, [Validators.required]],
      consolidatedByName: [((fixedAgent != null && this.consolidationOrder.consolidatedByName != undefined)|| fixedAgent == null) ? this.consolidationOrder.consolidatedByName : fixedAgent.consolidatedByName, [Validators.required]],
      receivedInShippingBy: [((fixedAgent != null && this.consolidationOrder.receivedInShippingBy != undefined)|| fixedAgent == null) ? this.consolidationOrder.receivedInShippingBy : fixedAgent.receivedInShippingBy, [Validators.required]],
      sentForExpedition: [(fixedAgent != null) ? true : false, []],
      receivedInShippingId: [((fixedAgent != null && this.consolidationOrder.receivedInShippingId != '00000000-0000-0000-0000-000000000000') || fixedAgent == null) ? this.consolidationOrder.receivedInShippingId : fixedAgent.receivedInShippingId, [Validators.required]]
    });
    console.log(this.formGroup.value);

  }
  onZoneSelection(data) {
  }
  onConsolidatorSelection(data) {
    this.formGroup.get("consolidatedByName").setValue(data.name);
    let fixedAgent = {
      consolidatedById:this.formGroup.value.consolidatedById,
      consolidatedByName: this.formGroup.value.consolidatedByName,
      receivedInShippingBy: this.formGroup.value.receivedInShippingBy,
      receivedInShippingId: this.formGroup.value.receivedInShippingId
    };
    localStorage.setItem('fixedAgent', JSON.stringify(fixedAgent));

  }
  onReceivedInShippingSelection(data) {
    this.formGroup.get("receivedInShippingBy").setValue(data.name);
    console.log(this.formGroup.value.receivedInShippingBy)
    let fixedAgent = {
      consolidatedById:this.formGroup.value.consolidatedById,
      consolidatedByName: this.formGroup.value.consolidatedByName,
      receivedInShippingBy: this.formGroup.value.receivedInShippingBy,
      receivedInShippingId: this.formGroup.value.receivedInShippingId
    };
    localStorage.setItem('fixedAgent', JSON.stringify(fixedAgent));

  }
  customEmployeeSearchFn(term:string , item : any) {
    if(term!=undefined) {
      term = term.toLocaleLowerCase();
      let part1 = term.split(" ")[0];
      let part2 = term.split(" ")[1];
      if(part2 && item.hrCode) {
        return      ( item.hrCode.toLocaleLowerCase().indexOf(part1) > -1 && item.hrCode.toLocaleLowerCase().indexOf(part2) > -1) ;
 
      }
       return  (item.hrCode != undefined && item.hrCode.toLocaleLowerCase().indexOf(term) > -1 )  
       || (item.name != undefined && item.name.toLocaleLowerCase().indexOf(term) > -1 )  ;
    }
  }
  async save() {
    if(this.formGroup.invalid) return;
    let fixedAgent = {
      consolidatedById:this.formGroup.value.consolidatedById,
      consolidatedByName: this.formGroup.value.consolidatedByName,
      receivedInShippingId: this.formGroup.value.receivedInShippingId,
      receivedInShippingBy: this.formGroup.value.receivedInShippingBy
    };
    localStorage.setItem('fixedAgent', JSON.stringify(fixedAgent));
    this.consolidationOrder.consolidatedById = this.formGroup.value.consolidatedById;
    this.consolidationOrder.consolidatedByName = this.formGroup.value.consolidatedByName;
    this.consolidationOrder.receivedInShippingBy = this.formGroup.value.receivedInShippingBy;
    this.consolidationOrder.receivedInShippingId = this.formGroup.value.receivedInShippingId;
    this.consolidationOrder.sentForExpedition = this.formGroup.value.sentForExpedition;

    await this.consolidationOrderService.update(this.consolidationOrder).toPromise();
    this.notif.showNotification('mat-success','Le Bl ' + this.consolidationOrder.orderIdentifier + ' a été expédié avec succès','top','right');
    this.dialogRef.close();
  }
  close (){
    this.dialogRef.close(null);
  }

}
