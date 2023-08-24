import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {AuthService, LoginResponse} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {$animations} from "./auth-dialog-animations";
import {delay, finalize} from "rxjs";
import {CartService} from "../../shared/services/cart.service";
import {DialogComponent} from "../../shared-module/dialog/dialog.component";



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
  errorMessage: string = '';



  constructor(
    @Inject(MAT_DIALOG_DATA) data: authDialogData,
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AuthDialogComponent>,
    private cartService: CartService
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
    if (!password || !confirmPassword) {
      return null;
    }
    return password === confirmPassword ? null : {passwordNotMatch: 'Password and confirm password must be the same'};
  }


  registerOrLogin() {
    if (this.authFormGroup.valid) {
      const {fullname, username, email, passwordGroup} = this.authFormGroup.value;
      const password = passwordGroup.password;
      const loginData = {username, password};
      const registerData = {fullname, username, email, password, role:'ROLE_INSTRUCTOR'};



      if (this.dialogData.mode === 'login') {
        this.auth.login(loginData).subscribe(
          (res: LoginResponse) => {
            if (res.success) {
              console.log('login succeed');
              this.errorMessage = '';

              // After successful login, merge local cart with backend
              this.cartService.mergeLocalCartWithBackend().pipe(
                finalize(() => {
                  this.cartService.initializeCartCount();
                })
              ).subscribe(
                () => {},
                (error) => {
                  console.error("Error merging local cart with backend:", error);
                },
                () => {
                  setTimeout(() => {
                    this.router.navigate(['/instructor/courses']).then(() => {
                      // Close the dialog after navigation
                      this.dialogRef.close();
                    }).catch(error => console.log(error))
                  }, 3000);
                }
              );
            } else if (res.code === 403 && res.message.includes('Account is deactivated')) {
              // Handle the "Deactivated" account scenario
              this.errorMessage = 'Your account has been deactivated. Please contact support.';
            } else {
              console.log('login failed');
              this.errorMessage = res.message;
            }
          },
          (err) => {
            alert(err); // Handle HTTP error responses
          }
        )
      } else if (this.dialogData.mode === 'register') {
        this.auth.register(registerData).subscribe({
          next: (response) => {
            // Display success dialog
            const promtDialogRef = this.dialog.open(DialogComponent, {
              data: { title: 'Success', content: 'Registration successful! Redirecting to login...' }
            });
            // Close dialog after 3 seconds and navigate to login page
            promtDialogRef.afterOpened().pipe(delay(3000)).subscribe(() => {
              promtDialogRef.close();
              this.dialogData.mode = 'login';
              // Reset the form for login mode
              this.ngOnInit();
            });
          },
          error: (error) => {
            // Display error dialog
            this.dialog.open(DialogComponent, {
              data: { title: 'Error', message: 'Something went wrong! Please try again.' }
            });
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
