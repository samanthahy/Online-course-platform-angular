import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError
} from "rxjs";
import {Course} from "../models/course";
import {ShoppingSession} from "../models/shopping-session";
import {environment} from "../../../environments/environment.development";
import {CartItem} from "../models/cart-item";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";



interface APIResponse {
  success: boolean;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: Course [] = [];
  cartTotalValue: number = 0;

  private cartItemCountSource = new BehaviorSubject<number>(0);

  public cartItemCount$ = this.cartItemCountSource.asObservable();


  constructor(
    private httpClient: HttpClient,
    private auth: AuthService,
    private snackBar: MatSnackBar) {
    auth.userLoggedOut.subscribe(() => {
    this.initializeCartCount();
  });
  }




  getCoursesInCart(): Observable<Course[]> {
    if (this.auth.user) {
      // Fetch shopping session for the user
      const user = this.auth.user;
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).pipe(
        map(shoppingSession => {
          // console.log(shoppingSession);
          // Return the courses directly from shoppingSession.cartItems
          return shoppingSession.cartItems ? shoppingSession.cartItems.map(item => item.course) : [];
        }),
        catchError(error => {
          console.error('Error fetching shopping session', error);
          return of([]);
        })
      );
    } else {
      // Fetch cart items from localStorage if the user is not authenticated
      const item = localStorage.getItem("avct_item");
      // Parse the item if it exists, otherwise return an empty array
      const courses = item ? JSON.parse(item) : [];
      return of(courses);
    }
  }




  initializeCartCount() {
    this.getCartItemCount().subscribe(count => {
      this.cartItemCountSource.next(count);
    });
  }



  getCartItemCount(): Observable<number> {
    if (this.auth.user) {
      // Fetch shopping session for the user
      const user = this.auth.user;
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).pipe(
        switchMap(shoppingSession =>
          // Fetch cart items count for the shopping session
          this.httpClient.get<number>(`${environment.api}/cart_items/sessionId/${shoppingSession.id}/cart_count`)
        ),
        catchError(error => {
          console.error('Error fetching cart item count', error);
          return of(0);
        })
      );
    } else {
      // Fetch cart items from localStorage if the user is not authenticated
      const item = localStorage.getItem("avct_item");
      // Parse the item if it exists, otherwise return an empty array
      const courses = item ? JSON.parse(item) : [];
      return of(courses.length);
    }
  }



  getTotalValue(): Observable<number> {

    let result: Observable<number>;

    if (this.auth.user) {
      // Fetching total from server if user is logged in
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${this.auth.user.id}`).pipe(
        // tap(response => console.log("HTTP Response:", response)),
        map(response => {
          // console.log("Mapping response:", response);
          return response.total;
        }),
        catchError(error => {
          console.error('Inside catchError');
          console.error('Error fetching shopping session', error);
          return of(0);
        })
      );

    } else {
      // Computing total from local cart items if user is not logged in
      let totalValue = this.cartItems.reduce((total, item) => total + item.price, 0);
      return of(totalValue);
    }

    result.subscribe(val => {
      console.log("Total value:", val);
    });
  }



  // Adding new Product to cart db if logged in else localStorage
  addToCart(data: Course): void {
    // Add course to local storage cart
    if (!this.auth.user) {
      const item = localStorage.getItem("avct_item");
      // Parse the item if it exists, otherwise return an empty array
      const cartItems: Course[] = item ? JSON.parse(item) : [];

      // Check if the course already exists in the cart
      const courseExists = cartItems.some(course => course.id === data.id);

      if (!courseExists) {
        cartItems.push(data);
        this.cartItems = cartItems;
/*        setTimeout(() => {
          localStorage.setItem("avct_item", JSON.stringify(cartItems));
          // Increment the cart item count by 1
          const currentCount = this.cartItemCountSource.value;
          this.cartItemCountSource.next(currentCount + 1);
        }, 500);*/

        localStorage.setItem("avct_item", JSON.stringify(cartItems));
        // Increment the cart item count by 1
        const currentCount = this.cartItemCountSource.value;
        this.cartItemCountSource.next(currentCount + 1);

        this.snackBar.open('Course added to cart!', 'Close', {
          duration: 2000,
        });
      }
    } else {
      // Add course to database cart
      const user = this.auth.user;
      const headers = new HttpHeaders({'Content-Type': 'application/json'});

      this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).subscribe(
        (response:ShoppingSession) => {
          const newCartItem: CartItem = {
            course: data,
            shoppingSession: response
          };

          this.httpClient.post<APIResponse>(`${environment.api}/cart_items/sessionId/${response.id}`, newCartItem).subscribe(
            response => {
              if(response.success) {
                // console.log('Course added to cart in database', response.message);
                // Increment the cart item count by 1

                const currentCount = this.cartItemCountSource.value;
                this.cartItemCountSource.next(currentCount + 1);

                this.snackBar.open('Course added to cart!', 'Close', {
                  duration: 2000,
                });
              } else {
                console.warn('Course not added due to:', response.message);
              }
            },
            error => {
              console.error('Error adding course to database cart', error);
            }
          );
        },
        error => {
          console.error('Error fetching shopping session', error);
        }
      );
    }

  }



  // Removing cart from local or db
  removeCartItem(course: Course): Observable<any> {
    if (this.auth.user) {
      // Remove course from the database cart
      const user = this.auth.user;
      return this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`).pipe(
        switchMap(shoppingSession => {
          return this.httpClient.delete<APIResponse>(`${environment.api}/cart_items/sessionId/${shoppingSession.id}/courseId/${course.id}`);
        }),
        catchError(error => {
          console.error('Error removing course from database cart', error);
          return throwError(error);
        }),
        tap((response) => {
          if (response && response.success) {
            // Decrement the cart item count source by one only if successful
            const currentCount = this.cartItemCountSource.value;
            this.cartItemCountSource.next(currentCount - 1);
          } else {
            console.warn('Item not removed due to:', response.message);
          }
        })
      );
    } else {
      // Remove course from local storage cart
      const item = localStorage.getItem("avct_item");
      // Parse the item if it exists, otherwise return an empty array
      const cartItems: Course[] = item ? JSON.parse(item) : [];

      for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === course.id) {
          cartItems.splice(i, 1);
          break;
        }
      }

      // ReAdding the courses after remove
      localStorage.setItem("avct_item", JSON.stringify(cartItems));

      // Decrement the cart item count source by one
      const currentCount = this.cartItemCountSource.value;
      this.cartItemCountSource.next(currentCount - 1);

      // You could return an observable of a static value in this case.
      return of(null);
    }

  }



  mergeLocalCartWithBackend(): Observable<any> {
    const user = this.auth.user;
    if (user) {
      const item = localStorage.getItem("avct_item");
      const localCartItems: Course[] = item ? JSON.parse(item) : [];

      // Convert the entire logic into an Observable using `from` and `concatMap`
      return from(this.httpClient.get<ShoppingSession>(`${environment.api}/shopping_sessions/userId/${user.id}`)).pipe(
        concatMap((response: ShoppingSession) => {
          const session = response;
          const postObservables: Observable<any>[] = [];

          localCartItems.forEach(course => {
            const cartItemData: CartItem = {
              course: course,
              shoppingSession: session
            };

            // Store each post request Observable
            postObservables.push(this.httpClient.post<APIResponse>(`${environment.api}/cart_items/sessionId/${session.id}`, cartItemData));
          });

          // Return a combined observable for all post requests
          return forkJoin(postObservables);
        }),
        tap((responses: APIResponse[]) => {
          responses.forEach((response, index) => {
            // If the item was added successfully or already exists in the backend,
            // remove it from the local storage
            if (response.success || response.message === 'the item already exists') {
              localCartItems.splice(index, 1);
            }
          });

          localStorage.setItem("avct_item", JSON.stringify(localCartItems));
        }),

        catchError(error => {
          console.error('Error merging cart', error);
          return of(null);
        })
      );
    } else {
      return of(null); // No user, return an observable of null
    }
  }


}
