import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PhoneService } from 'src/app/services/phone.service';
import { CountryCode } from '../country-code';

@Component({
  selector: 'app-phone-add',
  templateUrl: './phone-add.component.html',
  styleUrls: ['./phone-add.component.sass']
})
export class PhoneAddComponent implements OnInit {
  
  public countryCode: string;
  public number: string;
  public id : string;
  public isFax : boolean = false;
  public modalTitle : string;
  public countryCodes : CountryCode[] = [];
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PhoneAddComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service : PhoneService) { 
      this.countryCode = data.countryCode;
      this.number = data.number;
      this.isFax = data.isFax;
    }

  ngOnInit(): void {
  this.service.getCountryCodes().subscribe(resp => {
    this.countryCodes = resp;
  })
    this.createFrom();
  }
  
  save(){
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if( this.form.value.isFax == null)
        this.form.value.isFax = false;
   
    this.dialogRef.close(this.form.value);
  }
  close(){
    this.dialogRef.close();
  }
  private createFrom() {
    this.form = this.fb.group({
      countryCode: [this.countryCode, [Validators.required]],
      number: [this.number, [Validators.required,Validators.pattern("[0-9]{9}")]],
      isFax : [this.isFax , []],
      id : [this.id , []]
    });
  }

}
