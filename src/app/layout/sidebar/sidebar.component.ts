import { NgxPermissionsService } from 'ngx-permissions';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener
} from '@angular/core';
import { NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ROUTES } from './sidebar-items';

declare const Waves: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.sass']
})
export class SidebarComponent implements OnInit {
  public sidebarItems: any[];
  showMenu: string = '';
  showSubMenu: string = '';
  public innerHeight: any;
  public bodyTag: any;
  listMaxHeight: string;
  listMaxWidth: string;
  headerHeight = 60;

  message: string;
  subscription: Subscription;
  profile: any;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private ngxPermissionsService: NgxPermissionsService,
    public elementRef: ElementRef,
    public authService: AuthService
  ) { }
  @HostListener('window:resize', ['$event'])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');

    }
    this.checkStatuForResize(true);
  }

  callMenuToggle(event: any, element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
    const hasClass = event.target.classList.contains('toggled');
    if (hasClass) {
      this.renderer.removeClass(event.target, 'toggled');
    } else {
      this.renderer.addClass(event.target, 'toggled');

    }
  }
  callSubMenuToggle(element: any) {

    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }

  async ngOnInit() {

    this.sidebarItems = ROUTES;

    console.log(ROUTES[0].roles[1]);

    const res = await this.ngxPermissionsService.hasPermission(ROUTES[0].roles[1]);

    this.initLeftSidebar();

    this.bodyTag = this.document.body;

    this.profile = this.authService.profile;

    // let authorizedItems = [];
    // this.authService.change.subscribe(isOpen => {
    //   this.profile = isOpen;
    //   if (this.sidebarItems.length) {
    //     this.sidebarItems.map(item => {
    //       if (item.submenu.length) {
    //         let subItems = [];
    //         item.submenu.map(subItem => {
    //           if (Array.isArray(this.profile.role)) {
    //             for (let index = 0; index < this.profile.role.length; index++) {
    //               const element = this.profile.role[index];

    //               let authorized = subItem.roles.find(t => t == element);
    //               let exist = subItems.filter(t => t.title == subItem.title);

    //               if (authorized != null && exist.length == 0) subItems.push(subItem);

    //             }
    //           } else {

    //             let exist = subItems.filter(t => t.title == subItem.title);
    //             let authorized = subItem.roles.find(t => t == this.profile.role);
    //             if (authorized != null && exist.length == 0 && subItems.filter(x => x == subItems).length == 0) subItems.push(subItem);
    //           }
    //         });
    //         item.submenu = subItems;
    //       }
    //       if (Array.isArray(this.profile.role)) {
    //         for (let index = 0; index < this.profile.role.length; index++) {
    //           const element = this.profile.role[index];
    //           let authorized = item.roles.find(t => t == element);
    //           let exist = authorizedItems.filter(t => t.title == item.title);

    //           if (authorized != null && exist.length == 0) authorizedItems.push(item);
    //         }
    //       } else {
    //         let exist = authorizedItems.filter(t => t.title == item.title);
    //         let authorized = item.roles.find(t => t == this.profile.role);
    //         if (authorized != null && exist.length == 0) authorizedItems.push(item);
    //       }

    //       this.sidebarItems = [...new Set(authorizedItems)];
    //     });

    //   }
    // });

  }


  initLeftSidebar() {
    var _this = this;
    //Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
    // //Set Waves
    // Waves.attach(".menu .list a", ["waves-block"]);
    // Waves.init();
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    var height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }
  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      this.renderer.removeClass(this.document.body, 'side-closed');


    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
    if (document.body.classList.contains('overlay-open'))
      this.renderer.removeClass(this.document.body, 'side-closed');
  }
  mouseHover(e) {
    let body = this.elementRef.nativeElement.closest('body');
    // if (body.classList.contains('submenu-closed')) {
    //   this.renderer.addClass(this.document.body, 'side-closed-hover');
    //   this.renderer.removeClass(this.document.body, 'submenu-closed');
    // }
  }
  mouseOut(e) {
    let body = this.elementRef.nativeElement.closest('body');

    // if (body.classList.contains('side-closed-hover')) {
    //   this.renderer.removeClass(this.document.body, 'side-closed-hover');
    //   this.renderer.addClass(this.document.body, 'submenu-closed');
    // }
  }
}
