import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/shared/BaseComponent';

@Component({
  selector: 'app-request-log',
  templateUrl: './request-log.component.html',
  styleUrls: ['./request-log.component.sass']
})
export class RequestLogComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, "logs/");
   }

  ngOnInit(): void {
    this.loadData();
  }

}
