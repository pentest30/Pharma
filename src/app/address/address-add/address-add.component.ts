
import { AddressService } from './../../services/address.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { City, Country, State } from '../country';

@Component({
  selector: 'address-add',
  templateUrl: './address-add.component.html',
  styleUrls: ['./address-add.component.sass']
})
export class AddressAddComponent implements OnInit {
  public city: string;
  public country: string;
  public zipCode: string;
  public street: string;
  public id : string;
  public main : boolean = false;
  public billing : boolean = false;
  public shipping : boolean = false;
  public modalTitle : string;
  public countries :Country[];
  public states : State[];
  public cities  : City[] = [];
  public regions : string [];
  public state : string ;
  public township :string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddressAddComponent>,
    @Inject(MAT_DIALOG_DATA) data, private service :AddressService) {
      this.city = data.city;
      this.country = data.country;
      this.street = data.street;
      this.zipCode = data.zipCode;
      this.main = data.main;
      this.state =data.state;
      this.township = data.township;
      this.billing = data.billing;
      this.shipping = data.shipping;
     }

  
  ngOnInit(): void {
    this.service.getCountries().subscribe(resp => {
      this.countries = resp;
    })
    this.createFrom();
  }
  onSelectCountry ($evt ){
    console.log($evt)
    this.countries.forEach((item, index)=> {
      if(item.name == $evt){
        this.states = item.states;
        return false;
      }
    });
    
  }
  onSelectState ($evt ){
    var cities :  City [] = [];
    this.states.forEach((item, idx)=> {
      if(item.name ==$evt) {
        cities = item.dairas;
        //return;
      }
    
    });
    
    this.cities = [];
    for (let index = 0; index < cities.length-1; index++) {
      const element = cities[index];
      this.cities.push(...element.communes);
    }
    
   
  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    if( this.form.value.main == null)
        this.form.value.main = false;
    if( this.form.value.billing == null)
        this.form.value.billing = false;
    if( this.form.value.shipping == null)
        this.form.value.shipping = false;
    else {
      
    }
    this.dialogRef.close(this.form.value);
  }
  close () {
    this.dialogRef.close();
  }
  private createFrom() {
    this.form = this.fb.group({
      country: [this.country, [Validators.required]],
      city: [this.city, [Validators.required]],
      state : [this.state, [Validators.required]],
      street: [this.street, [Validators.required]],
      zipCode: [this.zipCode, []],
      township : [this.township, [Validators.required]],
      main : [this.main , []],
      billing : [this.billing, []],
      shipping :[this.shipping,[]],
      id : [this.id , []]
    });
  }
}
