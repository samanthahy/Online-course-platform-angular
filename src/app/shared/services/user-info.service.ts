import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {BehaviorSubject, Observable} from "rxjs";
import {UserInfo} from "../models/user-info";
import {environment} from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
  public userInfo$ = this.userInfoSubject.asObservable();


  constructor(private httpClient: HttpClient) { }


  updateUserInfo(newUserInfo: UserInfo) {
    this.userInfoSubject.next(newUserInfo);
  }

  getUserInfoByUserId(id: number): Observable<UserInfo> {
    return this.httpClient.get<UserInfo>(`${environment.api}/user-details/userId/${id}`);
  }

  updateProfile(
    userId: number,
    formValues: {firstname: string | null, lastname: string | null, phone: string | null, overview: string | null, description: string | null, personalLink: string | null}
  ): Observable<UserInfo> {
    const updateProfileRequest = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      phone: formValues.phone,
      overview: formValues.overview,
      description: formValues.description,
      personalLink: formValues.personalLink
    };
    return this.httpClient.put<UserInfo>(`${environment.api}/user-details/updateProfile/userId/${userId}`, updateProfileRequest)
  }


  updateProfileImage(userId: number, imageFile: File): Observable<UserInfo> {
    const uploadData = new FormData();
    uploadData.append('file', imageFile);

    return this.httpClient.put<UserInfo>(`${environment.api}/user-details/updateProfileImage/userId/${userId}`, uploadData);
  }
}
