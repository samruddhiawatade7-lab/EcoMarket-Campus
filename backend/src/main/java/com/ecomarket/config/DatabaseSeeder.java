package com.ecomarket.config;

import com.ecomarket.entity.*;
import com.ecomarket.repository.*;
import com.ecomarket.service.SustainabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private CampusRepository campusRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SustainabilityService sustainabilityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (collegeRepository.count() > 0 || userRepository.existsByEmail("aarav@coep.ac.in")) {
                System.out.println(">>> EcoMarket Campus Seed Data Already Initialized.");
                return; // Seed data already initialized
            }
        } catch (Exception e) {
            // Tables being created by Hibernate
        }

        System.out.println(">>> Initializing EcoMarket Campus Seed Data...");

        // 1. Create Colleges & Campuses
        College coep = collegeRepository.save(new College("COEP Technological University", "COEP", "coep.ac.in", "Pune", "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=60"));
        College iitb = collegeRepository.save(new College("IIT Bombay", "IITB", "iitb.ac.in", "Mumbai", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=60"));
        College bits = collegeRepository.save(new College("BITS Pilani", "BITS", "bits-pilani.ac.in", "Pilani / Goa / Hyd", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60"));
        College du = collegeRepository.save(new College("Delhi University", "DU", "du.ac.in", "New Delhi", "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&auto=format&fit=crop&q=60"));
        College mit = collegeRepository.save(new College("MIT World Peace University", "MITWPU", "mitwpu.edu.in", "Pune", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60"));

        Campus coepMain = campusRepository.save(new Campus(coep, "Main Campus Shivajinagar", "Shivajinagar, Pune"));
        Campus iitbPowai = campusRepository.save(new Campus(iitb, "Powai Campus", "Powai, Mumbai"));
        Campus bitsGoa = campusRepository.save(new Campus(bits, "KK Birla Goa Campus", "Zuarinagar, Goa"));
        Campus duNorth = campusRepository.save(new Campus(du, "North Campus", "University Enclave, Delhi"));
        Campus mitKothrud = campusRepository.save(new Campus(mit, "Kothrud Campus", "Paud Road, Pune"));

        // 2. Create Student Users & Admins (Check if admin exists first)
        User admin = userRepository.findByEmail("admin@ecomarket.com").orElse(null);
        if (admin == null) {
            admin = new User("System Admin", "admin@ecomarket.com", passwordEncoder.encode("Admin@123"), "+91 9876543210", Role.ADMIN);
            admin.setCity("Pune");
            admin = userRepository.save(admin);
            cartRepository.save(new Cart(admin));
        }

        User student1 = userRepository.findByEmail("aarav@coep.ac.in").orElse(null);
        if (student1 == null) {
            student1 = new User("Aarav Sharma", "aarav@coep.ac.in", passwordEncoder.encode("Student@123"), "+91 9876543211", Role.BUYER);
            student1.setCollege(coep);
            student1.setCampus(coepMain);
            student1.setVerifiedStudent(true);
            student1.setCollegeEmail("aarav@coep.ac.in");
            student1.setCourse("B.Tech Computer Science");
            student1.setBranch("Computer Engineering");
            student1.setGraduationYear(2026);
            student1 = userRepository.save(student1);
            cartRepository.save(new Cart(student1));
        }

        User student2 = userRepository.findByEmail("ananya@iitb.ac.in").orElse(null);
        if (student2 == null) {
            student2 = new User("Ananya Roy", "ananya@iitb.ac.in", passwordEncoder.encode("Student@123"), "+91 9876543212", Role.SELLER);
            student2.setCollege(iitb);
            student2.setCampus(iitbPowai);
            student2.setVerifiedStudent(true);
            student2.setCollegeEmail("ananya@iitb.ac.in");
            student2.setCourse("B.Tech Mechanical");
            student2.setBranch("Mechanical Engineering");
            student2.setGraduationYear(2025);
            student2 = userRepository.save(student2);
            cartRepository.save(new Cart(student2));
        }

        User student3 = userRepository.findByEmail("rohan@bits-pilani.ac.in").orElse(null);
        if (student3 == null) {
            student3 = new User("Rohan Mehta", "rohan@bits-pilani.ac.in", passwordEncoder.encode("Student@123"), "+91 9876543213", Role.BUYER);
            student3.setCollege(bits);
            student3.setCampus(bitsGoa);
            student3.setVerifiedStudent(true);
            student3.setCollegeEmail("rohan@bits-pilani.ac.in");
            student3.setCourse("B.E. Electrical & Electronics");
            student3.setBranch("EEE");
            student3.setGraduationYear(2026);
            student3 = userRepository.save(student3);
            cartRepository.save(new Cart(student3));
        }

        // 3. Create Campus Clubs
        Club roboticsClub = clubRepository.save(new Club("COEP Robotics Club", coep, "Official robotics team participating in ABU Robocon and national hardware expos", "Tech", student1, "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60"));
        Club ecoClub = clubRepository.save(new Club("IITB Sustainability Alliance", iitb, "Student initiative focused on campus waste reduction, composting and zero-waste events", "Eco", student2, "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60"));

        // 4. Create Student Categories
        List<Category> categories = categoryRepository.findAll();
        if (categories.isEmpty()) {
            categories.add(new Category("Books & Study Materials", "Textbooks, reference guides, lab manuals, GATE books, semester lecture notes", "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Electronics", "Scientific calculators, hostel fans, headphones, laptops, solar powerbanks", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Hostel Essentials", "Folding mattresses, study lamps, laundry baskets, bucket & mug sets, clothes drying racks", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Stationery", "Drawing boards, engineering geometry sets, seed pens, recycled notebooks", "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Clothing & Accessories", "College hoodies, lab coats, backpacks, festival wear, upcycled apparel", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Sports Equipment", "Badminton rackets, footballs, cricket bats, gym equipment, yoga mats", "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=60"));
            categories.add(new Category("Other Student Essentials", "Reusable water bottles, lunch boxes, room decor, event props, club supplies", "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60"));
            categories = categoryRepository.saveAll(categories);
        }

        // 5. Create Campus Product Listings
        Product p1 = createCampusProduct("Higher Engineering Mathematics by B.S. Grewal (44th Ed)",
                "Essential textbook for Sem 1 & 2 Mathematics. Good condition with neat pencil highlighting. Includes formula sheet notes.",
                new BigDecimal("350.00"), new BigDecimal("950.00"), 3, ProductCondition.GOOD, ListingType.SELL,
                categories.get(0), student1, coep, coepMain, "Year 1", "Sem 1", "Computer Science", "Engineering Mathematics", "B.S. Grewal", "978-8174091955",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60"));

        Product p2 = createCampusProduct("Data Structures & Algorithms in Java (Robert Lafore)",
                "Standard reference textbook for Sem 3 Computer Science. Pristine condition with zero page tears. Selling after clearing semester.",
                new BigDecimal("299.00"), new BigDecimal("799.00"), 2, ProductCondition.LIKE_NEW, ListingType.SELL,
                categories.get(0), student1, coep, coepMain, "Year 2", "Sem 3", "Computer Science", "Data Structures", "Robert Lafore", "978-0672324536",
                true, false, null, null,
                List.of("https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=60"));

        Product p3 = createCampusProduct("Organic Chemistry (Morrison & Boyd 7th Ed)",
                "Classic textbook for Chemical & Biotech engineering students. Includes worked example notes.",
                new BigDecimal("249.00"), new BigDecimal("850.00"), 4, ProductCondition.GOOD, ListingType.EXCHANGE,
                categories.get(0), student2, iitb, iitbPowai, "Year 2", "Sem 4", "Chemical Engineering", "Organic Chemistry", "Morrison & Boyd", "978-8131704813",
                false, false, null, "Will exchange for Physical Chemistry Atkins textbook or Casio calculator",
                List.of("https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60"));

        Product p4 = createCampusProduct("Casio fx-991EX ClassWiz Scientific Calculator",
                "Must-have non-programmable 552-function calculator for engineering exams. Tested, clean buttons, solar powered.",
                new BigDecimal("699.00"), new BigDecimal("1495.00"), 5, ProductCondition.GOOD, ListingType.SELL,
                categories.get(1), student2, iitb, iitbPowai, "Year 1", "Sem 1", "Engineering", "General Engineering", "Casio", "FX-991EX",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=60"));

        Product p5 = createCampusProduct("Hostel Clip-on LED Study Desk Lamp",
                "USB rechargeable 3-mode LED clip lamp for late night studying without disturbing roommates. Battery lasts 6 hours.",
                new BigDecimal("199.00"), new BigDecimal("599.00"), 10, ProductCondition.LIKE_NEW, ListingType.SELL,
                categories.get(2), student3, bits, bitsGoa, "Year 1", "Sem 1", "Electrical", "Hostel Gear", "EcoLight", "SL-101",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60"));

        Product p6 = createCampusProduct("Folding 3-Fold Hostel Cotton Mattress (Single Bed)",
                "Clean, comfortable high-density foam single mattress that folds into a seat. Great for hostel rooms.",
                new BigDecimal("499.00"), new BigDecimal("1800.00"), 3, ProductCondition.GOOD, ListingType.SELL,
                categories.get(2), student1, coep, coepMain, "Year 3", "Sem 6", "General", "Hostel Furniture", "RestEasy", "M-101",
                true, false, null, null,
                List.of("https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop&q=60"));

        Product p7 = createCampusProduct("FREE: Printed Engineering Mechanics & Physics Notes",
                "Complete bound set of handwritten lecture notes, past 5 years question papers, and solved tutorials for 1st Year Engineering.",
                BigDecimal.ZERO, new BigDecimal("400.00"), 5, ProductCondition.GOOD, ListingType.DONATE,
                categories.get(0), student1, coep, coepMain, "Year 1", "Sem 1", "Engineering", "Mechanics & Physics", "Senior Batch", "NONE",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=60"));

        Product p8 = createCampusProduct("FREE: Engineering Drawing Board & T-Square Set",
                "Full size wooden drawing board with metal T-square, clips, and mini drafter. Donating to any needy 1st year student!",
                BigDecimal.ZERO, new BigDecimal("1200.00"), 2, ProductCondition.FAIR, ListingType.FREE_CORNER,
                categories.get(3), student2, iitb, iitbPowai, "Year 1", "Sem 1", "Mechanical", "Engineering Graphics", "Omega", "DB-01",
                true, false, null, null,
                List.of("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60"));

        Product p9 = createCampusProduct("Cotton White Unisex Chemistry Lab Coat (Medium)",
                "Full-sleeve 100% cotton lab coat required for Chemistry and Workshop labs. Cleaned and ironed.",
                new BigDecimal("99.00"), new BigDecimal("350.00"), 6, ProductCondition.GOOD, ListingType.SELL,
                categories.get(4), student1, coep, coepMain, "Year 1", "Sem 1", "Science", "Chemistry", "SafetyPro", "LC-M",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=60"));

        Product p10 = createCampusProduct("Yonex Muscle Power Badminton Racket & Cover",
                "Lightweight aluminum racket with fresh gutting. Perfect for hostel court evening games.",
                new BigDecimal("199.00"), new BigDecimal("690.00"), 4, ProductCondition.GOOD, ListingType.SELL,
                categories.get(5), student3, bits, bitsGoa, "Year 2", "Sem 3", "Sports", "Badminton", "Yonex", "MP-29",
                false, false, null, null,
                List.of("https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=60"));

        Product p11 = createCampusProduct("Reusable Stage LED Floodlights & Backdrop Banner Frame",
                "Set of 4 RGB stage spotlights and collapsible 10x8ft banner frame used for college fests. Owned by Robotics Club.",
                new BigDecimal("1499.00"), new BigDecimal("5000.00"), 1, ProductCondition.LIKE_NEW, ListingType.SELL,
                categories.get(6), student1, coep, coepMain, "Year 3", "Sem 5", "Tech", "Event Equipment", "COEP Robotics", "EVENT-01",
                false, true, roboticsClub, null,
                List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60"));

        // Multi-item seed order for Apriori Recommendations
        Order o1 = new Order();
        o1.setOrderNumber("ECO-CAMPUS-101");
        o1.setBuyer(student1);
        o1.setSubtotal(new BigDecimal("1049.00"));
        o1.setDeliveryFee(BigDecimal.ZERO);
        o1.setTotalAmount(new BigDecimal("1049.00"));
        o1.setShippingAddress("Hostel Block 3, COEP Tech");
        o1.setCity("Pune");
        o1.setState("Maharashtra");
        o1.setPincode("411005");
        o1.setPhone("+91 9876543211");
        o1.setPaymentStatus(PaymentStatus.PAID);
        o1.setOrderStatus(OrderStatus.DELIVERED);
        o1.setPaymentMethod("UPI");
        Order savedO1 = orderRepository.save(o1);
        savedO1.getOrderItems().add(new OrderItem(savedO1, p1, student1, 1, p1.getPrice()));
        savedO1.getOrderItems().add(new OrderItem(savedO1, p4, student2, 1, p4.getPrice()));
        orderRepository.save(savedO1);

        System.out.println(">>> EcoMarket Campus Seed Data Initialized Successfully!");
        System.out.println(">>> Verified Student User: aarav@coep.ac.in / Student@123");
    }

    private Product createCampusProduct(
            String name, String desc, BigDecimal price, BigDecimal origPrice, int qty,
            ProductCondition condition, ListingType listingType, Category category, User seller,
            College college, Campus campus, String year, String sem, String course, String subject,
            String author, String isbn, boolean isResale, boolean isClub, Club club, String exchPref,
            List<String> images
    ) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(desc);
        p.setPrice(price);
        p.setOriginalPrice(origPrice);
        p.setQuantity(qty);
        p.setCondition(condition);
        p.setListingType(listingType);
        p.setCategory(category);
        p.setSeller(seller);
        p.setCollege(college);
        p.setCampus(campus);
        p.setAcademicYear(year);
        p.setSemester(sem);
        p.setCourse(course);
        p.setSubject(subject);
        p.setAuthor(author);
        p.setIsbn(isbn);
        p.setSemesterEndResale(isResale);
        p.setClubListing(isClub);
        p.setClub(club);
        p.setExchangePreference(exchPref);
        p.setStatus(ProductStatus.APPROVED);

        double co2 = sustainabilityService.estimateCo2Saved(condition, category.getName());
        double water = sustainabilityService.estimateWaterSaved(condition, category.getName());
        double waste = sustainabilityService.estimateWasteReduced(condition, category.getName());

        p.setCo2Saved(co2);
        p.setWaterSaved(water);
        p.setWasteReduced(waste);

        for (String img : images) {
            p.addImage(img);
        }

        return productRepository.save(p);
    }
}
