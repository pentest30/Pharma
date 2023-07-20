import { PaymentMode } from "./../models/client-model";
import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Router } from "@angular/router";
import { ProductClass } from "src/app/product-class/models/product-class-model";
import { ProductClassService } from "src/app/product-class/product-class-list/product-class.service";
import { ClientService } from "src/app/services/client.service";
import { TaxGroupService } from "src/app/services/tax-group.service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { TaxGroup } from "src/app/tax-group/models/tax-group";
import { Customer } from "../../customer/models/customer-model";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs/internal/Observable";
import { UserApp } from "src/app/membership/models/user-app";
import { UserService } from "src/app/services/user.service";
import { Sector } from "../../sector-client/models/sector";
import { SectorService } from "src/app/services/sector.service";
import { Address } from "src/app/address/address-model";
import { EmailModel } from "src/app/email/email-model";
import { BankAccount } from "../../bank-account/bank-model/bank";
import { PhoneNumber } from "src/app/phone/phone";

@Component({
  selector: "app-client-add",
  templateUrl: "./client-add.component.html",
  styleUrls: ["./client-add.component.sass"],
})
export class ClientAddComponent implements OnInit {
  id: string = undefined;
  @Output() notifyDataTabale = new EventEmitter();
  public onlineCustomer: boolean = true;
  public isPickUpLocation: boolean = true;
  public deliveryType: number = 0;
  public quotaEligibility: boolean = false;
  currentClientId: any;
  public defaultSalesPerson: string;
  public salesPersons: UserApp[];
  public salesGroups: any[];
  public sectors: Sector[];
  public defaultSalesGroup: string;

  public defaultDeliverySector: string;

  public customerState: number = 0;

