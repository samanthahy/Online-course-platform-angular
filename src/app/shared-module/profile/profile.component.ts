import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../../shared/services/token-storage.service";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/user";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {UserInfo} from "../../shared/models/user-info";
import {UserInfoService} from "../../shared/services/user-info.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  imagePreview: string | ArrayBuffer | null = null;
  selectedImage: File | null = null;
  profileForm = new FormGroup({
    firstname: new FormControl(null as string | null),
    lastname: new FormControl(null as string | null),
    phone: new FormControl(null as string | null),
    overview: new FormControl(null as string | null),
    description: new FormControl(null as string | null),
    personalLink: new FormControl(null as string | null)
  });


  messageTitle = "Your haven't logged in!";
  messageDescription = "Please log in";
  constructor(public auth: AuthService,
              private uis: UserInfoService,
              private fb: FormBuilder,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (this.auth.user) {
      this.uis.getUserInfoByUserId(this.auth.user.id).subscribe(data => {
        this.profileForm.patchValue({
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phone,
          overview: data.overview,
          description: data.description,
          personalLink: data.personalLink,
        });
        this.imagePreview  = data.profileImage?.filePath;
      });
    }
  }

  onSubmit() {
    let formValues: {firstname: string | null, lastname: string | null, phone: string | null, overview: string | null, description: string | null, personalLink: string | null} = {
      firstname: null,
      lastname: null,
      phone: null,
      overview: null,
      description: null,
      personalLink: null,
    };
    // Overwrite non-undefined properties
    Object.assign(formValues, this.profileForm.value);
    console.log(formValues);

    if (this.auth.user) {
      this.uis.updateProfile(this.auth.user.id, formValues).subscribe(
        response => {
          console.log(response);

          this.uis.updateUserInfo(response);

          this.snackBar.open('Profile successfully updated!', 'Close', {
            duration: 5000, // Display the snackBar for 5 seconds
          });
        },
        error => {
          console.error(error);
          this.snackBar.open('Failed to update profile.', 'Close', {
            duration: 5000, // Display the snackBar for 5 seconds
          });
        }
      );
    }
  }

  onFileSelected(event: any) : void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }

    // Optionally read the file to show a preview:
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);

  }

  onSavePicture(): void {
    if (this.auth.user && this.selectedImage !== null) {
      this.uis.updateProfileImage(this.auth.user.id, this.selectedImage).subscribe(
        response => {
          // Clear selected image
          this.selectedImage = null;

          // Update existing image URL
          this.imagePreview = response.profileImage.filePath;

          this.uis.updateUserInfo(response);

          this.snackBar.open('Profile image successfully uploaded!', 'Close', {
            duration: 5000, // Display the snackBar for 5 seconds
          });
        },
        error => {
          console.error(error);
          this.snackBar.open('Failed to upload profile image.', 'Close', {
            duration: 5000, // Display the snackBar for 5 seconds
          });
        }
      );
    }
  }

}
