import { EmailModel } from './../../email/email-model';
import { PhoneNumber } from './../../phone/phone';
import { NotificationHelper } from './../../shared/notif-helper';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Address } from 'src/app/address/address-model';
import { ManufacturerService } from 'src/app/services/manufacturer.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as uuid from 'uuid';

@Component({
  selector: 'app-manufacturer-add',
  templateUrl: './manufacturer-add.component.html',
  styleUrls: ['./manufacturer-add.component.sass']
})
export class ManufacturerAddComponent implements OnInit {
  public id: string;
  public name: string;
  public code: string;
  public addresses: Address[] = [];
  public phones : PhoneNumber[] = [];
  public emails : EmailModel[] = [];
  public modalTitle: string;
  submitted = false;
  public form: FormGroup;
  public showBlade: boolean = false;
  public showBreadCrumb : boolean = true;
  constructor(public snackBar: MatSnackBar,
     private fb: FormBuilder, 
     private notif: NotificationHelper, 
     private service :ManufacturerService, 
     private route :Router,
     //private dialogRef: MatDialogRef<ManufacturerAddComponent>,
     @Optional() @Inject(MAT_DIALOG_DATA)  public data
  ) { }

  ngOnInit(): void {
    this.id = uuid.v4();
    this.createForm();
    if(this.data) this.showBreadCrumb = false;
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
    try {
      this.service.addManufacturer(this.form.value).subscribe(msg => {
        this.notif.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
        if(this.route.url == '/manufacturer/manufacturer-add') this.route.navigate(["/manufacturer/manufacturer-list"]);
        //else this.dialogRef.close(this.id);
      }, (error) => {
        this.notif.showNotification('mat-warn', error, 'top', 'right');
        console.log(error.stack);
        return;
      });
    } catch (error) {
      
    }
  }
  close() {
    this.route.navigate(["/manufacturer/manufacturer-list"]);
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
  addressChanged(addresses: Address[]) {
    this.addresses = addresses;

  }
  phonesChanged (phones : PhoneNumber[]) {
    this.phones = phones;

  }
  emailChanged ( emails: EmailModel []) {
    this.emails = emails;
  }

}
