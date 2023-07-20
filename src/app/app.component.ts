import { Component, HostListener, OnDestroy } from '@angular/core';
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  RouterEvent
} from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { enableRipple, loadCldr, setCulture, setCurrencyCode } from '@syncfusion/ej2-base';
import { HttpClient } from '@angular/common/http';
import { PermissionsService } from './services/permissions.service';
loadCldr(
  require('cldr-data/main/fr/numbers.json'),
  require('cldr-data/main/fr/ca-gregorian.json'),
  require('cldr-data/supplemental/numberingSystems.json'),
  require('cldr-data/main/fr/timeZoneNames.json'),
  require('cldr-data/supplemental/weekData.json'),
  require('cldr-data/main/fr/units.json'),
  require('cldr-data/main/fr/layout.json'),
  require('cldr-data/main/fr/measurementSystemNames.json'),
  require('cldr-data/main/ar-DZ/currencies.json'), 
);
enableRipple(true);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUrl: string;
  showLoadingIndicatior = true;
  role: string;

  constructor(public _router: Router, location: PlatformLocation, private httpClient: HttpClient, private perm: PermissionsService) {

    perm.log();

    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.showLoadingIndicatior = true;
        location.onPopState(() => {
          window.location.reload();
        });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
        if (this.currentUrl.match('/auth-callbacke/'))
          setCulture('fr');
          setCurrencyCode('DZD');
      }
      if (routerEvent instanceof NavigationEnd) {
        this.showLoadingIndicatior = false;
      }
      window.scrollTo(0, 0);
    });
    this.httpClient.get('/version.json').subscribe((v: any) => {

      const localVersion = localStorage.getItem('version');

      if (localVersion != v.version) {

        localStorage.clear();
        localStorage.setItem('version', v.version);
        // @ts-ignore
        window.location.reload(true);

      }
    });

  }
  @HostListener("window:onbeforeunload", ["$event"])
  clearLocalStorage(event) {
    localStorage.clear();
  }
}
