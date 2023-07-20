import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BankAccountAddComponent } from '../bank-account-add/bank-account-add.component';
import { BankAccount } from '../bank-model/bank';
import * as uuid from 'uuid';
@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.sass']
})
export class BankAccountListComponent implements OnInit {

  @Input() public bankAccounts: BankAccount[] = [];
  @Output() bankAccountChanged = new EventEmitter<BankAccount[]>();
  constructor(private dialog: MatDialog) { }
  openDialog() {
    this.openPopup(null);

  }
  private openPopup(form) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = form != null ? form : {};
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    var modalRef = this.dialog.open(BankAccountAddComponent, dialogConfig);
    this.addBankAccount(modalRef);
  }

  private addBankAccount(modalRef) {
    //let notValid= false;
    modalRef.afterClosed().subscribe(data => {
      if (data == null || data.number == null)
        return;
      data.id = uuid.v4();
      this.bankAccounts.push(data);
      this.bankAccountChanged.emit(this.bankAccounts);

    });
  }
  delete(row) {
    this.bankAccounts.forEach((item, index) => {
      if (item === row) {
        this.bankAccounts.splice(index, 1);
        this.bankAccountChanged.emit(this.bankAccounts);
      }
    });
  }
  ngOnInit(): void {
    console.log("im here !!")
  }

}
