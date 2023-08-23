import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {$animations} from "./auth-dialog-animations";



export type authDialogAction = 'register'|'login';

export interface authDialogData {
  mode?: authDialogAction;
  // code?: string;
  // url?: string;
}


@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss'],
  animations: $animations
})
export class AuthDialogComponent {

  authFormGroup!: FormGroup;
  public dialogData: authDialogData;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: authDialogData,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
  ) {
    this.dialogData = data || { mode: 'default' };
    console.log(this.dialogData);
  }



  ngOnInit() {
    this.authFormGroup = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ''
      }, {validators: [AuthDialogComponent.passwordValidator]})
    });

    if (this.dialogData.mode === 'login') {
      // If the mode is login, we don't need the email and confirmPassword fields.
      this.authFormGroup.removeControl('fullname');
      this.authFormGroup.removeControl('email');
      (this.authFormGroup.get('passwordGroup') as FormGroup)?.removeControl('confirmPassword');
    }
  }

  static passwordValidator({value: {password, confirmPassword}}: FormGroup): null | { passwordNotMatch: string } {
    return password === confirmPassword ? null : {passwordNotMatch: 'Password and confirm password must be the same'};
  }

  registerOrLogin() {
    if (this.authFormGroup.valid) {
      const {fullname, username, email, passwordGroup} = this.authFormGroup.value;
      const password = passwordGroup.password;
      const loginData = {username, password};
      const registerData = {fullname, username, email, password, role:'ROLE_INSTRUCTOR'};


      const handleSuccess = () => {
        this.router.navigate(['/instructor/courses']);  // Navigate to the instructor's courses page
      };

      if (this.dialogData.mode === 'login') {
        this.auth.login(loginData).subscribe({
          next: handleSuccess,
          error: (error) => {
            // handle error here
          }
        });
      } else if (this.dialogData.mode === 'register') {
        this.auth.register(registerData).subscribe({
          next: handleSuccess,
          error: (error) => {
            // handle error here
          }
        });
      }
    }
  }

  getDefaultDialogConfig(): MatDialogConfig {
    const config = new MatDialogConfig();
    config.autoFocus = true;
    config.width = '400px';
    config.maxWidth = '100%';
    config.disableClose = false;
    config.position = {top: '10%', left: 'calc(50vw - 200px)'};

    return config;
  }

  renderRegister(): void {
    const dialogConfig = this.getDefaultDialogConfig();
    dialogConfig.data = {mode: 'register'}

    // Close current dialog before opening a new one
    this.dialog.closeAll();

    this.dialog.open(AuthDialogComponent, dialogConfig);
  }

  renderLogin() : void {
    const dialogConfig = this.getDefaultDialogConfig();
    dialogConfig.data = {mode: 'login'}

    this.dialog.closeAll();

    this.dialog.open(AuthDialogComponent, dialogConfig);
  }

}