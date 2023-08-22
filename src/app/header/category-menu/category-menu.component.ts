import {Component, Input, OnInit} from '@angular/core';
import {Category} from "../../shared/models/category";
import {LevelOneCategory} from "../../shared/models/LevelOneCategory";
import {LevelThreeCategory} from "../../shared/models/LevelThreeCategory";
import {LevelTwoCategory} from "../../shared/models/LevelTwoCategory";
import {CategoryService} from "../../shared/services/category.service";

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss']
})
export class CategoryMenuComponent implements OnInit {
  @Input() categories: Category[] = [];
  transformedCategories: LevelOneCategory[] = [];


  constructor(
    private categoryService: CategoryService // assuming you have a service to fetch categories
  ) { }

  ngOnInit(): void {
    this.transformedCategories = this.transformToTree(this.categories);
    // console.log(this.transformedCategories);

  }




  transformToTree(categories: Category[]): any[] {

    const transformed: LevelOneCategory[] = [];

    for (const cat of categories) {
      const parts = cat.path.split('.');
      const levelOneName = parts[0];
      const levelTwoName = parts[1];
      const levelThreeName = parts[2];

      let levelOneObj = transformed.find(c => c.name === levelOneName.replace(/_/g, " "));
      if (!levelOneObj) {
        levelOneObj = {
          name: levelOneName.replace(/_/g," "),
          path: levelOneName.toLowerCase().replace(/_/g, "-"),
          children: [] // Make sure to initialize the children array
        };
        transformed.push(levelOneObj);
      }

      let levelTwoObj = levelOneObj.children.find(c => c.name === levelTwoName.replace(/_/g, " "));
      if (!levelTwoObj) {
        levelTwoObj = {
          name: levelTwoName.replace(/_/g," "),
          path: `${levelOneObj.path}.${levelTwoName.toLowerCase().replace(/_/g, "-")}`,
          children: [] // Make sure to initialize the children array
        };
        levelOneObj.children.push(levelTwoObj);
      }

      const levelThreeObj: LevelThreeCategory = {
        name: cat.name,
        path: cat.path.toLowerCase().replace(/_/g, "-"),
        link: `topic/${levelThreeName.toLowerCase().replace(/_/g, "-")}`
      };

      levelTwoObj.children.push(levelThreeObj); // Pushing the LevelThreeCategory object
    }

    return transformed;
  }



  transPathToLink( path: string) :string {
    return '/courses/' + path.split('.').join('/');
  }


}
