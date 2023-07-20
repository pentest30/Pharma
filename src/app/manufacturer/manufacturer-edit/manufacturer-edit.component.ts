
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/address/address-model';
import { EmailModel } from 'src/app/email/email-model';
import { PhoneNumber } from 'src/app/phone/phone';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-manufacturer-edit',
  templateUrl: './manufacturer-edit.component.html',
  styleUrls: ['./manufacturer-edit.component.sass']
})
export class ManufacturerEditComponent implements OnInit {
  public id: string = null;
  public name: string;
  public code: string;
  public addresses: Address[] = [];
  public phones : PhoneNumber[] = [];
  public emails : EmailModel[] = [];
  public modalTitle: string;
  submitted = false;
  public form: FormGroup;
  public showBlade: boolean = false;
  private sub: any;
  constructor(private router :Router,  private fb: FormBuilder,  private notif: NotificationHelper, private service :ManufacturerService ) { 
    let manufacturer= this.router.getCurrentNavigation().extras.state.manufacturer;
    this.id = manufacturer.id;
    this.name = manufacturer.name;
    this.code = manufacturer.code;
    this.emails = manufacturer.emails;
    this.addresses = manufacturer.addresses;
    this.phones = manufacturer.phoneNumbers;

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
  this.service.updateManufacturer(this.form.value).subscribe(msg => {
    this.notif.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
    this.router.navigate(["/manufacturer/manufacturer-list"]);
    
  }, (error) => {
    this.notif.showNotification('mat-warn', error, 'top', 'right');
    return;
  });
}
close() {
  this.router.navigate(["/manufacturer/manufacturer-list"]);
}
emailChanged(emails : EmailModel[]) {
  this.emails = emails;

}
addressChanged(address : Address[]) {
  this.addresses = address;
}
phonesChanged(phones : PhoneNumber[]) {
 this.phones = phones;
}
  
ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.form = this.fb.group({
      code: [this.code, [Validators.required]],
      name: [this.name, [Validators.required]],
      id: [this.id, []],
      addresses: [this.addresses, []],
      phonesNumbers: [this.phones, []],
      emails : [this.emails, []]
    });
  }

}
