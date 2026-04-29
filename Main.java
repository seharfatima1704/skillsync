/**
 * SkillSync Platform - Main Demo Class
 * 
 * This class demonstrates the functionality of the SkillSync platform,
 * a skill exchange system where users can teach and learn from each other.
 * 
 * Features demonstrated:
 * - User registration and authentication
 * - Skill management
 * - User-skill assignments
 * - Matching algorithm
 * - Request system
 * - Credit system
 */
import auth.AuthService;
import auth.SessionManager;
import credit.CreditDAO;
import database.DatabaseUtil;
import request.RequestDAO;
import skill.Skill;
import skill.SkillDAO;
import user.User;
import user.UserDAO;
import userskill.UserSkillDAO;

import java.sql.Connection;
import java.util.List;

public class Main {
    /**
     * Main method that runs a complete demonstration of the SkillSync platform
     * 
     * @param args Command line arguments (not used)
     */
    public static void main(String[] args) {
        System.out.println("=== SkillSync Platform Demo ===\n");
        
        // Test database connection
        try {
            Connection conn = DatabaseUtil.getConnection();
            if (conn != null) {
                System.out.println("✓ Database connection established");
                conn.close();
            } else {
                System.out.println("✗ Failed to connect to database");
                return;
            }
        } catch (Exception e) {
            System.out.println("✗ Database connection error: " + e.getMessage());
            return;
        }
        
        // Initialize DAOs and services
        UserDAO userDAO = new UserDAO();
        SkillDAO skillDAO = new SkillDAO();
        UserSkillDAO userSkillDAO = new UserSkillDAO();
        RequestDAO requestDAO = new RequestDAO();
        CreditDAO creditDAO = new CreditDAO();
        AuthService authService = new AuthService();
        
        System.out.println("\n1. Registering users...");
        
        // Create test users
        User user1 = new User("Alice Johnson", "alice@email.com", "password123", "linkedin.com/in/alice");
        User user2 = new User("Bob Smith", "bob@email.com", "password456", "linkedin.com/in/bob");
        
        if (authService.register(user1)) {
            System.out.println("✓ User Alice registered successfully with ID: " + user1.getId());
        } else {
            System.out.println("✗ Failed to register Alice");
        }
        
        if (authService.register(user2)) {
            System.out.println("✓ User Bob registered successfully with ID: " + user2.getId());
        } else {
            System.out.println("✗ Failed to register Bob");
        }
        
        System.out.println("\n2. Adding skills...");
        
        // Create test skills
        Skill javaSkill = new Skill("Java");
        Skill pythonSkill = new Skill("Python");
        Skill webDevSkill = new Skill("Web Development");
        
        if (skillDAO.addSkill(javaSkill)) {
            System.out.println("✓ Skill 'Java' added with ID: " + javaSkill.getId());
        }
        
        if (skillDAO.addSkill(pythonSkill)) {
            System.out.println("✓ Skill 'Python' added with ID: " + pythonSkill.getId());
        }
        
        if (skillDAO.addSkill(webDevSkill)) {
            System.out.println("✓ Skill 'Web Development' added with ID: " + webDevSkill.getId());
        }
        
        System.out.println("\n3. Assigning skills to users...");
        
        // Assign teaching and learning skills to users
        // Alice can teach Java and wants to learn Python
        // Bob can teach Python and wants to learn Java
        
        if (userSkillDAO.assignSkillToUser(user1.getId(), javaSkill.getId(), "TEACH")) {
            System.out.println("✓ Alice can teach Java");
        }
        
        if (userSkillDAO.assignSkillToUser(user2.getId(), pythonSkill.getId(), "TEACH")) {
            System.out.println("✓ Bob can teach Python");
        }
        
        if (userSkillDAO.assignSkillToUser(user1.getId(), pythonSkill.getId(), "LEARN")) {
            System.out.println("✓ Alice wants to learn Python");
        }
        
        if (userSkillDAO.assignSkillToUser(user2.getId(), javaSkill.getId(), "LEARN")) {
            System.out.println("✓ Bob wants to learn Java");
        }
        
        System.out.println("\n4. Finding matches for Alice...");
        
        // Find users who can teach skills that Alice wants to learn
        List<Integer> aliceMatches = userSkillDAO.findMatches(user1.getId());
        System.out.println("Alice's matches: " + aliceMatches);
        
        for (Integer matchedUserId : aliceMatches) {
            User matchedUser = userDAO.getUserById(matchedUserId);
            if (matchedUser != null) {
                System.out.println("✓ Match found: " + matchedUser.getName() + " (ID: " + matchedUser.getId() + ")");
            }
        }
        
        System.out.println("\n5. Login simulation...");
        
        // Simulate user login
        User loggedInUser = authService.login("alice@email.com", "password123");
        if (loggedInUser != null) {
            SessionManager.setCurrentUser(loggedInUser);
            System.out.println("✓ Alice logged in successfully");
        } else {
            System.out.println("✗ Login failed");
        }
        
        System.out.println("\n6. Sending requests...");
        
        // Send skill exchange requests between users
        
        if (requestDAO.sendRequest(user1.getId(), user2.getId())) {
            System.out.println("✓ Alice sent request to Bob");
        }
        
        if (requestDAO.sendRequest(user2.getId(), user1.getId())) {
            System.out.println("✓ Bob sent request to Alice");
        }
        
        System.out.println("\n7. Checking requests for Bob...");
        
        // Retrieve and display requests sent to Bob
        List<request.Request> bobRequests = requestDAO.getRequestsByReceiver(user2.getId());
        for (request.Request req : bobRequests) {
            System.out.println("Request from Alice (ID: " + req.getId() + ") - Status: " + req.getStatus());
        }
        
        System.out.println("\n8. Accepting request...");
        
        // Accept the first request from Alice
        if (!bobRequests.isEmpty()) {
            int requestId = bobRequests.get(0).getId();
            if (requestDAO.acceptRequest(requestId)) {
                System.out.println("✓ Bob accepted Alice's request");
            }
        }
        
        System.out.println("\n9. Showing contact info (after acceptance)...");
        
        // Display contact information only after request acceptance
        if (requestDAO.isRequestAccepted(user1.getId(), user2.getId())) {
            System.out.println("✓ Request accepted - Contact info can be shared:");
            System.out.println("  Alice's Email: " + user1.getEmail());
            System.out.println("  Alice's LinkedIn: " + user1.getLinkedinProfile());
            System.out.println("  Bob's Email: " + user2.getEmail());
            System.out.println("  Bob's LinkedIn: " + user2.getLinkedinProfile());
        } else {
            System.out.println("✗ Request not accepted - Contact info hidden");
        }
        
        System.out.println("\n10. Credit system demonstration...");
        
        // Demonstrate credit transactions for skill exchange
        System.out.println("Alice's credits: " + creditDAO.getCredits(user1.getId()));
        System.out.println("Bob's credits: " + creditDAO.getCredits(user2.getId()));
        
        // Deduct credits from learner (Alice) and add to teacher (Bob)
        if (creditDAO.deductCredits(user1.getId(), 2)) {
            System.out.println("✓ Alice spent 2 credits for the session");
        }
        
        if (creditDAO.addCredits(user2.getId(), 2)) {
            System.out.println("✓ Bob earned 2 credits for teaching");
        }
        
        // Display updated credit balances
        System.out.println("Updated credits:");
        System.out.println("Alice's credits: " + creditDAO.getCredits(user1.getId()));
        System.out.println("Bob's credits: " + creditDAO.getCredits(user2.getId()));
        
        System.out.println("\n=== Demo Complete ===");
        System.out.println("SkillSync platform is working correctly!");
    }
}
