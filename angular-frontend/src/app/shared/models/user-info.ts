import {Course} from "./course";
import {User} from "./user";
import {Payment} from "./payment";
import {ProfileImage} from "./profile-image";

export interface UserInfo {
  id?: number;
  firstname: string;
  lastname: string;
  phone: string;
  overview: string;
  description: string;
  personalLink: string;
  profileImage:ProfileImage;
  user: User;
  payment: Payment;

}
