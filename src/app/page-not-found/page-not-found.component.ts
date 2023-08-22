import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {
  @Input("title")
  title: string | undefined;

  // tslint:disable-next-line:no-input-rename
  @Input("description")
  description: string | undefined;

  imagePath = "assets/error-desktop-2x-v1.jpg";
  constructor() {}

  ngOnInit() {}

}
