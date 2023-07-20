import { ConsolidationOrderService } from "src/app/services/consolidation-order.service";
import { EmployeeService } from "src/app/services/employee.service";
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";

import { PreparationOrdersService } from "src/app/services/preparation-orders.service";
import { NotificationHelper } from "src/app/shared/notif-helper";

import { Observable, of } from "rxjs";
import { debounceTime, map, startWith, tap, catchError } from "rxjs/operators";
import { PickingZoneService } from "src/app/services/piking-zone.service";
import { PickingZone } from "src/app/picking-zone/models/picking-zeone";
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterEvent,
} from "@angular/router";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { MatButton } from "@angular/material/button";
import {
  ErrorParseHelper,
  Result,
} from "src/app/shared/helpers/ErrorParseHelper";

@Component({
  selector: "app-consolidation-listing",
  templateUrl: "./consolidation-listing.component.html",
  styleUrls: ["./consolidation-listing.component.sass"],
})
export class ConsolidationListingComponent implements OnInit {
  filters: object = {};
  @ViewChild("grid") public grid: GridComponent;
  isOpen: any;
  barCode: string = "";

  EditByScan: boolean = false;
  barcodeFormControl = new FormControl();
  @ViewChild("barcodeRef") barcodeRef: ElementRef;
  @ViewChild("colisInput") colisInput: ElementRef;
  @ViewChild("thermoInput") thermoInput: ElementRef;
  @ViewChild("agentInput") agentInput: ElementRef;
  @ViewChild("saveBtn") saveBtn: MatButton;

  consolidators: any[];
  consolidationOrder: any;
  zones: PickingZone[];
  allSiblingOP: Array<any>;

