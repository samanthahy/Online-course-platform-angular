import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogComponent} from "../../shared-module/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {delay} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit() {
    this.registerFormGroup = this.fb.group({
      fullname: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required]],
        confirmPassword: ''
      }, {validators: [RegisterComponent.passwordValidator]}),
      isInstructor: [false]
    });
  }


  static passwordValidator({value: {password, confirmPassword}}: FormGroup): null | { passwordNotMatch: string } {
    return password === confirmPassword ? null : {passwordNotMatch: 'Password and confirm password must be the same'};
  }


  register() {
    if (this.registerFormGroup.valid) {
      const {fullname, username, email, passwordGroup, isInstructor} = this.registerFormGroup.value;
      const role = isInstructor ? 'ROLE_INSTRUCTOR' : 'ROLE_STUDENT';
      const registerData = {
        fullname: fullname,
        username: username,
        email: email,
        password: passwordGroup.password,
        role: role
      };
      this.auth.register(registerData).subscribe({
        next: (response) => {
          // Display success dialog
          const dialogRef = this.dialog.open(DialogComponent, {
            data: { title: 'Success', content: 'Registration successful! Redirecting to login...' }
          });
          // Close dialog after 3 seconds and navigate to login page
          dialogRef.afterOpened().pipe(delay(3000)).subscribe(() => {
            dialogRef.close();
            this.router.navigate(['/login']);
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
