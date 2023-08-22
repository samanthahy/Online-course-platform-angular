import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-no-courses-found',
  templateUrl: './no-courses-found.component.html',
  styleUrls: ['./no-courses-found.component.scss']
})
export class NoCoursesFoundComponent  implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input("title")
  title: string | undefined;

  // tslint:disable-next-line:no-input-rename
  @Input("description")
  description: string | undefined;

  imagePath = "assets/empty-shopping-cart-v2.jpg";
  constructor() {}

  ngOnInit() {}
}
