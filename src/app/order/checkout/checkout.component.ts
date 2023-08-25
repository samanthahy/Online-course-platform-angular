import { Component } from '@angular/core';
import {Course} from "../../shared/models/course";
import {CourseService} from "../../shared/services/course.service";
import {OrderService} from "../../shared/services/order.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {PaymentService} from "../../shared/services/payment.service";
import {Payment} from "../../shared/models/payment";
import {AuthService} from "../../shared/services/auth.service";
import {CartService} from "../../shared/services/cart.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  cartItems: Course[] = [];
  countries: string[] = ['The United States', 'Canada', 'The United Kingdom', 'Germany', 'France', 'Australia', 'China', 'Singapore'];
  originalPrice:number = 0;
  tax: number = 0;
  totalValue: number = 0;
  saveCard:boolean = false;
  isLoading: boolean = false;
  form: FormGroup = this.fb.group({})
  selectedPaymentMethod: string = '';
  selectedCountry: string = '';


  constructor(private cs: CourseService,
              private os: OrderService,
              private router: Router,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private ps: PaymentService,
              private auth: AuthService,
              private cartService: CartService) {}

  ngOnInit(): void {
    this.getCartItems();
    this.getTotalValue();
    this.form = this.fb.group({
      country: ['', Validators.required],
      zipCode: ['', this.selectedCountry === 'The United States' ? Validators.required : null],
      paymentMethod: ['', Validators.required],
      cardDetails: this.fb.group({
        nameOnCard: [''],
        cardNumber: [''],
        expiryDate: [''],
        cvc: [''],
      }),
      saveCard: [false]
    });

    this.form.get('country')?.valueChanges.subscribe(value => {
      this.selectedCountry = value;

      // Update tax based on the changed country value
      this.computeTax();

      if (value !== 'The United States') {
        this.form?.get('zipCode')?.clearValidators();
        this.form?.get('zipCode')?.updateValueAndValidity();
      } else {
        this.form?.get('zipCode')?.setValidators(Validators.required);
        this.form?.get('zipCode')?.updateValueAndValidity();
      }
    });

    this.form.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.selectedPaymentMethod = value;
      const cardDetails = this.form.get('cardDetails');

      if (value === 'Card') {
        cardDetails?.get('nameOnCard')?.setValidators([Validators.required]);
        cardDetails?.get('cardNumber')?.setValidators([Validators.required]);
        cardDetails?.get('expiryDate')?.setValidators([Validators.required]);
        cardDetails?.get('cvc')?.setValidators([Validators.required]);
      } else {
        cardDetails?.get('nameOnCard')?.clearValidators();
        cardDetails?.get('cardNumber')?.clearValidators();
        cardDetails?.get('expiryDate')?.clearValidators();
        cardDetails?.get('cvc')?.clearValidators();
      }

      cardDetails?.get('nameOnCard')?.updateValueAndValidity();
      cardDetails?.get('cardNumber')?.updateValueAndValidity();
      cardDetails?.get('expiryDate')?.updateValueAndValidity();
      cardDetails?.get('cvc')?.updateValueAndValidity();
    });

    this.form.get('saveCard')?.valueChanges.subscribe(value => {
      this.saveCard = value;
    });

  }



  getCartItems() {
    this.cartService.getCoursesInCart().subscribe(
      cartItems => {
        this.cartItems = cartItems;
        this.getTotalValue(); // update total value when cart items are updated
      },
      error => {
        console.error('Error getting cart items', error);
      }
    );
  }

  private getTotalValue() {
    this.cartService.getTotalValue().subscribe(
      totalValue => {
        this.originalPrice = totalValue;
        this.tax = this.originalPrice * 0.08; // calculating tax
        this.totalValue = this.originalPrice + this.tax;
      },
      error => {
        console.error('Error getting total value', error);
      }
    );
  }



  private computeTax(): void {
    if (this.form.get('country')?.value === 'The United States') {
      this.tax = this.originalPrice * 0.08; // calculating tax for the US
    } else {
      this.tax = 0; // no tax for other countries
    }
    this.totalValue = this.originalPrice + this.tax;
  }



  completeCheckout() {
    if (this.form.valid) {
      this.isLoading = true;  // start the progress bar

      // assuming you have a service method that calls your backend API
      this.os.createOrder(this.selectedPaymentMethod).subscribe(
        (response) => {
          console.log(response);

          // if 'Credit/Debit Card' payment method is selected and 'save this card' is checked
          if (this.selectedPaymentMethod === 'Card' && this.form?.get('saveCard')?.value === true) {
            const cardDetails = this.form?.get('cardDetails')?.getRawValue();
            if (this.auth.user && cardDetails) {

              const expiryMonth = parseInt(cardDetails.expiryDate.split('/')[0]);
              const expiryYear = parseInt(cardDetails.expiryDate.split('/')[1]) + 2000; // because you're getting just the last two digits of the year
              // The Date constructor takes a year, month (0-based), day, etc.
              // Here we use the next month (expiryMonth + 1) and day 0, which gives the last day of the "expiryMonth".
              let expiryDate = new Date(expiryYear, expiryMonth, 0);

              let payment : Payment = {

                userId: this.auth.user.id,
                nameOnCard: cardDetails.nameOnCard,
                accountNo: cardDetails.cardNumber,
                expiry: expiryDate
              }

              this.storePayment(payment);
            }

            // reset the cart
            this.cartItems = [];
          }

          // re-initialize the cart count after successful order creation
          this.cartService.initializeCartCount();

          const orderId = response.id;

          // delay for 3 seconds, then stop the progress bar
          setTimeout(() => {
            this.isLoading = false;
            this.router.navigate(['/receipt', orderId]); // redirect to receipt page
          }, 3000);
        },
        error => {
          console.error(error);
          this.isLoading = false; // stop the progress bar in case of error
        }
      );
    } else {
      this.form.markAllAsTouched();

      // Log the errors for each form control
      Object.keys(this.form.controls).forEach(key => {
        console.log('Control: ', key);
        console.log('Errors: ', this.form.get(key)?.errors);
      });

      // Log the errors for each form control within the 'cardDetails' FormGroup
      const cardDetails = this.form.get('cardDetails') as FormGroup;
      Object.keys(cardDetails.controls).forEach(key => {
        console.log('CardDetail Control: ', key);
        console.log('Errors: ', cardDetails.get(key)?.errors);
      });

      this.snackBar.open('Please fill out all required fields and choose a payment method', 'Close', {
        duration: 5000,
      });
    }
  }


  storePayment(payment: Payment) {
    this.ps.storeCardDetails(payment).subscribe(
      response => console.log('Payment info stored successfully'),
      error => console.error('Failed to store payment info', error)
    );
  }

  // Getter for the nested form group
  get cardDetails(): FormGroup {
    return this.form.get('cardDetails') as FormGroup;
  }

}
