import { FormService } from 'src/app/services/form.service';
import { DciService } from './../../services/dci.service';
import { Dci } from './../../dci/dci-models/dci';
import { Component, Inject, OnInit } from '@angular/core';
import { Form } from 'src/app/form/models/form-model';
import { Dosage } from 'src/app/dosage/models/dosage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DciCodeService } from 'src/app/services/dci-code.service';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { DciCodeLine } from '../dci-code-models/dci-code-line';
import { DosageService } from 'src/app/services/dosage.service';
import * as uuid from 'uuid';
import { DciCode, InnCodeDosage } from '../dci-code-models/dci-code';
@Component({
  selector: 'app-dci-code-add',
  templateUrl: './dci-code-add.component.html',
  styleUrls: ['./dci-code-add.component.sass']
})
export class DciCodeAddComponent implements OnInit {
  public forms: Form[] = [];
  public formId: string;
  public innCodeDosages: InnCodeDosage[] = [];
  public dciDosages: DciCodeLine[] = [];
  public inns: Dci[] = [];
  public dosages: Dosage[] = []; public name: string;
  public id: string;
  public modalTitle: string;
  submitted = false;
  public form: FormGroup;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder,
    private dialogRef: MatDialogRef<DciCodeAddComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private formService: FormService,
    private service: DciCodeService,
    private dciService: DciService,
    private dosageService: DosageService,
    private notifHelper: NotificationHelper) {
    this.id = data.id;
    this.name = data.name;
    //this.forms = data.forms;
    this.innCodeDosages = data.innCodeDosages != null || data.innCodeDosages != undefined ? data.innCodeDosages : [];
    this.formId = data.formId;
    //this.dciDosages = data.dciDosages;
    if (data.id == null)
      this.modalTitle = "Créer";
    else {
      this.modalTitle = "Modifier";

    }
  }
  private createFrom() {
    this.form = this.fb.group({
      name: [this.name, [Validators.required]],
      formId: [this.formId, [Validators.required]],
      innCodeDosages: [this.innCodeDosages],
      id: [this.id, []]
    });
  }
  ngOnInit(): void {
    this.dosageService.getAll().subscribe(res => {

      this.dosages = res;
    });
    this.dciService.getAll().subscribe(res => {
      this.inns = res;

    });
    this.formService.getAll().subscribe(res => {
      this.forms = res;

    });
    for (let index = 0; index < this.innCodeDosages.length; index++) {
      const element = this.innCodeDosages[index];
      let line = new DciCodeLine();
      line.id = uuid.v4();
      line.dosage = this.dosages;
      line.inn = this.inns;
      line.dosageId = element.dosageId;
      line.innId = element.innId;
      this.dciDosages.push(line);
    }
    this.createFrom();
  }
  openDialog() {
    let line = new DciCodeLine();
    line.id = uuid.v4();
    line.dosage = this.dosages;
    line.inn = this.inns;
    this.dciDosages.push(line);

  }
  save() {
    if (this.form.invalid)
      return;
    var invalid = false;
    // traitement d'ajout 
    if (this.form.value.id == null) {
      this.form.value.innCodeDosages = [];
      this.form.value.id = uuid.v4();
      // vérifier est ce que le dosage et la dci  sont ils  nuls ou non
      for (let index = 0; index < this.dciDosages.length; index++) {
        const item = this.dciDosages[index];
        if (item.dosageId == null || item.innId == null) {
          invalid = true;
          break;
        }
      }
      if (invalid) {
        this.notifHelper.showNotification('mat-danger', "Dci et Dosage ne doivent pas êtres  nuls", 'top', 'right');
        this.form.value.id = null;
        return;
      }

      for (let index = 0; index < this.dciDosages.length; index++) {
        const item = this.dciDosages[index];
        this.pupulateLine(item);
      }
      
      this.addDci(this.form.value);

    }
    // traitement de modification
    else {
      this.form.value.innCodeDosages = [];
      for (let index = 0; index < this.dciDosages.length; index++) {
        const item = this.dciDosages[index];
        if (item.dosageId == null || item.innId == null) {
          invalid = true;
          break;
        }
      }
      if (invalid) {
        this.notifHelper.showNotification('mat-danger', "Dci et Dosage ne doivent pas êtres  nuls", 'top', 'right');
        return;
      }
      
      for (let index = 0; index < this.dciDosages.length; index++) {
        const item = this.dciDosages[index];

        this.pupulateLine(item);

      }
      this.updateDci(this.form.value);

    }

  }
  private pupulateLine(item: DciCodeLine) {
    var line = new InnCodeDosage();
    line.dosageId = item.dosageId;
    line.innCodeId = this.form.value.id;
    line.innId = item.innId;
    this.form.value.innCodeDosages.push(line);

  }

  updateDci(value: any) {
    this.service.update(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "La modification est terminée avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      
      return;
    });
  }
  addDci(value: DciCode) {
    this.service.add(value).subscribe(msg => {
      this.notifHelper.showNotification('mat-primary', "L'enregistrement est terminé avec succès", 'top', 'right');
      this.dialogRef.close(value);
    }, (error) => {
      this.notifHelper.showNotification('mat-warn', error, 'top', 'right');
      this.form.value.id = null;
      return;
    });
  }
  delete(row) {
    this.dciDosages.forEach((item, index) => {

      if (item.id == row.id)
        this.dciDosages.splice(index, 1);
    })
  }
  close() {
    this.dialogRef.close();
  }
}
