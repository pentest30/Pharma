import { EmailModel } from './../email-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EmailAddComponent } from '../email-add/email-add.component';
import * as uuid from 'uuid';
@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.sass']
})
export class EmailListComponent implements OnInit {
 @Input() public emails : EmailModel[] = [];
 @Output() emailChanged = new EventEmitter<EmailModel[]>();
  constructor(private dialog: MatDialog, private notifHelper: NotificationHelper) { }

  ngOnInit(): void {
    console.log("here")
  }
  delete (row) {
    this.emails.forEach((item, index) => {
      if (item === row) {
        this.emails.splice(index, 1);
        this.emailChanged.emit(this.emails);
        return;
      }
    });

  }
  openDialog () {
    this.openPopup(null);

  }
  private openPopup(form) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = form != null ? form : {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(EmailAddComponent, dialogConfig);
    this.addEmails(modalRef);
  }
  addEmails(modalRef: MatDialogRef<EmailAddComponent, any>) {
    modalRef.afterClosed().subscribe(data => {
      if(data== null)
         return;
         var emailExist =false;
         
         this.emails.forEach((item, index)=> {
          if(item.email == data.email ) {
            emailExist = true;
            return;
          }
        });
        if(emailExist)
        return;
        data.id  = uuid.v4();
         this.emails.push(data);
      this.emailChanged.emit(this.emails);

    });
  }

}
