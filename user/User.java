package user;

import java.sql.Timestamp;

/**
 * User Entity for SkillSync Platform
 * 
 * This class represents a user in the SkillSync system. Users can register,
 * authenticate, and participate in skill exchange as both teachers and learners.
 */
public class User {
    private int id;
    private String name;
    private String email;
    private String password;
    private String linkedinProfile;
    private Timestamp createdAt;
    
    /**
     * Default constructor
     */
    public User() {}
    
    /**
     * Constructor for creating a new user
     * 
     * @param name User's full name
     * @param email User's email address (used for login)
     * @param password User's password (will be hashed)
     * @param linkedinProfile User's LinkedIn profile URL (optional)
     */
    public User(String name, String email, String password, String linkedinProfile) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.linkedinProfile = linkedinProfile;
    }
    
    /**
     * Gets the user ID
     * 
     * @return The user ID
     */
    public int getId() { return id; }
    
    /**
     * Sets the user ID
     * 
     * @param id The user ID to set
     */
    public void setId(int id) { this.id = id; }
    
    /**
     * Gets the user's name
     * 
     * @return The user's name
     */
    public String getName() { return name; }
    
    /**
     * Sets the user's name
     * 
     * @param name The name to set
     */
    public void setName(String name) { this.name = name; }
    
    /**
     * Gets the user's email address
     * 
     * @return The user's email
     */
    public String getEmail() { return email; }
    
    /**
     * Sets the user's email address
     * 
     * @param email The email to set
     */
    public void setEmail(String email) { this.email = email; }
    
    /**
     * Gets the user's password (hashed)
     * 
     * @return The user's password
     */
    public String getPassword() { return password; }
    
    /**
     * Sets the user's password
     * 
     * @param password The password to set
     */
    public void setPassword(String password) { this.password = password; }
    
    /**
     * Gets the user's LinkedIn profile URL
     * 
     * @return The LinkedIn profile URL
     */
    public String getLinkedinProfile() { return linkedinProfile; }
    
    /**
     * Sets the user's LinkedIn profile URL
     * 
     * @param linkedinProfile The LinkedIn profile URL to set
     */
    public void setLinkedinProfile(String linkedinProfile) { this.linkedinProfile = linkedinProfile; }
    
    /**
     * Gets the account creation timestamp
     * 
     * @return The creation timestamp
     */
    public Timestamp getCreatedAt() { return createdAt; }
    
    /**
     * Sets the account creation timestamp
     * 
     * @param createdAt The creation timestamp to set
     */
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    /**
     * Returns a string representation of the User object
     * 
     * @return String representation with user ID, name, and email
     */
    @Override
    public String toString() {
        return "User{id=" + id + ", name='" + name + "', email='" + email + "'}";
    }
}
