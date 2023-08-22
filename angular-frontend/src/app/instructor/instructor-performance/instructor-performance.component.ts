import {Component, OnInit} from '@angular/core';
import {Review} from "../../shared/models/review";
import {Order} from "../../shared/models/order";
import {ChartData, ChartOptions} from "chart.js";
import {CourseService} from "../../shared/services/course.service";
import {EnrollmentService} from "../../shared/services/enrollment.service";
import {UserService} from "../../shared/services/user.service";
import {ReviewService} from "../../shared/services/review.service";
import {OrderService} from "../../shared/services/order.service";
import {UserInfoService} from "../../shared/services/user-info.service";
import {Course} from "../../shared/models/course";
import {AuthService} from "../../shared/services/auth.service";
import {forkJoin, mergeMap, tap} from "rxjs";
import {Enrollment} from "../../shared/models/enrollment";

@Component({
  selector: 'app-instructor-performance',
  templateUrl: './instructor-performance.component.html',
  styleUrls: ['./instructor-performance.component.scss']
})
export class InstructorPerformanceComponent implements OnInit{
  courses: Course[];
  activeCourses: number;
  enrollmentCount: number
  enrollments: Enrollment[];
  averageProgress: number;
  averageRating: number;
  reviews: Review[];
  ratingPercentage: number[];
  reviewDistribution: Review[][];
  orders: Order[];
  orderDistribution: Order[][];
  grossRevenue: { month: string; revenue: number; }[];
  private monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// Data for the Pie Chart
  pieChartType: 'doughnut' = 'doughnut';
  pieChartData: ChartData<'doughnut'>

  // Data for the Line Chart (Trend Chart)
  lineChartType: 'line' = 'line';
  lineChartData: ChartData<'line'>;


  // Options for the Pie Chart
  pieChartOptions: ChartOptions<'doughnut'> = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


// Options for the Line Chart (Trend Chart)
  lineChartOptions: ChartOptions<'line'> = {
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    }
  };


  constructor(
    private auth: AuthService,
    private cs: CourseService,
    private es: EnrollmentService,
    private us: UserService,
    private rs: ReviewService,
    private os: OrderService,
    private uis: UserInfoService
  ) { }


  ngOnInit(): void {
    if (this.auth.user) {
      const instructorId = this.auth.user.id;

      this.cs.getCoursesByInstructor(instructorId).pipe(
        tap(courses => {
          this.activeCourses = courses.filter(course => course.status === 'Published').length;
          this.courses = courses;
        }),
        mergeMap(courses => {
          // Fetch all orders
          const ordersObservable = this.os.getOrders().pipe(
            tap(orders => {
              // Use generateMonthRange() for monthlyRevenue's range
              const currentMonthNames = this.generateMonthRange(new Date('2022-02-01'), new Date('2023-12-31'));

              const monthlyRevenue: { [key: string]: number } = currentMonthNames.reduce((acc: { [key: string]: number }, month) => {
                acc[month] = 0;
                return acc;
              }, {});

              orders.forEach(order => {
                const orderMonth = currentMonthNames[new Date(order.purchaseDate).getMonth()];
                order.purchases.forEach(orderCourse => {
                  if (this.courses.some(course => orderCourse.course.id === course.id)) {
                    monthlyRevenue[orderMonth] += orderCourse.sellingPrice;
                  }
                });
              });

              this.grossRevenue = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue: revenue as number }));
              this.updateLineChartData(monthlyRevenue, currentMonthNames);
            })
          );

          const reviewsObservables = courses.map(course => this.rs.getReviewsByCourse(course.id));
          const enrollmentsObservables = courses.map(course => this.es.getEnrollmentsByCourse(course.id));

          return forkJoin([ordersObservable, ...reviewsObservables, ...enrollmentsObservables]);
        })
      ).subscribe(results => {
        const reviewsData = results.slice(1, this.courses.length + 1) as Review[][];; // adjusted index
        const enrollmentsData = results.slice(this.courses.length + 1) as Enrollment[][];; // adjusted index

        this.reviews = reviewsData.flat();
        this.enrollments = enrollmentsData.flat();
        this.enrollmentCount = this.enrollments.length;

        // Compute average rating and progress
        this.averageRating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
        this.averageProgress = this.enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) / this.enrollmentCount;

        this.updatePieChartData();
      });
    }
  }




  private updatePieChartData(): void {
    const ratingCounts: number[] = Array(5).fill(0); // Initialize an array of zeros for each rating.

    this.reviews.forEach(review => {
      // Increment the count for the rating given in the review.
      ratingCounts[review.rating - 1]++;
    });

    const totalReviews = this.reviews.length;
    this.ratingPercentage = ratingCounts.map(count => (count / totalReviews) * 100);

    this.pieChartData = {
      labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
      datasets: [{
        label: 'Rating Distribution',
        data: this.ratingPercentage
      }]
    };
  }



  private updateLineChartData(monthlyRevenue: { [key: string]: number }, monthNames: string[]): void {
    this.lineChartData = {
      labels: monthNames,
      datasets: [{
        label: 'Gross Revenue Trend',
        data: Object.values(monthlyRevenue),
        fill: false
      }]
    };
  }


  generateMonthRange(startDate: Date, endDate: Date): string[] {
    let currentMonth = new Date(startDate);
    const result = [];

    while (currentMonth <= endDate) {
      const monthLabel = `${this.monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
      result.push(monthLabel);

      if (currentMonth.getMonth() === 11) { // If current month is December
        currentMonth = new Date(currentMonth.getFullYear() + 1, 0, 1); // Move to January of the next year
      } else {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1); // Move to the first day of the next month
      }
    }

    return result;
  }



}
