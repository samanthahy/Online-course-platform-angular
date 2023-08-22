import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SideNavComponent} from "./side-nav/side-nav.component";
import {ProfileComponent} from "./profile/profile.component";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatTabsModule} from "@angular/material/tabs";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {NoAccessComponent} from "./no-access/no-access.component";
import {RouterModule} from "@angular/router";
import { DialogComponent } from './dialog/dialog.component';
import { ProfileImageComponent } from './profile-image/profile-image.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";



@NgModule({
  declarations: [
    ProfileComponent,
    SideNavComponent,
    NoAccessComponent,
    DialogComponent,
    ProfileImageComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterModule,
    MatSnackBarModule
  ],
    exports: [
        ProfileComponent,
        SideNavComponent,
      NoAccessComponent,
      DialogComponent,
        ProfileImageComponent,
      PageNotFoundComponent
    ]
})
export class SharedModuleModule { }
