import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Navigation, Router } from "@angular/router";
import { Address } from "src/app/address/address-model";
import { EmailModel } from "src/app/email/email-model";
import { PhoneNumber } from "src/app/phone/phone";
import { CustomerService } from "src/app/services/customer.service";
import { NotificationHelper } from "src/app/shared/notif-helper";
import { BankAccount } from "../../bank-account/bank-model/bank";
import { Customer } from "../models/customer-model";

@Component({
  selector: "app-customer-edit",
  templateUrl: "./customer-edit.component.html",
  styleUrls: ["./customer-edit.component.sass"],
})
export class CustomerEditComponent implements OnInit {
  id: string;
  public name: string;
  public nif: string;
  public nis: string;
  public rc: string;
  public addresses: Address[] = [];
  public phones: PhoneNumber[] = [];
  public emails: EmailModel[] = [];
  public bankAccounts: BankAccount[] = [];
  public modalTitle: string;
  custmoer: Customer;
  ai: string;
  activity: number;
  establishmentDate?: Date;
  submitted = false;
  public form: FormGroup;
  public showBlade: boolean = false;
  organizationStatus: number;
  navigation: Navigation;
  eCommerce: boolean;
  public customPatterns = { "0": { pattern: new RegExp("[A-Z0-9]") } };
  organizationGroupCode: string;
  code: string;
  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private notif: NotificationHelper,
    private service: CustomerService,
    private route: Router
  ) {
    this.navigation = route.getCurrentNavigation();
  }

  ngOnInit(): void {
    this.createForm();
    var cDto = this.navigation.extras.state.customer as Customer;
    this.service.getById(cDto).subscribe((resp) => {
      this.custmoer = resp as Customer;
      this.addresses = this.custmoer.addresses;
      this.bankAccounts = this.custmoer.bankAccounts;
      this.phones = this.custmoer.phoneNumbers;
      this.emails = this.custmoer.emails;
      this.activity = this.custmoer.activity;
      this.organizationStatus = this.custmoer.organizationStatus;
      this.eCommerce = this.custmoer.eCommerce;
      this.code = this.custmoer.organizationGroupCode;
      this.initForm();
    });
  }
  initForm() {
    this.form.patchValue({
      nif: this.custmoer.nif,
      nis: this.custmoer.nis,
      rc: this.custmoer.rc,
      name: this.custmoer.name,
      ai: this.custmoer.ai,
      id: this.custmoer.id,
      establishmentDate: this.custmoer.establishmentDate,
      activity: this.custmoer.activity,
      organizationStatus: this.custmoer.organizationStatus,
      eCommerce: this.custmoer.eCommerce,
      code: this.custmoer.organizationGroupCode
    });
  }
  save() {
    let existPrincipalAdd = false;
    // valider le formulaire principal
    if (this.form.invalid) return;

    if (this.activity == undefined) {
      this.notif.showNotification(
        "mat-danger",
        "Il faut choisir une activité",
        "top",
        "right"
      );
      return;
    }
    // il faut ajouter au moins une adresse principale
    // une boucle pour verifier si ça existe  une adresse principale
    this.addresses.forEach((item, index) => {
      if (item.main) {
        existPrincipalAdd = true;
        return;
      }
    });
    // si elle n'existe pas une adresse principale afficher une erreur de validation.
    if (!existPrincipalAdd) {
      this.notif.showNotification(
        "mat-danger",
        "Il faut ajouter une adresse principale",
        "top",
        "right"
      );
      return;
    }
    this.form.value.addresses = this.addresses;
    this.form.value.phoneNumbers = this.phones;
    this.form.value.emails = this.emails;
    this.form.value.bankAccounts = this.bankAccounts;
    this.form.value.activity = this.activity;
    this.form.value.organizationStatus = this.organizationStatus;
    if (this.form.value.establishmentDate == undefined)
      this.form.value.establishmentDate = null;
    if (this.form.value.eCommerce == undefined)
      this.form.value.eCommerce = false;

    var customer = this.form.value as Customer;
    customer.organizationGroupCode = this.code;
    this.service.update(customer).subscribe(
      (msg) => {
        this.notif.showNotification(
          "mat-primary",
          "L'enregistrement est terminé avec succès",
          "top",
          "right"
        );
        this.close();
      },
      (error) => {
        this.notif.showNotification("mat-warn", error, "top", "right");
        return;
      }
    );
  }
  close() {
    this.route.navigate(["/tiers/customer/customer-list"]);
  }
  createForm() {
    this.form = this.fb.group({
      nif: [
        this.nif,
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(15),
        ],
      ],
      nis: [
        this.nis,
        [Validators.pattern(/^[0-9]*$/), Validators.minLength(15)],
      ],
      rc: [this.rc, [Validators.required, Validators.minLength(15)]],
      name: [this.name, [Validators.required]],
      ai: [
        this.ai,
        [
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
          Validators.minLength(11),
        ],
      ],
      id: [this.id, []],
      establishmentDate: [this.establishmentDate, []],
      addresses: [this.addresses, []],
      phonesNumbers: [this.phones, []],
      activity: [this.activity, []],
      emails: [this.emails, []],
      eCommerce: [this.eCommerce, []],
      code: [this.code, [Validators.required]],
    });
  }
  onSelectionChange($evt) {
    this.activity = parseInt($evt.value);
  }
  addressChanged(addresses: Address[]) {
    this.addresses = addresses;
  }
  phonesChanged(phones: PhoneNumber[]) {
    this.phones = phones;
  }
  emailChanged(emails: EmailModel[]) {
    this.emails = emails;
  }
  bankAccountChanged(bankAccounts: BankAccount[]) {
    this.bankAccounts = bankAccounts;
  }
}
