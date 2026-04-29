package cli;

import user.User;
import user.UserDAO;
import skill.Skill;
import skill.SkillDAO;
import userskill.UserSkillDAO;

import java.util.Scanner;
import java.util.List;
import java.util.InputMismatchException;

/**
 * Command Line Interface for SkillSync Platform
 * 
 * This class provides a text-based interface for users to interact with
 * the SkillSync platform. It handles user authentication, skill management,
 * and basic platform functionality through console commands.
 */
public class MainCLI {
    // Data access objects for database operations
    private static UserDAO userDAO = new UserDAO();
    private static SkillDAO skillDAO = new SkillDAO();
    private static Scanner scanner = new Scanner(System.in);
    
    // Current logged-in user
    private static User currentUser = null;
    
    /**
     * Main entry point for the CLI application
     * 
     * @param args Command line arguments (not used)
     */
    public static void main(String[] args) {
        System.out.println("=== SkillSync CLI ===");
        System.out.println("Command Line Interface for Skill Exchange Platform\n");
        
        while (true) {
            if (currentUser == null) {
                showAuthMenu();
            } else {
                showMainMenu();
            }
        }
    }
    
    /**
     * Displays the authentication menu for login, registration, and exit
     */
    private static void showAuthMenu() {
        System.out.println("\n--- Authentication Menu ---");
        System.out.println("1. Register");
        System.out.println("2. Login");
        System.out.println("3. Exit");
        System.out.print("Choose an option: ");
        
        try {
            int choice = scanner.nextInt();
            scanner.nextLine(); // Clear buffer
            
            switch (choice) {
                case 1:
                    registerUser();
                    break;
                case 2:
                    loginUser();
                    break;
                case 3:
                    System.out.println("Goodbye!");
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        } catch (InputMismatchException e) {
            System.out.println("Please enter a valid number.");
            scanner.nextLine();
        }
    }
    
    /**
     * Displays the main menu for authenticated users
     */
    private static void showMainMenu() {
        System.out.println("\n--- Main Menu ---");
        System.out.println("Welcome, " + currentUser.getName() + "!");
        System.out.println("1. View Profile");
        System.out.println("2. Add Skill");
        System.out.println("3. View Available Skills");
        System.out.println("4. Request Skill Exchange");
        System.out.println("5. View My Requests");
        System.out.println("6. View Time Credits");
        System.out.println("7. Logout");
        System.out.println("8. Exit");
        System.out.print("Choose an option: ");
        
        try {
            int choice = scanner.nextInt();
            scanner.nextLine(); // Clear buffer
            
            switch (choice) {
                case 1:
                    viewProfile();
                    break;
                case 2:
                    addSkill();
                    break;
                case 3:
                    viewAvailableSkills();
                    break;
                case 4:
                    requestSkillExchange();
                    break;
                case 5:
                    viewMyRequests();
                    break;
                case 6:
                    viewTimeCredits();
                    break;
                case 7:
                    logout();
                    break;
                case 8:
                    System.out.println("Goodbye!");
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid option. Please try again.");
            }
        } catch (InputMismatchException e) {
            System.out.println("Please enter a valid number.");
            scanner.nextLine();
        }
    }
    
    /**
     * Handles user registration process
     */
    private static void registerUser() {
        System.out.println("\n--- User Registration ---");
        System.out.print("Enter name: ");
        String name = scanner.nextLine();
        
        System.out.print("Enter email: ");
        String email = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        
        System.out.print("Enter LinkedIn profile (optional): ");
        String linkedin = scanner.nextLine();
        
        User newUser = new User(name, email, password, linkedin);
        if (userDAO.registerUser(newUser)) {
            System.out.println("✓ Registration successful! You can now login.");
        } else {
            System.out.println("✗ Registration failed. Email might already be in use.");
        }
    }
    
    /**
     * Handles user login process
     */
    private static void loginUser() {
        System.out.println("\n--- User Login ---");
        System.out.print("Enter email: ");
        String email = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        
        User user = userDAO.getUserByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            currentUser = user;
            System.out.println("✓ Login successful! Welcome, " + user.getName() + "!");
        } else {
            System.out.println("✗ Login failed. Please check your credentials.");
        }
    }
    
