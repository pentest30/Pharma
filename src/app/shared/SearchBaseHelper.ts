import { Injectable } from "@angular/core";

@Injectable()

export class SearchBaseHelper {
    customNgSelectSearchFn (term:string , item : any) {
        console.log(term,item );
        if(term!=undefined) {
          term = term.toLocaleLowerCase();
          let part1 = term.split(" ")[0];
          let part2 = term.split(" ")[1];
          if(part2 && item.fullName) {
            return      ( item.fullName.toLocaleLowerCase().indexOf(part1) > -1 && item.fullName.toLocaleLowerCase().indexOf(part2) > -1) ;
     
          }
           return  (item.code != undefined && item.code.toLocaleLowerCase().indexOf(term) > -1 )  
           || (item.manufacturer != undefined && item.manufacturer.toLocaleLowerCase().indexOf(term) > -1 ) 
           || ( (item.fullName) ? item.fullName.toLocaleLowerCase().indexOf(part1) > -1 : true ) ;
        }
    }
}