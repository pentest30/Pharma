import { Injectable, OnInit, ViewChild } from "@angular/core";
import { Column, ColumnMenuItem, ContextMenuItem, ContextMenuItemModel, EditSettingsModel, GridComponent, IFilter, parentsUntil, SelectionSettingsModel } from "@syncfusion/ej2-angular-grids";
import { loadCldr, setCulture } from "@syncfusion/ej2-base";
import * as enumLookup from './EnumLookup.json';
import { DataManager, UrlAdaptor } from "@syncfusion/ej2-data";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: 'root'
  })
export class BaseEventFilterGridComponent implements OnInit {
    grid: GridComponent;
    searchActive: any;
    constructor(grid: GridComponent,searchActive: Boolean
      ) {
        this.grid = grid;
        this.searchActive = searchActive;
      }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    keyPressed(e) {
        console.log(e);
       
        var currentEle = parentsUntil(e.target, "e-filtertext"); 
       
        if(currentEle && currentEle.getAttribute("id") ){ 
          let currIndex = this.grid.columns.findIndex(c => c.field == currentEle.getAttribute("id").replace("_filterBarcell","") );
          if(e.key =="ArrowDown") {
           console.log(this.grid.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id"));
           let id = this.grid.element.getElementsByClassName('e-filtertext e-input').item(currIndex).getAttribute("id");
           document.getElementById(id).blur();
           this.grid.selectedRowIndex = 0;
          }
          if(e.key =="ArrowRight") {
           let nextElement = (<Column[]>this.grid.columns).find(c => c.index == currIndex + 1);
           while (!nextElement.allowFiltering ) {
             currIndex+=1;
             nextElement = (<Column[]>this.grid.columns).find(c => c.index == currIndex );
           }
           if(this.searchActive) {  
             var ele = document.getElementsByClassName("e-filtertext").namedItem(nextElement.field + "_filterBarcell");
             setTimeout(() => (ele as HTMLElement).focus(), 0);
           }
         }
          if(e.key =="ArrowLeft") {
            let previousElem = (<Column[]>this.grid.columns).find(c => c.index == currIndex - 1);
            while (!previousElem.allowFiltering ) {
             currIndex-=1;
             previousElem = (<Column[]>this.grid.columns).find(c => c.index == currIndex );
     
            }
            if(this.searchActive) {  
             var ele = document.getElementsByClassName("e-filtertext").namedItem(previousElem.field + "_filterBarcell");
             setTimeout(() => (ele as HTMLElement).focus(), 0);
            }
          }
        }
      }
      checkFocusOnRows() {
        for (
          let index = 0;
          index < document.getElementsByClassName("e-rowcell").length;
          index++
        ) {
          const element = document.getElementsByClassName("e-rowcell")[index];
          if (element === document.activeElement) return true;
        }
        return false;
      }

}