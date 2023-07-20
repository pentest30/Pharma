import { ConsolidationOrderService } from "src/app/services/consolidation-order.service";
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { Observable, of } from "rxjs";
import { startWith, tap, map, catchError, debounceTime } from "rxjs/operators";
import { EmployeeService } from "src/app/services/employee.service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { PreparationOrdersService } from "src/app/services/preparation-orders.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-expedition-listing",
  templateUrl: "./expedition-listing.component.html",
  styleUrls: ["./expedition-listing.component.sass"],
})
export class ExpeditionListingComponent implements OnInit {
  @ViewChild("grid") public grid: GridComponent;
  @ViewChild("barcodeRef") barcodeRef: ElementRef;
  @ViewChild("expeditionAgentInput") expeditionAgentInputRef: ElementRef;
  @ViewChild("consolidationAgentInput") consolidationAgentInputRef: ElementRef;

  filters: object = {};
  isOpen: any;
  barCode: string = "";
  EditByScan: boolean = false;
  barcodeFormControl = new FormControl();

  consolidators: any[];
  expeditors: any[];
  allSiblingOP: Array<any>;

  expeditionOrder: any = null;

  form = new FormGroup({
    id: new FormControl(null, Validators.required),
    consolidatedById: new FormControl(null, Validators.required),
    consolidatedByName: new FormControl(null, Validators.required),
    receivedInShippingById: new FormControl(null, Validators.required),
    receivedInShippingByName: new FormControl(null, Validators.required),
    totalPackage: new FormControl({ value: 0 }, [
      Validators.required,
      Validators.min(0),
    ]),
    totalPackageThermolabile: new FormControl({ value: 0 }, [
      Validators.required,
      Validators.min(0),
    ]),
    consolidated: new FormControl(true, Validators.required),
  });

