import { DateHelper } from 'src/app/shared/date-helper';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address } from 'src/app/address/address-model';
import { EmailModel } from 'src/app/email/email-model';
import { PhoneNumber } from 'src/app/phone/phone';
import { CustomerService } from 'src/app/services/customer.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BankAccount } from '../../bank-account/bank-model/bank';
import { Customer } from '../models/customer-model';
import * as uuid from 'uuid';
import { ClientService } from 'src/app/services/client.service';
import { Client } from '../../client/models/client-model';
import { ProductClassService } from 'src/app/product-class/product-class-list/product-class.service';
@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.sass']
})
export class CustomerAddComponent implements OnInit {
 id :string;
  public name: string;
  public nif: string;
  public nis: string;
  public rc: string;
  public addresses: Address[] = [];
  public phones : PhoneNumber[] = [];
  public emails : EmailModel[] = [];
  public bankAccounts : BankAccount[] = [];
  public modalTitle: string;
  public eCommerce  : boolean = false;
  ai : string;
  activity : number =0;
  establishmentDate? : Date;
  private dateHelper:DateHelper;
  submitted = false;
  public form: FormGroup;
  public showBlade: boolean = false;
  public customPatterns = { '0': { pattern: new RegExp('[A-Z0-9]')} };
  isSupplier :boolean =  false;
  code: string;
  public productClasses : any [] = [];
  constructor(public snackBar: MatSnackBar,
     private fb: FormBuilder,
     private notif: NotificationHelper,
     private service :CustomerService,
     private clientService: ClientService,
     private productClassService: ProductClassService,
      private route :Router) {

       try {
        this.isSupplier =  this.route.getCurrentNavigation().extras.state.isSupplier;
        console.log(this.isSupplier);
       } catch (error) {
        console.log(error);
       }
      }

  async ngOnInit(){
    this.createForm();
    if(this.isSupplier)  {
      this.productClasses = await this.productClassService.getAllProductClasses().toPromise();
    }
  }
async  save() {
    let existPrincipalAdd = false;
    // valider le formulaire principal
    if (this.form.invalid)
      return;

    if(this.activity == undefined){
      this.notif.showNotification('mat-danger', "Il faut choisir une activité", 'top', 'right');
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
      this.notif.showNotification('mat-danger', "Il faut ajouter une adresse principale", 'top', 'right');
      return;


    }
    this.form.value.id =  uuid.v4();
    this.form.value.addresses = this.addresses;
    this.form.value.phoneNumbers = this.phones;
    this.form.value.emails = this.emails;
    this.form.value.bankAccounts = this.bankAccounts;
    this.form.value.activity = this.activity;
    if(this.form.value.eCommerce == undefined)
      this.form.value.eCommerce  = false;
    var customer = this.form.value as Customer;
    if(this.form.value.establishmentDate == undefined){
      this.form.value.establishmentDate = null;
    }else{
      customer.establishmentDate = this.form.value.establishmentDate;
    }
    customer.organizationGroupCode = this.form.value.code;
    this.service.add(customer).subscribe(msg => {

     if(this.isSupplier) {
      var clt = new Client();
      clt.organizationId =   this.form.value.id;
      clt.organizationStatus = 0;
       clt.allowedProductClasses = this.productClasses.map(m=> m.id);
      this.clientService.post( clt).subscribe(resp => {
        this.notif.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
        this.route.navigate(['/tiers/supplier/supplier-list']);
      })


    }
    else {
      this.notif.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.close();
    }
    }, (error) => {
      this.notif.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close() {
    this.route.navigate(["/tiers/customer/customer-list"]);
  }
  createForm() {
    this.form = this.fb.group({
      nif: [this.nif, [Validators.required ,Validators.pattern(/^[0-9]*$/), Validators.minLength(15)]],
      nis: [this.nis, [ Validators.pattern(/^[0-9]*$/), Validators.minLength(15)]],
      rc: [this.rc, [Validators.required, Validators.minLength(10)]],
      name: [this.name, [Validators.required]],
      code: [this.code, [Validators.required]],
      ai: [this.ai, [Validators.required,Validators.pattern(/^[0-9]*$/), Validators.minLength(11)]],
      id: [this.id, []],
      establishmentDate : [new Date(), [Validators.required]],
      addresses: [this.addresses, []],
      phonesNumbers: [this.phones, []],
      activity : [this.activity, []],
      emails : [this.emails, []],
      eCommerce :[this.eCommerce, []]

    });
  }
  onSelectionChange($evt) {
    console.log($evt.value)
    this.activity =parseInt( $evt.value);
  }
  addressChanged(addresses: Address[]) {
    this.addresses = addresses;

  }
  phonesChanged (phones : PhoneNumber[]) {
    this.phones = phones;

  }
  emailChanged ( emails: EmailModel []) {
    this.emails = emails;
  }
  bankAccountChanged (bankAccounts : BankAccount[]) {
    this.bankAccounts = bankAccounts;

  }

}



