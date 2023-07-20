import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confim-dialog',
  templateUrl: './confim-dialog.component.html',
  styleUrls: ['./confim-dialog.component.sass']
})
export class ConfimDialogComponent implements OnInit {
  @ViewChild('yes') yes:MatButton;
  @ViewChild('no') no:MatButton;
  title: string;
  message: string;
  focusYes:boolean=false;
  information:boolean=false;
  constructor(public dialogRef: MatDialogRef<ConfimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) { 
      this.title = data.title;
      this.message = data.message;
this.focusYes=data.focusNo?false:true;
if(data.information==undefined) this.information=false;
else
this.information=data.information?true:false;
      
    }

  ngOnInit(): void { 
  }
  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
export class ConfirmDialogModel {

  constructor(public title: string, public message: string,public focusNo:boolean=false,public information=false) {
  }
}
