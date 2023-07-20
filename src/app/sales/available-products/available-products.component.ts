import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/product/prodcut-models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.sass']
})
export class AvailableProductsComponent implements OnInit {
  cachedProduct: Product [];
  gridLines: string;

  constructor(private productService: ProductService) { }

  async ngOnInit(): Promise<void> {
    this.gridLines = 'Both';
    //this.cachedProduct = JSON.parse(localStorage.getItem('products'));
    this.cachedProduct = <any> (await this.productService.setProductStore());

  }

}
