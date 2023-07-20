import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-arrival-list',
  templateUrl: './arrival-list.component.html',
  styleUrls: ['./arrival-list.component.sass']
})
export class ArrivalListComponent extends BaseComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  constructor( 
    
    private _auth: AuthService,
    ) { 
      super(_auth,'arrivals/');
    
  }

  ngOnInit(): void {
    this.loadData();
  }

}
