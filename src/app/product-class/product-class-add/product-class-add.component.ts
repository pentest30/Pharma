import { ProductClass } from './../models/product-class-model';
import { ProductClassService } from './../product-class-list/product-class.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-product-class-add',
  templateUrl: './product-class-add.component.html',
  styleUrls: ['./product-class-add.component.sass']
})

export class ProductClassAddComponent implements OnInit {
  public name: string;
  public description: string;
  public isMedicamentClass: boolean = false;
  public parentProductClassId: string;
  public id : string;
  submitted = false;
  public form: FormGroup;
  public productClasses: ProductClass[] ;
  @Output() notifyDataTabale = new EventEmitter();
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductClassAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private productClassService: ProductClassService) {

    this.description = data.description;
    this.name = data.name;
    this.isMedicamentClass = data.isMedicamentClass;
    this.parentProductClassId = data.parentProductClassId;
    this.id = data.id;

  }
  save() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    if(this.form.value.id  === null ) 
      this.addProductClass(this.form.value);
    else this.updateProductClass(this.form.value);

  }
  private updateProductClass(productCLass) {
   
    this.productClassService.updateProductClass(productCLass).subscribe(msg => {
      this.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(productCLass);
     // this.notifyDataTabale.emit();
    }, (error) => {
      this.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }
  private addProductClass(productCLass) {
   
    if(productCLass.isMedicamentClass ==null )
      productCLass.isMedicamentClass = false;
    this.productClassService.addProductClass(productCLass).subscribe(msg => {
      this.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(productCLass);
     // this.notifyDataTabale.emit();
    }, (error) => {
      this.showNotification('mat-warn', error, 'top', 'right');
      return;
    });
  }

  showNotification(cls, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 3000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: ['mat-toolbar', cls]
    });
  }
  close() {
    this.dialogRef.close();
  }
  ngOnInit(): void {
     this.productClassService.getAllProductClasses().subscribe(resp => {
      this.productClasses  = resp;
    })
    this.createFrom();
  }


  private createFrom() {
    this.form = this.fb.group({
      description: [this.description, []],
      name: [this.name, [Validators.required]],
      isMedicamentClass: [this.isMedicamentClass, []],
      parentProductClassId: [this.parentProductClassId , []],
      id : [this.id , []]
    });
  }
}
