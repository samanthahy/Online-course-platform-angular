import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss']
})
export class ProfileImageComponent {
  @Input() firstname: string;
  @Input() lastname: string;
  @Input() imageUrl: string | null;
  @Input() size: number = 50; // Default size
  @Input() fontSize: number = 30; // Default font size

  getInitials() {
    return (this.firstname[0] + this.lastname[0]).toUpperCase();
  }

  getSize() {
    return this.size + 'px';
  }

  getFontSize() {
    return this.fontSize + 'px';
  }
}
