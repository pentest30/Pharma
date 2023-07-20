import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detail-product-list',
  templateUrl: './detail-product-list.component.html',
  styleUrls: ['./detail-product-list.component.sass']
})
export class DetailProductListComponent implements OnInit {
  eventsSubjectByProducts: Subject<void> = new Subject<void>();
  customerId : any = null;
  constructor() { }

  ngOnInit(): void {
   
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.fetchProducts();
  }
  fetchProducts() {
    this.eventsSubjectByProducts.next();
  }

}
