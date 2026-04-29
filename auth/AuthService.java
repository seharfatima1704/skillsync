package auth;

import user.User;
import user.UserDAO;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Authentication Service for SkillSync Platform
 * 
 * This service handles user authentication operations including login, registration,
 * and password hashing using SHA-256 encryption.
 */
public class AuthService {
    private UserDAO userDAO;
    
    /**
     * Constructor initializes the UserDAO for database operations
     */
    public AuthService() {
        this.userDAO = new UserDAO();
    }
    
    /**
     * Authenticates a user with email and password
     * 
     * @param email User's email address
     * @param password User's password (plain text)
     * @return User object if authentication successful, null otherwise
     */
    public User login(String email, String password) {
        User user = userDAO.getUserByEmail(email);
        
        if (user != null) {
            String hashedPassword = hashPassword(password);
            // Check both hashed and plain password for backward compatibility
            if (user.getPassword().equals(hashedPassword) || user.getPassword().equals(password)) {
                return user;
            }
        }
        return null;
    }
    
    /**
     * Registers a new user in the system
     * 
     * @param user User object with registration details
     * @return true if registration successful, false otherwise
     */
    public boolean register(User user) {
        // Hash the password before storing
        String hashedPassword = hashPassword(user.getPassword());
        user.setPassword(hashedPassword);
        
        boolean registered = userDAO.registerUser(user);
        
        // Initialize user credits upon successful registration
        if (registered) {
            credit.CreditDAO creditDAO = new credit.CreditDAO();
            creditDAO.initializeCredits(user.getId());
        }
        
        return registered;
    }
    
    /**
     * Hashes a password using SHA-256 encryption
     * 
     * @param password Plain text password to hash
     * @return Hashed password as hexadecimal string, or plain password if hashing fails
     */
    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            
            // Convert byte array to hexadecimal string
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            System.err.println("Error hashing password: " + e.getMessage());
            // Return plain password as fallback (not recommended for production)
            return password;
        }
    }
}
