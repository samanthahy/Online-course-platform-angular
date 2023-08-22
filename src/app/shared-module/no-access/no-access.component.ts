import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-no-access',
  templateUrl: './no-access.component.html',
  styleUrls: ['./no-access.component.scss']
})
export class NoAccessComponent {
  @Input("title")
  title: string | undefined;

  // tslint:disable-next-line:no-input-rename
  @Input("description")
  description: string | undefined;

  imagePath = "assets/empty-shopping-cart-v2.jpg";
  constructor() {}

  ngOnInit() {}
}
