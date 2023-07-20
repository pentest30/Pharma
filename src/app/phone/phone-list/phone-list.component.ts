import { PhoneAddComponent } from './../phone-add/phone-add.component';
import { PhoneNumber } from './../phone';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import * as uuid from 'uuid';
@Component({
  selector: 'app-phone-list',
  templateUrl: './phone-list.component.html',
  styleUrls: ['./phone-list.component.sass']
})
export class PhoneListComponent implements OnInit {
  @Output() phoneChanged = new EventEmitter<PhoneNumber[]>();
  @Input() public phones: PhoneNumber[] = [];
  constructor(private dialog: MatDialog, private notifHelper: NotificationHelper) { }

  ngOnInit(): void {
  }
  openDialog() {
    this.openPopup(null);

  }
  private openPopup(form) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = form != null ? form : {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(PhoneAddComponent, dialogConfig);
    this.addPhones(modalRef);
  }
  addPhones(modalRef: MatDialogRef<PhoneAddComponent, any>) {
    modalRef.afterClosed().subscribe(data => {
      if(data== null)
         return;
         var phoneExist =false;
         console.log(data);
         this.phones.forEach((item, index)=> {
          if(item.coutryCode == data.coutryCode && item.number == data.number) {
            phoneExist = true;
            return;
          }
        });
        if(phoneExist)
        return;
      data.id  = uuid.v4();
      this.phones.push(data);
      this.phoneChanged.emit(this.phones);

    });
  }
  delete(row) {
    this.phones.forEach((item, index) => {
      if (item === row) {
        this.phones.splice(index, 1);
        this.phoneChanged.emit(this.phones);
      }
    });
  }
}


