import { getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quota-ssrs',
  templateUrl: './quota-ssrs.component.html',
  styleUrls: ['./quota-ssrs.component.sass']
})
export class QuotaSsrsComponent implements OnInit {
  reportServer: string = 'http://ad-report/Reports';
  reportUrl: string = 'GHPCommerce';
  showParameters: string = "true";
  toDay = new Date();
  parameters: any = {
   "dated": this.toDay.getFullYear().toString()+'-'+(this.toDay.getMonth() + 1).toString()+'-'+this.toDay.getDate().toString(),
   "datef": new Date().toISOString(),
   "produit":''

   };
  language: string = "fr-fr";
  width: number = 700;
  height: number = 700;
  toolbar: string = "true";
  constructor() { }

  ngOnInit(): void {

  }

}