  form = new FormGroup({
    preparationOrderId: new FormControl(null),
    zoneGroupId: new FormControl(null),
    totalPackage: new FormControl({ value: null }, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000),
      this.minValValidator.bind(this),
    ]),
    totalPackageThermolabile: new FormControl({ value: null }, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000),
      this.minValValidator.bind(this),
    ]),
    employeeCode: new FormControl(null, Validators.required),
    consolidatedById: new FormControl(null),
    consolidatedByName: new FormControl(null),
  });

  isCommandControlled: boolean;
  isFixedAgent: boolean;
  barcode: any;
  hasThermo: boolean;

  constructor(
    private notificationsService: NotificationHelper,

    private orderPreparationService: PreparationOrdersService,
    private consolidationOrderService: ConsolidationOrderService,
    private employeeService: EmployeeService,
    private pickingZoneService: PickingZoneService,
    private activatedRoute: ActivatedRoute,
    private parseErrorHelper: ErrorParseHelper
  ) { }
  ngAfterViewInit() { }
  async ngOnInit() {
    // get query params from archive component to consolidate from archive

    // get all agents of type: consolidation agent
    this.consolidators = await this.employeeService.getAll(2).toPromise();
    // Picking zones
    this.zones = await this.pickingZoneService.getAll().toPromise();

    /* Agent input autocomplete listener  */
    this.filteredOptions = this.agentFormControl.valueChanges.pipe(
      startWith(""),
      tap((v) =>
        !!v && v.length > 0
          ? this.form.get("employeeCode").setValue(null)
          : null
      ),
      map((value) => this._filter(value || ""))
    );

    this.barcodeRef.nativeElement.focus();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.barcodeFormControl.setValue(null, { emitEvent: true });
      this.barcodeFormControl.setValue(params.barecode, { emitEvent: true });
      this.barcodeFormControl.updateValueAndValidity({
        emitEvent: true,
        onlySelf: false,
      });
      this.loadOP(params.barecode);
    });
  }

  bypass = false;
  async test() {
    this.bypass = !this.bypass;
    this.loadOP(null);
  }

  async loadOP(barcode) {
    if (barcode != null) this.barcodeFormControl.setValue(barcode);
    if (this.barcodeFormControl.value.length < 13) return;

    // get consolidation order by barcode
    // test barcode: 2200000287803
    let result = await this.orderPreparationService
      .getControlledByBarcode(this.barcodeFormControl.value)
      .pipe(catchError((err) => of(null)))
      .toPromise();
    if (result.preparationOrder != null) {
      this.consolidationOrder = result.preparationOrder;
      this.allSiblingOP = await this.orderPreparationService
        .GetAllOpByOrder(this.consolidationOrder.orderId)
        .toPromise();

      // check if command controlled
      this.isCommandControlled = this.allSiblingOP.every(
        (z) => z.preparationOrderStatus > 20
      );

      // check if zone type is Original
      const hasOriginal = this.zones
        .filter((z) => z.zoneGroupId == this.consolidationOrder.zoneGroupId)
        .some((z) => z.zoneType == 30);

      // check if is all lines deleted
      const hasAllLinesDeleted = this.consolidationOrder.isAllLinesDeleted;

      // check if zones contains thermo
      const hasThermo = this.zones
        .filter((z) => z.zoneGroupId == this.consolidationOrder.zoneGroupId)
        .some((z) => z.zoneType == 10);


      /* bypass focus if true */
      if (this.bypass) {

        this.form.get("totalPackage").enable();
        this.form.get("totalPackageThermolabile").enable();

      } else {

        // disable if one of the two above
        if (/* hasOriginal || */ hasAllLinesDeleted)
          this.form.get("totalPackage").disable(),
            this.form.get("totalPackageThermolabile").disable();
        else {
          if (hasThermo) {
            this.form.get("totalPackage").disable(),
              this.form.get("totalPackageThermolabile").enable();
          } else {
            this.form.get("totalPackage").enable(),
              this.form.get("totalPackageThermolabile").disable();
          }
        }

      }

      // set form data
      this.form.patchValue({
        preparationOrderId: this.consolidationOrder.id,
        zoneGroupId: this.consolidationOrder.zoneGroupId,
        totalPackage: this.consolidationOrder.totalPackage,
        totalPackageThermolabile:
          this.consolidationOrder.totalPackageThermolabile,
      });

      this.form.updateValueAndValidity();

      /* bypass focus if true */
      if (this.bypass) return;

      // set focus to input
      if (/* hasOriginal || */ hasAllLinesDeleted) {
        if (!this.isFixedAgent) this.agentInput.nativeElement.focus();
        else {
          this.saveBtn._elementRef.nativeElement.focus();
        }
      } else {
        if (hasThermo) {
          this.thermoInput.nativeElement.focus();
          this.thermoInput.nativeElement.select();
        } else {
          this.colisInput.nativeElement.focus();
          this.colisInput.nativeElement.select();
        }
      }
    } else {
      this.notificationsService.showNotification(
        "mat-warn",
        result.errorMessages.Error,
        "top",
        "right"
      );
      this.barcodeFormControl.setValue("", { emitEvent: false });
      return;
    }

    // if (!this.consolidationOrder) {
    //   this.notificationsService.showNotification('mat-warn', 'Commande en preparation', 'top', 'right');

    //   this.barcodeFormControl.setValue('', { emitEvent: false });
    //   return;
    // };
  }

  coliInputEnterClick() {
    if (this.hasThermo) {
      this.thermoInput.nativeElement.focus(),
        this.thermoInput.nativeElement.select();
    } else {
      this.isFixedAgent ? this.save() : this.agentInput.nativeElement.focus();
    }
  }

  lockField() {
    this.isFixedAgent = !this.isFixedAgent;

    if (this.isFixedAgent) {
      this.agentFormControl.disable({ emitEvent: false });
    } else {
      this.agentFormControl.enable();
    }
  }

  async save() {
    console.log(this.form.errors);
    console.log(this.form.valid);

    if (!this.form.valid) return;

    const response = await this.orderPreparationService
      .consolidate(this.form.getRawValue())
      .pipe(catchError((_) => of(_)))
      .toPromise();
    if (response == null) {
      this.notificationsService.showNotification(
        "mat-primary",
        "Succès ",
        "top",
        "right"
      );
      this.consolidationOrder = null;
      this.allSiblingOP = null;

      const val = {
        employeeCode: this.form.get("employeeCode").value,
        consolidatedById: this.form.get("consolidatedById").value,
        consolidatedByName: this.form.get("consolidatedByName").value,
      };
      this.form.reset();

      if (this.isFixedAgent) this.form.patchValue(val);

      this.barcodeFormControl.setValue("", { emitEvent: false });
    } else {
      let resultError = this.parseErrorHelper.parse(<Result>response);
      this.notificationsService.showNotification(
        "mat-warn",
        "Echec : " + resultError,
        "top",
        "right"
      );
    }

    if (!this.isFixedAgent)
      this.agentFormControl.setValue("", { emitEvent: false });

    debugger;

    this.barcodeRef.nativeElement.focus();
  }

  async printConsolidationOrder() {
    let consolidationOrder = <any>(
      await this.consolidationOrderService
        .getByOrderId(this.consolidationOrder.orderId)
        .toPromise()
    );
    const results: any = await this.consolidationOrderService
      .print(consolidationOrder.id)
      .pipe(catchError((_) => of({ error: true })))
      .toPromise();

    if (results.error) {
      this.notificationsService.showNotification(
        "mat-primary",
        "Succès",
        "bottom",
        "right"
      );

      this.consolidationOrder = null;
      this.allSiblingOP = null;

      this.barcodeFormControl.setValue("", { emitEvent: false });
    } else
      this.notificationsService.showNotification(
        "mat-warn",
        "Erreur",
        "bottom",
        "right"
      );
  }

  /* agent input field */
  agentFormControl = new FormControl(null);

  filteredOptions: Observable<string[]>;

  enter(auto: MatAutocomplete) {
    setTimeout(() => {
      auto.options.first.select();
    }, 100);
  }

  selectAgent(agent, saveButton) {
    this.form.get("employeeCode").setValue(agent.option.value.hrCode);
    this.form.get("consolidatedById").setValue(agent.option.value.id);
    this.form.get("consolidatedByName").setValue(agent.option.value.name);

    this.agentFormControl.setValue(agent.option.value.name, {
      emitEvent: false,
    });

    console.log(saveButton);

    setTimeout(() => {
      saveButton._elementRef.nativeElement.focus();
    }, 100);
    // this.save();
  }

  private _filter(value): string[] {
    console.log(value);

    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.consolidators.filter(
        (option) =>
          option.name.toLowerCase().includes(filterValue) ||
          option.hrCode == filterValue
      );
    }

    return this.consolidators;
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == "F1") {
      event.preventDefault();
      this.barcodeRef.nativeElement.focus();
    }
  }

  minValValidator(f) {
    const totalPackage = this?.form?.get("totalPackage")?.value;
    const totalPackageThermolabile = this?.form?.get(
      "totalPackageThermolabile"
    )?.value;

    return totalPackage < 1 &&
      totalPackageThermolabile < 1 &&
      !this.consolidationOrder?.isAllLinesDeleted
      ? { minValue: true }
      : null;
  }
}
