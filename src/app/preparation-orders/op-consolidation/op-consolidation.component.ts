import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgSelectComponent } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { UserApp } from 'src/app/membership/models/user-app';
import { EmployeeService } from 'src/app/services/employee.service';
import { PickingZoneService } from 'src/app/services/piking-zone.service';
import { PreparationOrdersService } from 'src/app/services/preparation-orders.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
@Component({
  selector: 'app-op-consolidation',
  templateUrl: './op-consolidation.component.html',
  styleUrls: ['./op-consolidation.component.sass']
})
export class OpConsolidationComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  bl: any;
  public formGroup: FormGroup;
  zones = [];
  public consolidators: UserApp[] = [];
  gridData = [];
  defaultZones: any[];
  allOpByOrder: Object;
  currentZone: any;
  thermolabileZone: any;
  thermolabileZoneInOrder: any;
  thermolabileItems: any;
  displayTotalPackage: boolean = true;
  @ViewChild('totalPackageThermolabile') totalPackageThermolabile: ElementRef;

  @ViewChild('employeeCode') employeeCode: NgSelectComponent;
  @ViewChild('btnRef') buttonRef: MatButton;

  // thermolabileZoneInOrder: any;
  constructor(
    private fb: FormBuilder,
    private orderPreparationService: PreparationOrdersService,
    private notif: NotificationHelper,
    private pickingZoneService: PickingZoneService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<OpConsolidationComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) { }

  async ngOnInit() {
    this.bl = this.data.bl;

    //this.consolidators = await this.userService.GetConsolidators().toPromise();
    this.consolidators = await this.employeeService.getAll(2).toPromise();
    this.zones = await this.pickingZoneService.getAll().toPromise();
    this.allOpByOrder = await this.orderPreparationService.GetAllOpByOrder(this.bl.orderId).toPromise();
    this.currentZone = this.zones.find(ele => ele.zoneGroupId == this.bl.zoneGroupId);
    this.thermolabileZone = this.zones.find(ele => ele.zoneType == 10);
    this.thermolabileZoneInOrder = this.data.bl.preparationOrderItems.find(ele => ele.zoneGroupId == this.bl.zoneGroupId && ele.pickingZoneId == this.thermolabileZone.id);
    await this.createFrom();
  }

  /* NOTE: not used */
  getDataGrid() {

    this.defaultZones.forEach(element => {
      let executer = this.bl.preparationOrderExecuters.find(ele => ele.pickingZoneId == element.pickingZoneId);
      let controller = this.bl.preparationOrderVerifiers.find(ele => ele.pickingZoneId == element.pickingZoneId);
      if (this.gridData.length == 0)
        this.gridData.push({
          pickingZoneId: element.pickingZoneId,
          pickingZoneName: element.pickingZoneName,
          executedByName: (executer) ? executer.executedByName : null,
          verifiedByName: (controller) ? controller.verifiedByName : null,
          status: (executer && controller) ? true : false
        }); else {
        this.gridData.map(item => {
          item.pickingZoneId = element.pickingZoneId;
          item.pickingZoneName = element.pickingZoneName;
          item.executedByName = (executer) ? executer.executedByName : null;
          item.verifiedByName = (controller) ? controller.verifiedByName : null;
          item.status = (executer && controller) ? true : false;
          return item;
        });
      }
    });
    this.grid.refresh();
  }
  private async createFrom() {
    this.formGroup = await this.fb.group({
      preparationOrderId: [this.bl.id, [Validators.required]],
      zoneGroupId: [this.bl.zoneGroupId, [Validators.required]],
      totalPackage: [this.bl.totalPackage, [Validators.required, this.ValidateMinPackage.bind(this)]],
      totalPackageThermolabile: [this.bl.totalPackageThermolabile, []],
      employeeCode: [this.bl.employeeCode, []],
    });
  }

  ValidateMinPackage(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value <= 0) {
      return { 'PackageInvalid': true };
    }
    return null;
  }

  onEmployeeCodeSelection(data) {
    this.formGroup.get("employeeCode").setValue(data.hrCode);
  }

  customEmployeeSearchFn(term: string, item: any) {
    if (term != undefined) {
      term = term.toLocaleLowerCase();
      let part1 = term.split(" ")[0];
      let part2 = term.split(" ")[1];

      if (part2 && item.hrCode) {
        return (item.hrCode.toLocaleLowerCase().indexOf(part1) > -1 && item.hrCode.toLocaleLowerCase().indexOf(part2) > -1);
      }

      return (item.hrCode != undefined && item.hrCode.toLocaleLowerCase().indexOf(term) > -1)
        || (item.name != undefined && item.name.toLocaleLowerCase().indexOf(term) > -1);
    }
  }
  onConsolidatorSelection(data) {
    console.log(data);
  }
  async save() {
    if (this.formGroup.invalid) return;
    if (this.bl.preparationOrderStatus == 30) {
      this.bl.totalPackage = this.formGroup.value.totalPackage;
      this.bl.totalPackageThermolabile = this.formGroup.value.totalPackageThermolabile;
      this.bl.employeeCode = this.formGroup.value.employeeCode;
      await this.orderPreparationService.update(this.bl).toPromise();
      this.notif.showNotification('mat-success', 'La zone ' + this.bl.zoneGroupName + ' est consolidé avec succès', 'top', 'right');

    } else {
      await this.orderPreparationService.consolidate(this.formGroup.value).toPromise();
      this.notif.showNotification('mat-success', 'La zone ' + this.bl.zoneGroupName + ' est consolidé avec succès', 'top', 'right');

    }
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close(null);
  }

}
