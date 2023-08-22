import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../../shared/models/user";
import {UserInfo} from "../../../shared/models/user-info";

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent {

  selectedRole: string;
  fullname: string;

  constructor(
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User, userInfo: UserInfo }
  ) {
    this.selectedRole = data.user.role;
    this.fullname = data.userInfo.firstname +" "+ data.userInfo.lastname;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.selectedRole);
  }
}
