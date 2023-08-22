import {Component, OnInit, SimpleChange,SimpleChanges} from '@angular/core';
import {Course} from "../../shared/models/course";
import {CourseService} from "../../shared/services/course.service";
import {Router} from "@angular/router";
import {CartService} from "../../shared/services/cart.service";
import {AuthService} from "../../shared/services/auth.service";
import {WishlistService} from "../../shared/services/wishlist.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfo} from "../../shared/models/user-info";
import {UserInfoService} from "../../shared/services/user-info.service";
import {forkJoin, map} from "rxjs";

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit{
  cartItems: Course[] = [];
  showDataNotFound = true;
  totalValue = 0;
  messageTitle = "Your cart is empty";
  messageDescription = " Keep shopping to find a course!";
  isInWishlistMap: Map<Course, boolean> = new Map();
  userInfoMap = new Map<number, UserInfo>();




  constructor(
    private cs: CourseService,
    private router: Router,
    private cartService: CartService,
    public auth: AuthService,
    private ws: WishlistService,
    private snackBar: MatSnackBar,
    private uis: UserInfoService) {
  }

  ngOnInit() {
    this.getCartItems();
  }



  removeCartItem(course: Course) {
    this.cartService.removeCartItem(course).subscribe(response => {
      // Recalling
      this.getCartItems();
    }, error => {
      console.log(error);
    });
  }

  getCartItems() {
    this.cartService.getCoursesInCart().subscribe(
      cartItems => {
        this.cartItems = cartItems;
        this.cartService.cartItems = this.cartItems;

        this.fetchInstructorsInfo(this.cartItems);

        this.getTotalValue(); // update total value when cart items are updated
        this.checkIfCourseInWishlist();  // Move this line here
      },
      error => {
        console.error('Error getting cart items', error);
      }
    );
  }


// New method to fetch instructor's user info
  fetchInstructorsInfo(cartItems: Course[]) {
    // Fetch user info for each instructor ID of the courses
    const instructorInfoRequests = cartItems.map(course =>
      this.uis.getUserInfoByUserId(course.instructor.id).pipe(
        map(userInfo => ({ courseId: course.id, userInfo })) // Map the user info to include the course id
      )
    );

    forkJoin(instructorInfoRequests).subscribe(
      results => {
        results.forEach(result => {
          this.userInfoMap.set(result.courseId, result.userInfo);
        });
      },
      error => {
        console.error('Error fetching instructor info', error);
      }
    );
  }




  private getTotalValue() {
    this.cartService.getTotalValue().subscribe(
      totalValue => {
        this.totalValue = totalValue;
        this.cartService.cartTotalValue = this.totalValue;
      },
      error => {
        console.error('Error getting total value', error);
      }
    );
  }

  navigateToCheckout() {
    this.router.navigate(['/cart/checkout']);
  }

  moveToWishlist(course: Course) {
    if (this.auth.user) {
      if (this.isInWishlistMap.get(course)) {
        this.removeCartItem(course);
      } else {
        this.ws.addToWishlist(course.id, this.auth.user.id).subscribe(
          response => {
            this.snackBar.open('The course has been moved to your wishlist', 'Close', { duration: 5000 });
          },
          error => {
            console.error('Error while adding to wishlist: ', error);
          });
        this.removeCartItem(course); // Removing from cart even if not in wishlist
      }
    }
  }

  checkIfCourseInWishlist(): void {
    for (let cartCourse of this.cartItems) {
      if (this.auth.user && this.auth.user.wishlistCourses && cartCourse.id) {
        this.isInWishlistMap.set(cartCourse, this.auth.user.wishlistCourses.some(course => course.id === cartCourse.id));
      } else {
        this.isInWishlistMap.set(cartCourse, false);
      }
    }
  }



}









