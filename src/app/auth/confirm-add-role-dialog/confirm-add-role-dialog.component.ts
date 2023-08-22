import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {UserService} from "../../shared/services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-confirm-add-role-dialog',
  templateUrl: './confirm-add-role-dialog.component.html',
  styleUrls: ['./confirm-add-role-dialog.component.scss']
})
export class ConfirmAddRoleDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmAddRoleDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private auth: AuthService
  ) {}




  confirm(role: string): void {
    // Assuming addInstructorRole() returns an Observable
    this.userService.changeToInstructorRole( role).subscribe((response: any) => {
      if (response && response.success) {
        // If the role addition was successful, update the user roles.
        if (this.auth.user) {
          this.auth.user.role = role;
        }

        this.dialogRef.close(true);
        this.snackBar.open(response.message, 'Close', { duration: 3000 });

      } else {
        // The role was not added. This could be due to a problem on the server side or because the server rejected the request (for example, the user already has the role).
        this.snackBar.open(response.message, 'Close', { duration: 3000 });
      }
    }, error => {
      // The HTTP request failed. This could be due to a network problem, server problem, etc.
      this.snackBar.open('Could not change role due to a network error. Please try again later.', 'Close', { duration: 3000 });
    });
  }



  cancel() {
    this.dialogRef.close(false);
  }
}

