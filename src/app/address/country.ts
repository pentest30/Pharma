export class Country {
    public name: string;
    public states : State []

}
 export class State {
     public name : string;
     public dairas : City[];
    
 } 
 export class City {
     public name: string;
     public communes : City[];
 }