  public productClasses?: ProductClass[];
  public potentialCustomers: Customer[];
  public allowedProductClasses?: ProductClass[] = [];
  public allowedProductClasseIds?: string[] = [];
  public taxGroups: TaxGroup[];
  public taxGroupId: string;
  public organizationId: string;
  public organizationName: string;
  submitted = false;
  isDisplayable = false;
  public form: FormGroup;
  code: string;
  addresses: Address[] = [];
  emails: EmailModel[] = [];
  bankAccounts: BankAccount[] = [];
  phoneNumbers: PhoneNumber[] = [];
  gridLines: any;
  customers: any[] = [];
  organizationGroupCode: string;
  paymentModeList: (string | PaymentMode)[];
  public paymentModes = PaymentMode;
  paymentMode: any;
  limitCredit: any;
  paymentDeadline: any;
  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private dialogRef: MatDialogRef<ClientAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private productClassService: ProductClassService,
    private taxGroupService: TaxGroupService,
    private userService: UserService,
    private service: ClientService,
    private route: Router,
    private sectorService: SectorService
  ) {
    this.getTaxes();
    if (data.id != undefined) {
      console.log("data = " + data);
      this.customers.push(data);
      this.id = data.id;
      this.organizationName = data.organizationName;
      this.customerState = data.customerState;
      this.taxGroupId = data.taxGroupId;
      this.allowedProductClasseIds = data.allowedProductClasses.map(
        (x) => x.id
      );
      this.quotaEligibility = data.quotaEligibility;
      this.deliveryType = data.deliveryType;
      this.defaultDeliverySector = data.defaultDeliverySector;
      this.defaultSalesGroup = data.defaultSalesGroup;
      this.defaultSalesPerson = data.defaultSalesPerson;
      this.isPickUpLocation = data.isPickUpLocation;
      this.organizationId = data.organizationId;
      this.code = data.code;
      this.addresses = data.addresses;
      this.emails = data.emails;
      this.bankAccounts = data.bankAccounts;
      this.phoneNumbers = data.phoneNumbers;
      this.organizationGroupCode = data.organizationGroupCode;
      this.paymentMode = data.paymentMode;
      this.limitCredit = data.limitCredit;
      this.paymentDeadline = data.paymentDeadline;
    }
  }
  async getTaxes() {
    this.taxGroups = await this.taxGroupService.getAll().toPromise();
  }
  filteredCustomers: Observable<Customer[]>;
  matautocomplete_organization = new FormControl();

  ngOnInit(): void {
    this.paymentModeList = Object.values(this.paymentModes).filter(
      (f) => !isNaN(Number(f))
    );
    this.gridLines = "Both";

    this.userService.getSalesPersons().subscribe((resp) => {
      this.salesPersons = resp;
    });

    this.productClassService.getAllProductClasses().subscribe((resp) => {
      this.productClasses = resp;
      if (this.id != undefined)
        this.allowedProductClasses = resp.filter((x) =>
          this.allowedProductClasseIds.some((y) => y == x.id)
        );
    });
    // this.taxGroupService.getAll().subscribe(resp => {

    //   this.taxGroups = resp;
    //   console.log(this.taxGroups)
    // })
    this.service.getPotentialCustomers().subscribe((resp) => {
      this.potentialCustomers = resp;
    });
    this.sectorService.getAll().subscribe((rsp) => {
      this.sectors = rsp;
    });

    this.createForm();
  }
  async onClientSelection(event) {
    this.currentClientId = event;
    if (this.currentClientId != null) {
      let currentClient = this.potentialCustomers.find(
        (x) => x.id === this.currentClientId
      );
      this.isDisplayable = true;
      this.form
        .get("organizationGroupCode")
        .setValue(currentClient.organizationGroupCode);
      this.form.controls["organizationGroupCode"].disable();
    }
  }
  private _filter(value): Customer[] {
    if (value == undefined || this.potentialCustomers == undefined) return [];
    const filterValue = value.toLowerCase();
    var filterdList = this.potentialCustomers.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
    if (filterdList != undefined && filterdList.length > 0) {
      this.organizationId = filterdList[0].id;
    }

    return filterdList;
  }
  save() {
    // valider le formulaire principal
    if (this.form.invalid) return;
    if (this.form.value.id === null) {
      console.log(this.form.value.organizationId);
      //this.form.value.organizationId = this.organizationId;
      this.form.value.allowedProductClasses =
        this.allowedProductClasseIds /*.map(w=>w.id)*/;
      this.form.value.organizationStatus = 0;
      this.form.value.deliveryType = this.deliveryType;
      this.form.value.isCustomer = true;
      this.service.post(this.form.value).subscribe(
        (msg) => {
          this.notif.showNotification(
            "mat-primary",
            "L'affectation du client est terminée avec succès",
            "top",
            "right"
          );
          this.dialogRef.close(this.form.value);
        },
        (error) => {
          this.notif.showNotification("mat-warn", error, "top", "right");
          return;
        }
      );
    } else {
      this.form.value.organizationId = this.organizationId;
      this.form.value.allowedProductClasses =
        this.allowedProductClasseIds /*.map(w=>w.id)*/;
      this.form.value.customerState = this.customerState;
      this.form.value.deliveryType = this.deliveryType;
      this.form.value.isCustomer = true;
      this.service.update(this.form.value).subscribe(
        (msg) => {
          this.notif.showNotification(
            "mat-primary",
            "La modification du client est terminée avec succès",
            "top",
            "right"
          );
          this.dialogRef.close(this.form.value);
        },
        (error) => {
          this.notif.showNotification("mat-warn", error, "top", "right");
        }
      );
    }
    this.notifyDataTabale.emit(this.form.value);
  }
  close() {
    this.dialogRef.close();
  }
  onSelectClass($evt) {
      if ($evt.includes('All') && this.allowedProductClasseIds == null) {
      this.allowedProductClasseIds = this.productClasses.map((v) => v.id);
      this.form.controls.allowedProductClasseIds.setValue(this.allowedProductClasseIds);
    } else if($evt.includes('All') && this.allowedProductClasseIds != null) {
      this.allowedProductClasseIds = null;
      this.allowedProductClasseIds = this.productClasses.map((v) => v.id);
      this.form.controls.allowedProductClasseIds.setValue(this.allowedProductClasseIds);
    }
    else{
      this.allowedProductClasseIds = $evt;
    }
  }
  onDeliveryTypeSelectionChange($evt) {
    this.deliveryType = parseInt($evt.value);
  }
  onStatusSelectionChange($evt) {
    this.customerState = parseInt($evt.value);
  }
  onTaxSelectionChange($evt) {
    this.taxGroupId = $evt.value;
  }
  createForm() {
    console.log(this.taxGroupId);
    this.form = this.fb.group({
      defaultDeliverySector: [this.defaultDeliverySector],
      organizationStatus: [0],
      organizationId: [this.organizationId],
      onlineCustomer: [this.onlineCustomer],
      quotaEligibility: [this.quotaEligibility],
      organizationName: [this.organizationName],
      defaultSalesPerson: [this.defaultSalesPerson],
      defaultSalesGroup: [this.defaultSalesGroup],
      isPickUpLocation: [this.isPickUpLocation],
      deliveryType: [this.deliveryType],
      code: [this.code],
      taxGroupId: [this.taxGroupId],
      organizationGroupCode: [this.organizationGroupCode],
      allowedProductClasseIds: [this.allowedProductClasseIds],
      isCustomer: [true],
      id: [this.id],
      customerState: [this.customerState],
      paymentMode: [this.paymentMode],
      limitCredit: [this.limitCredit],
      paymentDeadline: [this.paymentDeadline],
    });
  }
}
