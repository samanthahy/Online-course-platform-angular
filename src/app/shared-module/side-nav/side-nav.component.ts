import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

  mode: 'over' | 'push' | 'side' = 'side';
  opened: boolean = true;

  isCollapsed = true;

  constructor(public auth: AuthService) {
  }

  expand() {
    this.isCollapsed = false;
  }

  shrink() {
    this.isCollapsed = true;
  }

}
