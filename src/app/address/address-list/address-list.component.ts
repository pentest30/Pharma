import { Address } from './../address-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddressAddComponent } from '../address-add/address-add.component';
import { NotificationHelper } from 'src/app/shared/notif-helper';
import * as uuid from 'uuid';
@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.sass']
})
export class AddressListComponent implements OnInit {
  @Input() public addresses: Address[] = [];
  @Output() addressChanged = new EventEmitter<Address[]>();
  constructor(private dialog: MatDialog, private notifHelper : NotificationHelper) { }
  openDialog() {
    this.openPopup(null);
    
  }
  private openPopup(form) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = form!=null? form: {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(AddressAddComponent, dialogConfig);
    this.addAddress(modalRef);
  }

  private addAddress(modalRef) {
    let notValid= false;
    modalRef.afterClosed().subscribe(data => {
      if (data == null || data.country == null)
        return;
        
      if(data.main == true) {
        this.addresses.forEach((item, index)=>  {
          if(item.main == true) {
            this.notifHelper.showNotification('mat-danger', "ça existe déjà une adresse principale", 'top', 'right');
            notValid = true;
            return;
          }


        });
        if(notValid){
          this.openPopup(data);
          return;
        }

      }  
      data.id  = uuid.v4();
      this.addresses.push(data);
      this.addressChanged.emit(this.addresses);

    });
  }
  delete(row) {
    this.addresses.forEach((item, index) => {
      if (item === row) {
        this.addresses.splice(index, 1);
        this.addressChanged.emit(this.addresses);
      }
    });
  }
  ngOnInit(): void {
  }

}
