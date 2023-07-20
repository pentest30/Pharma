import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class DateHelper {
    
  convertUTCDateToLocalDate(date:Date):Date {
    var newDate = new Date(date.getTime()+date.getTimezoneOffset() *60*1000 );
    console.log(newDate);
    var offset = newDate.getTimezoneOffset()  / 60;
    var hours = newDate.getHours() + 1;

    newDate.setHours(hours - offset);

    return newDate;   
  }
  addOffset(date) {
    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours() + 1;
    date.setHours(hours - offset);
    return date;  
  }
  
  difference(date1, date2) {  
    const date1utc = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const date2utc = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    let day = 1000*60*60*24;
    return(date2utc - date1utc)/day
  }
  toShorDate(date){
    if(!date)
     return null;
    return date.getDate() + 
    "/" +  (date.getMonth() + 1) +
    "/" +  date.getFullYear();
  }
}