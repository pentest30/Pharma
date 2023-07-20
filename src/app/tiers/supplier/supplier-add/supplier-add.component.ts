import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address } from 'src/app/address/address-model';
import { EmailModel } from 'src/app/email/email-model';
import { PhoneNumber } from 'src/app/phone/phone';
import { SupplierService } from 'src/app/services/supplier.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { BankAccount } from '../../bank-account/bank-model/bank';

@Component({
  selector: 'app-supplier-add',
  templateUrl: './supplier-add.component.html',
  styleUrls: ['./supplier-add.component.sass']
})
export class SupplierAddComponent implements OnInit {
 id :string;
  public name: string;
  public nif: string;
  public nis: string;
  public rc: string;
  public ai:string;
  public addresses: Address[] = [];
  public bankAccounts : BankAccount[] = [];
  public phones : PhoneNumber[] = [];
  public emails : EmailModel[] = [];
  public modalTitle: string;
  activity : number = 0;
  establishmentDate? : Date;
  submitted = false;
  public form: FormGroup;
  public showBlade: boolean = false;
  constructor(public snackBar: MatSnackBar,
     private fb: FormBuilder, 
     private notif: NotificationHelper, 
     private service :SupplierService, private route :Router) { }

  ngOnInit(): void {
    this.createForm();
  }
  save() {
    let existPrincipalAdd = false;
    // valider le formulaire principal 
    if (this.form.invalid)
      return;
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
    this.form.value.addresses = this.addresses;
    this.form.value.phoneNumbers = this.phones;
    this.form.value.emails = this.emails;
    this.form.value.bankAccounts = this.bankAccounts;
    this.service.add(this.form.value).subscribe(msg => {
      this.notif.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.close();
      
    }, (error) => {
      this.notif.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  close() {
    this.route.navigate(["/tiers/supplier/supplier-list"]);
  }
  
  createForm() {
    this.form = this.fb.group({
      nif: [this.nif, [Validators.required], [Validators.pattern(/^[0-9]\d*$/)]],
      nis: [this.nis, [Validators.required]],
      rc: [this.rc, [Validators.required], [Validators.pattern(/^[0-9a-zA-Z\- \/_?:.,\s]+$/)]],
      ai:[this.ai,[Validators.required]],
      name: [this.name, [Validators.required]],
      id: [this.id, []],
      establishmentDate : [this.establishmentDate,[]],
      addresses: [this.addresses, []],
      phonesNumbers: [this.phones, []],
      activity : [this.activity, []],
      emails : [this.emails, []]
    });
  }
  onSelectionChange($evt) {
    console.log($evt.value)
    this.activity = $evt.value;
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



