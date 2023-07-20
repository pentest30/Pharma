import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { UserApp } from 'src/app/membership/models/user-app';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { PermissionService } from 'src/app/services/permission.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-add-op-agents',
  templateUrl: './add-op-agents.component.html',
  styleUrls: ['./add-op-agents.component.sass']
})
export class AddOpAgentsComponent implements OnInit {

  bl: any;
  public formGroup: FormGroup;
  zones = [];
  controllers : any[] = [];
  public executers: any[] = [];
  gridData = [];
  defaultZones: any[];
  currentGroupZone: any;
  currentZone: any;
  @ViewChild('executedById') excutersSelect;
  @ViewChild('executedById') ngSelectExecutersComponent: NgSelectComponent;
  @ViewChild('verifiedById') ngSelectVerifiersComponent: NgSelectComponent;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private orderPreparationService : PreparationOrdersService,
    private notif: NotificationHelper,
    private pickingZoneService : PickingZoneService,
    private dialogRef: MatDialogRef<AddOpAgentsComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
  ) { 

  }

  async ngOnInit() {
    this.bl = this.data.bl;
    this.zones = await this.pickingZoneService.getAll().toPromise();
    this.executers = await this.employeeService.getAll(1).toPromise();
    this.controllers = await this.employeeService.getAll(3).toPromise();

    await this.createFrom();
    this.currentGroupZone = this.zones.find(ele => ele.zoneGroupId == this.bl.zoneGroupId);
    this.currentZone = this.zones.find(ele => ele.id ==  this.data.pickingZoneId);

    console.log(this.currentZone);
  }
  private async createFrom() {
    console.log(this.data);
    this.formGroup = await this.fb.group({
      preparationOrderId: [this.bl.id, [Validators.required]],
      pickingZoneId: [this.data.pickingZoneId, [Validators.required]],
      pickingZoneName: [this.data.pickingZoneName, [Validators.required]],
      executedById: [null, [Validators.required]],
      executedByName: [null, [Validators.required]],
      verifiedByName: [null, [Validators.required]],
      verifiedById: [null, [Validators.required]],


    });
  }
  onExecuterSelection(data) {
    console.log(data);
    this.formGroup.get("executedByName").setValue(data.name);
    if((!this.formGroup.invalid))
    this.save();
    else
    this.ngSelectVerifiersComponent.focus();

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
  onVerifierSelection(data) {
    this.formGroup.get("verifiedByName").setValue(data.name);
    if((!this.formGroup.invalid))
    this.save();
  }
  async save() {
    if(this.formGroup.invalid)  {
      console.log(this.formGroup.value);
      return;
    };
    await this.orderPreparationService.addAgents(this.formGroup.value).toPromise();
    // this.notif.showNotification('mat-success','La zone ' + this.formGroup.value.pickingZoneName +
    //  ' est controlée avec succès','top','right');
    this.dialogRef.close(this.formGroup.value);
  }
  close (){
    this.dialogRef.close(null);
  }

}
