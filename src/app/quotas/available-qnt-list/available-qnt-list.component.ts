import { Component, OnInit, ViewChild } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { AuthService } from 'src/app/services/auth.service';
import { InventSumService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-available-qnt-list',
  templateUrl: './available-qnt-list.component.html',
  styleUrls: ['./available-qnt-list.component.sass']
})
export class AvailableQntListComponent implements OnInit {
  @ViewChild('grid',{static: false}) grid: GridComponent; 
  availableProduct  : any [] =  [];
  gridLines: string;
  toolbar: string[];
  public isLoading = false;
  constructor(private inventSumService : InventSumService, private authService :AuthService) { }

  async ngOnInit() {
    var orgId = this.authService.profile["organizationId"];
    this.gridLines = "Both";
    this.toolbar =  ['ExcelExport'];
    this.isLoading = true;
    this.availableProduct = await this.inventSumService.getProductsForQuota(orgId).toPromise();
    console.log(this.availableProduct);
    this.isLoading = false;
  }
  public toolbarClick(args: any): void {   
    this.grid.excelExport();
}
}
