import {Component, OnInit} from '@angular/core';
import {CourseService} from "../../shared/services/course.service";
import {EnrollmentService} from "../../shared/services/enrollment.service";
import {UserService} from "../../shared/services/user.service";
import {map, switchMap, tap} from "rxjs";
import {Review} from "../../shared/models/review";
import {Order} from "../../shared/models/order";
import {ReviewService} from "../../shared/services/review.service";
import {OrderService} from "../../shared/services/order.service";
import {ChartData, ChartOptions, ChartType } from "chart.js";
import {UserInfo} from "../../shared/models/user-info";
import {UserInfoService} from "../../shared/services/user-info.service";



@Component({
  selector: 'app-admin-performance',
  templateUrl: './admin-performance.component.html',
  styleUrls: ['./admin-performance.component.scss']
})
export class AdminPerformanceComponent implements OnInit {

  activeUsers: number;
  activeCourses: number;
  enrollments: number;
  averageProgress: number;
  averageRating: number;
  reviews: Review[];
  reviewDistribution: Review[][];
  ratingPercentage: number[];
  orders: Order[];
  orderDistribution: Order[][];
  grossRevenue: { month: string; revenue: number; }[];
  private monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  reviewerInfosMap: Map<number, UserInfo> = new Map();




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
    private cs: CourseService,
    private es: EnrollmentService,
    private us: UserService,
    private rs: ReviewService,
    private os: OrderService,
    private uis: UserInfoService
  ) { }




  ngOnInit(): void {

    this.us.getAllUsers().pipe(
      map(users => users.filter(user => user.status === 'Active'))
    ).subscribe(activeUsers => {
      this.activeUsers = activeUsers.length;
    });


    this.cs.getCourses().pipe(
      map(courses => courses.filter(course => course.status !== 'Draft'))
    ).subscribe(activeCourses => {
      this.activeCourses = activeCourses.length;
    });



    this.es.getEnrollments().subscribe(enrollments => {
      this.enrollments = enrollments.length;
      this.averageProgress = enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) / this.enrollments;
    });



    this.rs.getReviews().subscribe(reviews => {
      this.reviews = reviews;

      // Compute averageRating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / reviews.length;

      // Initialize reviewDistribution array of 5 empty arrays
      this.reviewDistribution = [[], [], [], [], []];
      reviews.forEach(review => {
        this.uis.getUserInfoByUserId(review.user.id).subscribe(userInfo => {
          this.reviewerInfosMap.set(review.id, userInfo);
        });

        this.reviewDistribution[review.rating - 1].push(review);
      });

      const totalReviews = reviews.length;
      // Calculate ratingPercentage for each rating
      this.ratingPercentage = this.reviewDistribution.map(reviewsForRating => {
        return (reviewsForRating.length / totalReviews) * 100; // percentage
      });

      this.pieChartData = {
        labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
        datasets: [{
          label: 'Rating Distribution',
          data: this.ratingPercentage
        }]
      };
    });



    this.os.getOrders().subscribe(orders => {
      this.orders = orders;

      // Distribute orders by month and calculate revenue simultaneously
      let revenueMap = new Map<string, number>();
      orders.forEach(order => {
        let dateObj = new Date(order.purchaseDate);
        let month = this.monthNames[dateObj.getMonth()];
        let fullYear = dateObj.getFullYear();
        const monthYearKey = `${month} ${fullYear}`;
        if (!revenueMap.has(monthYearKey)) {
          revenueMap.set(monthYearKey, 0);
        }
        let currentRevenue = revenueMap.get(monthYearKey)!;
        revenueMap.set(monthYearKey, currentRevenue + order.total);
      });

      // Convert the map to the desired format
      this.grossRevenue = Array.from(revenueMap.entries()).map(entry => ({
        month: entry[0],
        revenue: entry[1]
      }));

      // Generate your labels
      const labels = this.generateMonthRange(new Date('2022-02-01'), new Date('2023-12-31'));
      // console.log(labels);
      // Create a template for your data with all zeros
      const grossRevenueTemplate = Array(labels.length).fill(0);

      // Populate the template with actual values
      this.grossRevenue.forEach(data => {
        const index = labels.indexOf(data.month);
        if (index > -1) {
          grossRevenueTemplate[index] = data.revenue;
        }
      });

      this.lineChartData = {
        labels: labels,
        datasets: [{
          label: 'Monthly Gross Revenue',
          data: grossRevenueTemplate
        }]
      };
    });

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



  deleteReview(reviewId: number) {
    if (confirm("Are you sure you want to delete this review?")) {
      this.rs.deleteReviewById(reviewId).subscribe(
        response => {
          if (response.success) {
            // Filter out the deleted review from the array.
            this.reviews = this.reviews.filter(review => review.id !== reviewId);

            // Update other stats
            this.updateReviewStats();

            // Display a success message
          } else {
            // Handle error, maybe display a message to the admin.
          }
        },
        error => {
          // Handle error, maybe display a message to the admin.
        }
      );
    }
  }



  updateReviewStats(): void {
    // Recalculate averageRating
    if (this.reviews.length) {
      const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = totalRating / this.reviews.length;
    } else {
      this.averageRating = 0;
    }

    // Recalculate reviewDistribution (assuming it's an array of arrays where each inner array contains reviews of a certain rating)
    this.reviewDistribution = [];
    for (let i = 1; i <= 5; i++) {
      this.reviewDistribution[i - 1] = this.reviews.filter(review => review.rating === i);
    }

    // Recalculate ratingPercentage (assuming it's an array where each entry is the percentage of reviews with a certain rating)
    this.ratingPercentage = [];
    for (let i = 1; i <= 5; i++) {
      this.ratingPercentage[i - 1] = (this.reviewDistribution[i - 1].length / this.reviews.length) * 100;
    }

    this.pieChartData = {
      labels: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
      datasets: [{
        label: 'Rating Distribution',
        data: [...this.ratingPercentage] // Ensuring a new reference for the data array
      }]
    };

  }


  getRecentReviews(reviews: Review[]): Review[] {
    return reviews.filter(review => this.isReviewRecent(review));
  }




  isReviewRecent(review: Review): boolean {
    const today = new Date();
    const reviewDate = new Date(review.createTime); // Assuming createTime is the timestamp of the review creation
    const differenceInTime = today.getTime() - reviewDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    return differenceInDays <= 7; // Check if the review is less than or equal to 30 days old
  }


  timeAgo(timestamp: Date) {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
      return 'just now';
    }
    if (secondsPast < 3600) {
      return `${parseInt((secondsPast / 60).toString())} minute${parseInt((secondsPast / 60).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 86400) {
      return `${parseInt((secondsPast / 3660).toString())} hour${parseInt((secondsPast / 3660).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 604800) {
      return `${parseInt((secondsPast / 86400).toString())} day${parseInt((secondsPast / 86400).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 2419200) {
      return `${parseInt((secondsPast / 804800).toString())} week${parseInt((secondsPast / 804800).toString()) > 1 ? 's' : ''} ago`;
    }
    if (secondsPast <= 29030400) {
      return `${parseInt((secondsPast / 2419200).toString())} month${parseInt((secondsPast / 2419200).toString()) > 1 ? 's' : ''} ago`;
    }

    return `${parseInt((secondsPast / 29030400).toString())} year${parseInt((secondsPast / 29030400).toString()) > 1 ? 's' : ''} ago`;
  }



}
