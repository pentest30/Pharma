import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Navigation, Router } from '@angular/router';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-detail-invoice',
  templateUrl: './detail-invoice.component.html',
  styleUrls: ['./detail-invoice.component.sass']
})
export class DetailInvoiceComponent implements OnInit {
  invoice: any;
  navigation: Navigation;
  isLoading: boolean = false;
  order: any;
  @ViewChild('detailgrid') public grid: GridComponent;
  gridLines: string;

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
    private orderService: InvoiceService,
    private dialogRef: MatDialogRef<DetailInvoiceComponent>,
     @Inject(MAT_DIALOG_DATA) private data,) { }

  ngOnInit(): void {
    this.gridLines = 'Both';
    try { 
      this.invoice = this.data.invoice;
      this.isLoading = true;
    } catch (error) {
      this.isLoading = false;
    }
  }
  public dataBound(e) {
    this.grid.height = window.innerHeight - 350;
  }
  getIndexRow(index) {
    return parseInt(index) + 1 ;
  }
 
  close() {
    this.dialogRef.close();
  }
}