  constructor(
    private notificationsService: NotificationHelper,
    private orderPreparationService: PreparationOrdersService,

    private consolidationService: ConsolidationOrderService,
    private employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewInit() { }

  async ngOnInit() {
    // get all agents of type: consolidation agent
    this.consolidators = await this.employeeService.getAll(2).toPromise();
    this.expeditors = await this.employeeService.getAll(5).toPromise();

    /* Agent input autocomplete listener  */
    this.filteredOptions_expedition =
      this.agentFormControl_expedition.valueChanges.pipe(
        startWith(""),
        tap((_) => {
          if (!_ || _.length == 0) return;
          this.form.get("receivedInShippingById").setValue(null);
          this.form.get("receivedInShippingByName").setValue(null);
        }),
        map((value) => this._filter_expedition(value || ""))
      );
    this.filteredOptions_consolidation =
      this.agentFormControl_consolidation.valueChanges.pipe(
        startWith(""),
        tap((_) => {
          if (!_ || _.length == 0) return;
          this.form.get("consolidatedById").setValue(null);
          this.form.get("consolidatedByName").setValue(null);
        }),
        map((value) => this._filter_consolidation(value || ""))
      );

    this.barcodeRef.nativeElement.focus();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (!params.orderIdentifier) return;
      this.barcodeFormControl.setValue(null, { emitEvent: true });
      this.barcodeFormControl.setValue(params.orderIdentifier, {
        emitEvent: true,
      });
      this.barcodeFormControl.updateValueAndValidity({
        emitEvent: true,
        onlySelf: false,
      });
      this.loadCMD(params.orderIdentifier);
    });
  }

  isFixedExpeditionAgent: boolean = false;

  lockField() {
    this.isFixedExpeditionAgent = !this.isFixedExpeditionAgent;

    if (this.isFixedExpeditionAgent) {
      this.agentFormControl_expedition.disable({ emitEvent: false });
    } else {
      this.agentFormControl_expedition.enable();
    }
  }

  async loadCMD(barcode) {
    if (barcode != null) this.barcodeFormControl.setValue(barcode);

    if (this.barcodeFormControl.value == "") return;

    // get consolidation order by barcode
    // test barcode: 2000001058405
    let result = await this.consolidationService
      .getByBarcode(this.barcodeFormControl.value)
      .pipe(catchError((err) => of(null)))
      .toPromise();
    if (result.consolidationOrder != null) {
      this.expeditionOrder = result.consolidationOrder;
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

    // set form data
    this.form.patchValue({
      id: this.expeditionOrder.id,
      consolidatedById: this.expeditionOrder.consolidatedById,
      consolidatedByName: this.expeditionOrder.consolidatedByName,
      totalPackageThermolabile: this.expeditionOrder.totalPackageThermolabile,
      totalPackage: this.expeditionOrder.totalPackage,
      consolidated: true,
    });

    this.allSiblingOP = await this.orderPreparationService
      .GetAllOpByOrder(this.expeditionOrder.orderId)
      .toPromise();

    // set focus to input
    setTimeout(() => {
      this.consolidationAgentInputRef.nativeElement.focus();
    }, 0);
  }

  async save() {
    console.log(this.form.value);

    if (!this.form.valid) return;

    const error = await this.consolidationService
      .update(this.form.getRawValue())
      .pipe(catchError((_) => of(_)))
      .toPromise();

    if (!error) {
      this.notificationsService.showNotification(
        "mat-primary",
        "Succès",
        "bottom",
        "right"
      );

      this.expeditionOrder = null;

      const val = this.form.value;

      this.form.reset();

      if (this.isFixedExpeditionAgent) {
        this.form
          .get("receivedInShippingById")
          .setValue(val.receivedInShippingById);
        this.form
          .get("receivedInShippingByName")
          .setValue(val.receivedInShippingByName);
      }

      this.barcodeFormControl.setValue("", { emitEvent: false });

      if (!this.isFixedExpeditionAgent)
        this.agentFormControl_expedition.setValue("", { emitEvent: false });
      this.agentFormControl_consolidation.setValue("", { emitEvent: false });
    } else
      this.notificationsService.showNotification(
        "mat-warn",
        "Erreur",
        "bottom",
        "right"
      );

    this.barcodeRef.nativeElement.focus();
  }

  /* agent input field */
  // Expedition
  agentFormControl_expedition = new FormControl(null);
  filteredOptions_expedition: Observable<string[]>;

  enter_expedition(auto) {
    setTimeout(() => {
      auto.options.first.select();
    }, 100);
  }

  selectAgent_expedition(agent, saveBtn) {
    this.form.get("receivedInShippingById").setValue(agent.option.value.id);
    this.form.get("receivedInShippingByName").setValue(agent.option.value.name);

    this.agentFormControl_expedition.setValue(agent.option.value.name, {
      emitEvent: false,
    });

    setTimeout(() => {
      saveBtn._elementRef.nativeElement.focus();
    }, 100);
  }

  private _filter_expedition(value): string[] {
    if (typeof value == "string") {
      const filterValue = value.toLowerCase();
      return this.expeditors.filter(
        (option) =>
          option.name.toLowerCase().includes(filterValue) ||
          option.hrCode == filterValue
      );
    }

    return this.expeditors;
  }
  // Consolidation
  agentFormControl_consolidation = new FormControl(null);
  filteredOptions_consolidation: Observable<string[]>;

  enter_consolidation(auto) {
    setTimeout(() => {
      auto.options.first.select();
    }, 100);
  }

  selectAgent_consolidation(agent, next) {
    this.form.get("consolidatedById").setValue(agent.option.value.id);
    this.form.get("consolidatedByName").setValue(agent.option.value.name);

    this.agentFormControl_consolidation.setValue(agent.option.value.name, {
      emitEvent: false,
    });

    if (this.expeditionOrder?.orderStatus == 100) {
      if (!this.isFixedExpeditionAgent) next.focus();
    } else {
      if (this.isFixedExpeditionAgent) this.save();
      else next.focus();
    }
  }

  private _filter_consolidation(value): string[] {
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
}