    /**
     * Displays the current user's profile information
     */
    private static void viewProfile() {
        System.out.println("\n--- User Profile ---");
        System.out.println("Name: " + currentUser.getName());
        System.out.println("Email: " + currentUser.getEmail());
        System.out.println("LinkedIn: " + (currentUser.getLinkedinProfile() != null ? currentUser.getLinkedinProfile() : "Not provided"));
        System.out.println("Member since: " + currentUser.getCreatedAt());
    }
    
    /**
     * Allows users to add skills they can teach or want to learn
     */
    private static void addSkill() {
        System.out.println("\n--- Add Skill ---");
        System.out.println("1. Add skill I can TEACH");
        System.out.println("2. Add skill I want to LEARN");
        System.out.print("Choose option: ");
        
        try {
            int choice = scanner.nextInt();
            scanner.nextLine();
            
            String type = (choice == 1) ? "TEACH" : "LEARN";
            System.out.print("Enter skill name: ");
            String skillName = scanner.nextLine();
            
            // First check if skill exists, if not create it
            List<Skill> allSkills = skillDAO.getAllSkills();
            Skill skill = null;
            for (Skill s : allSkills) {
                if (s.getName().equalsIgnoreCase(skillName)) {
                    skill = s;
                    break;
                }
            }
            
            if (skill == null) {
                System.out.print("Skill '" + skillName + "' not found. Create it? (y/n): ");
                String create = scanner.nextLine();
                if (create.equalsIgnoreCase("y")) {
                    if (skillDAO.addSkill(new Skill(skillName))) {
                        System.out.println("✓ Skill created successfully!");
                        // Get the newly created skill
                        allSkills = skillDAO.getAllSkills();
                        for (Skill s : allSkills) {
                            if (s.getName().equalsIgnoreCase(skillName)) {
                                skill = s;
                                break;
                            }
                        }
                    } else {
                        System.out.println("✗ Failed to create skill.");
                        return;
                    }
                } else {
                    System.out.println("Skill addition cancelled.");
                    return;
                }
            }
            
            if (skill != null) {
                UserSkillDAO userSkillDAO = new UserSkillDAO();
            if (userSkillDAO.assignSkillToUser(currentUser.getId(), skill.getId(), type)) {
                    System.out.println("✓ Successfully added '" + skill.getName() + "' as " + type + "!");
                } else {
                    System.out.println("✗ Failed to add skill.");
                }
            }
            
        } catch (InputMismatchException e) {
            System.out.println("Please enter a valid number.");
            scanner.nextLine();
        }
    }
    
    /**
     * Displays all available skills in the system
     */
    private static void viewAvailableSkills() {
        System.out.println("\n--- Available Skills ---");
        List<Skill> skills = skillDAO.getAllSkills();
        
        if (skills.isEmpty()) {
            System.out.println("No skills available.");
        } else {
            System.out.println("Available skills:");
            for (int i = 0; i < skills.size(); i++) {
                System.out.println((i + 1) + ". " + skills.get(i).getName());
            }
        }
    }
    
    /**
     * Placeholder for skill exchange request functionality
     */
    private static void requestSkillExchange() {
        System.out.println("\n--- Request Skill Exchange ---");
        System.out.println("This feature allows you to connect with other users for skill exchange.");
        System.out.println("Coming soon: Full implementation would show available users and allow sending requests.");
        System.out.println("For now, you can view your skills and find matches manually.");
    }
    
    /**
     * Placeholder for viewing user's skill exchange requests
     */
    private static void viewMyRequests() {
        System.out.println("\n--- My Requests ---");
        System.out.println("This feature would show your sent and received skill exchange requests.");
        System.out.println("Coming soon: Full implementation with RequestService integration.");
    }
    
    /**
     * Displays the user's current credit balance
     */
    private static void viewTimeCredits() {
        System.out.println("\n--- Time Credits ---");
        try {
            // Simple credit lookup - would need CreditDAO implementation
            int credits = 10; // Default credits
            System.out.println("Your current credit balance: " + credits);
            System.out.println("Credits are used for scheduling skill exchange sessions.");
        } catch (Exception e) {
            System.out.println("Unable to retrieve credit information.");
        }
    }
    
    /**
     * Logs out the current user and clears the session
     */
    private static void logout() {
        System.out.println("\n--- Logout ---");
        currentUser = null;
        System.out.println("✓ Logged out successfully!");
    }
}
