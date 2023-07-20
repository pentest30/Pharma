import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { loadCldr } from '@syncfusion/ej2-base';
import { CreditNoteService } from 'src/app/services/credit-note.service';

@Component({
  selector: 'app-customer-credit-detail',
  templateUrl: './customer-credit-detail.component.html',
  styleUrls: ['./customer-credit-detail.component.sass']
})
export class CustomerCreditDetailComponent implements OnInit {
  isLoading: boolean = false;
  @ViewChild('detailgrid') public grid: GridComponent;
  gridLines: string;
  customerCredit: any;
  @HostListener('resize', ['$event'])
  onResize(event) {
    var offsetHeight = event.target.innerHeight - 350 ;
    setTimeout(()=> {
      this.grid.height = offsetHeight + "px";
    }, 0);
  
  }
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        this.close();
        break;
      default:
        break;
    }
  }
  constructor( public router: Router,
    private creditNoteService: CreditNoteService,
    private dialogRef: MatDialogRef<CustomerCreditDetailComponent>,
     @Inject(MAT_DIALOG_DATA) private data,) { 
      loadCldr(require('./../../shared/trans.json'));
      loadCldr(require('./../../sales/numbers.json'));
     }

  ngOnInit(): void {
    this.gridLines = 'Both';
    try { 
      this.customerCredit = this.data.creditNote;
      this.isLoading = true;
    } catch (error) {
      this.isLoading = false;
    }
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
  close() {
    this.dialogRef.close();
  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 350;
  }

}
