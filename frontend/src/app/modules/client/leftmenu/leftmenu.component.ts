import {Component, ElementRef, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {StoreService} from "../../../services/store/store.service";
import {ApiService} from "../../../services/api/api.service";
import {LayoutService} from "../../../services/layout/layout.service";
import { ROUTES } from "../../../app.routes";

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss']
})
export class LeftmenuComponent implements OnInit {

  url: string;
  user: any = {};

  menu = [
    {
      label: 'Settings',
      hidden: false,
      items: [
        { hidden: false, label: 'Roles', icon: 'pi pi-fw pi-user-edit', link: ROUTES.configuration.roles },
        { hidden: false, label: 'Users', icon: 'pi pi-fw pi-user', link: ROUTES.configuration.users },
        { hidden: false, label: 'Company', icon: 'pi pi-fw pi-users', link: ROUTES.configuration.company },
        { hidden: false, label: 'Somos Users', icon: 'pi pi-fw pi-credit-card', link: ROUTES.configuration.somos_users },
        { hidden: false, label: 'ID & RO', icon: 'pi pi-fw pi-credit-card', link: ROUTES.configuration.id_ro },
        { hidden: false, label: 'SQL Scripts', icon: 'pi pi-fw pi-credit-card', link: ROUTES.configuration.sql_scripts },
      ]
    },
  ];

  isMenuLoaded = false

  constructor(
    private router: Router,
    private store: StoreService,
    private api: ApiService,
    public layoutService: LayoutService, public el: ElementRef
  ) {
    this.url = this.router.url;
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Navigation started.
        this.url = event.url;
      }
    });
  }

  ngOnInit(): void {
  }

}
