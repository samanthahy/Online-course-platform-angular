package com.mercury.OnlineCoursePlatformBackend.service;

import com.mercury.OnlineCoursePlatformBackend.dao.*;
import com.mercury.OnlineCoursePlatformBackend.model.bean.*;
import com.mercury.OnlineCoursePlatformBackend.http.response.Response;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.logging.Logger;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger LOGGER = Logger.getLogger(OrderService.class.getName());


    @Autowired
    private EnrollmentService enrollmentService;
    @Autowired
    private OrderDao orderDao;

    @Autowired
    private CourseDao courseDao;

    @Autowired
    private OrderCourseDao orderCourseDao;

    @Autowired
    private ShoppingSessionDao shoppingSessionDao;

    @Autowired
    private CartItemDao cartItemDao;


    public List<Order> getAllOrders() {
        return orderDao.findAll();
    }


    public Order getOrderById(Integer id) {
        return orderDao.findById(id).get();
    }



    public List<Order> getOrdersByUser(int userId) {
        return orderDao.findByUserId(userId);
    }


    public Page<Order> getOrdersWithFilterSortPaginator(Pageable pageable, String filter) {
        // Null check for filter
        if (filter == null) {
            return orderDao.findAll(pageable);
        }

        // Check if filter is potentially a year, year-month, or full date format
        if (filter.matches("\\d{4}") ||
                filter.matches("\\d{4}-\\d{1,2}") ||
                filter.matches("\\d{4}-\\d{2}-\\d{2}")) {

            Date startDate, endDate;

            String[] parts = filter.split("-");

            if (parts.length == 1) { // Only year provided
                int year = Integer.parseInt(parts[0]);
                LocalDate startLocalDate = LocalDate.of(year, 1, 1);
                LocalDate endLocalDate = LocalDate.of(year + 1, 1, 1);

                startDate = Date.from(startLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                endDate = Date.from(endLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

            } else if (parts.length == 2) { // Year and month provided
                int year = Integer.parseInt(parts[0]);
                int month = Integer.parseInt(parts[1]);

                if (month < 1 || month > 12) {
                    return Page.empty(); // Return empty page if month isn't valid
                }

                LocalDate startLocalDate = LocalDate.of(year, month, 1);
                LocalDate endLocalDate = month == 12 ?
                        LocalDate.of(year + 1, 1, 1) :
                        LocalDate.of(year, month + 1, 1);

                startDate = Date.from(startLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                endDate = Date.from(endLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

            } else { // Full date provided
                int year = Integer.parseInt(parts[0]);
                int month = Integer.parseInt(parts[1]);
                int day = Integer.parseInt(parts[2]);

                if (month < 1 || month > 12) {
                    return Page.empty(); // Return empty page if month isn't valid
                }

                LocalDate startLocalDate = LocalDate.of(year, month, day);
                LocalDate endLocalDate = startLocalDate.plusDays(1);

                startDate = Date.from(startLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
                endDate = Date.from(endLocalDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            }

            return orderDao.findOrdersWithFilter(null, startDate, endDate, pageable);

        } else {
            // Handle string-based filter
            return orderDao.findOrdersWithFilter(filter, null, null, pageable);
        }
    }






    private DateRange tryParseDate(String filter) {
        if (filter == null || filter.trim().isEmpty()) {
            return null;
        }
        LocalDate startDate = null;
        LocalDate endDate = null;

        String[] patterns = {
                "yyyy", "yyyy-M", "yyyy-MM", "yyyy-M-d", "yyyy-MM-d",
                "MM-dd", "yy-MM", "yy-M", "M-dd"
        };

        for (String pattern : patterns) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
                LocalDate parsedDate = LocalDate.parse(filter, formatter);

                switch (pattern) {
                    case "yyyy":
                        startDate = parsedDate.withDayOfYear(1);
                        endDate = parsedDate.withDayOfYear(parsedDate.lengthOfYear());
                        break;
                    case "yyyy-M":
                    case "yy-M":
                    case "M-dd":
                    case "yy-MM":
                    case "yyyy-MM":
                        startDate = parsedDate.withDayOfMonth(1);
                        endDate = parsedDate.withDayOfMonth(parsedDate.lengthOfMonth());
                        break;
                    default:
                        startDate = parsedDate;
                        endDate = parsedDate;
                }

                break;  // Exit the loop once a match is found
            } catch (DateTimeParseException e) {
                // Continue to the next pattern
            }
        }

        if (startDate == null || endDate == null) {
            return null;
        }

        return new DateRange(
                Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                Date.from(endDate.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant())  // Plus one day to make it inclusive
        );
    }

    private static class DateRange {
        private final Date start;
        private final Date end;

        DateRange(Date start, Date end) {
            this.start = start;
            this.end = end;
        }

        Date getStart() {
            return start;
        }

        Date getEnd() {
            return end;
        }
    }




    private String generateUniqueOrderNumber() {
        return "EC-" + generateRandomAlphaNumeric(24);
    }

    private String generateRandomAlphaNumeric(int length) {
        int leftLimit = 48; // numeral '0'
        int rightLimit = 90; // letter 'Z'
        Random random = new Random();

        return random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || (i >= 65 && i <= 90)))  // Only allow numbers and uppercase letters
                .limit(length)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }




    @Transactional
    public Order createOrder(int sessionId, String paymentType) {
        ShoppingSession session = shoppingSessionDao.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Session not found with id " + sessionId));

        // Generate a unique order number
        String orderNumber = generateUniqueOrderNumber();
        LOGGER.info("Generated order number: " + orderNumber);

        Order order = new Order();
        order.setUserId(session.getUserId());
        order.setTotal(session.getTotal());
        order.setPurchaseDate(new Date());
        order.setOrderNumber(orderNumber);
        if (order.getOrderNumber() == null || order.getOrderNumber().isEmpty()) {
            throw new IllegalStateException("Order number is missing!");
        }
        order.setPaymentType(paymentType);


        List<OrderCourse> orderCourses = session.getCartItems().stream()
                .map(cartItem -> {
                    OrderCourse orderCourse = new OrderCourse();
                    orderCourse.setCourse(cartItem.getCourse());
                    orderCourse.setSellingPrice(cartItem.getCourse().getPrice());
                    orderCourse.setOrder(order);
                    return orderCourse;
                })
                .collect(Collectors.toList());

        for (OrderCourse orderCourse : orderCourses) {
            if (orderCourse.getSellingPrice() == null) {
                throw new IllegalStateException("Selling price is missing for order course: " + orderCourse.getId());
            }
        }

        order.setPurchases(orderCourses);

        // Save order to the database
        Order savedOrder = orderDao.save(order);
        enrollmentService.createEnrollmentFromOrder(savedOrder);

        // Clear the shopping session
        if (!session.getCartItems().isEmpty()) {
            List<CartItem> cartItems = new ArrayList<>(session.getCartItems());
            for (CartItem cartItem : cartItems) {
                session.getCartItems().remove(cartItem);
                cartItemDao.delete(cartItem);
            }
        }
        session.setTotal(0.0);
        shoppingSessionDao.save(session);

        return savedOrder;
    }


    public Response edit(Order order) {
        try {
            Order o = (Order) orderDao.findById(order.getId()).get();

            List<OrderCourse> purchasesToRemove = o.getPurchases();

            List<OrderCourse> purchases = order.getPurchases();
            // handled update and add courses in order
            purchases.forEach((orderCourse) -> {
                Course course = (Course) courseDao.findById(orderCourse.getCourse().getId()).get();
                orderCourse.setCourse(course);
                orderCourse.setOrder(o);
            });

            // handle remove courses in order
            if(purchases.size() > 0) {
                purchasesToRemove = purchasesToRemove.stream().filter((orderCourse) -> {
                    return !purchases.contains(orderCourse);
                }).collect(Collectors.toList());
            }

            o.setPurchases(purchases);

            orderDao.save(o);

            deleteOrderCourses(purchasesToRemove);

            return new Response(true);
        } catch (Exception e) {
            System.out.println(e);
            return new Response(false);
        }
    }

    public void deleteOrderCourses(List<OrderCourse> purchases) {
        orderCourseDao.deleteAll(purchases);
    }

}
