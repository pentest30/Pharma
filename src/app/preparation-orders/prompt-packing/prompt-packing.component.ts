import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationHelper } from 'src/app/shared/notif-helper';

@Component({
  selector: 'app-prompt-packing',
  templateUrl: './prompt-packing.component.html',
  styleUrls: ['./prompt-packing.component.sass']
})
export class PromptPackingComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PromptPackingComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private notif: NotificationHelper
  ) {
    this.packing=data.packing;
   }
 packing:number=0;

  async ngOnInit(): Promise<void> {
    
  }
  async save () {
    if(!this.packing||this.packing<1) {
      this.notif.showNotification('mat-warn',"La quantité doit être supérieure à 0",'top','right');
      return;
    }
       this.dialogRef.close(this.packing);
        }
  close (){
    this.dialogRef.close(null);
  }

}
