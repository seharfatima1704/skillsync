package credit;

/**
 * Credit Entity for SkillSync Platform
 * 
 * This class represents the credit balance for a user in the SkillSync system.
 * Credits are used as a virtual currency for skill exchange sessions,
 * where learners spend credits and teachers earn credits.
 */
public class Credit {
    private int userId;
    private int balance;
    
    /**
     * Default constructor
     */
    public Credit() {}
    
    /**
     * Constructor with initial values
     * 
     * @param userId The ID of the user
     * @param balance The initial credit balance
     */
    public Credit(int userId, int balance) {
        this.userId = userId;
        this.balance = balance;
    }
    
    /**
     * Gets the user ID
     * 
     * @return The user ID
     */
    public int getUserId() { return userId; }
    
    /**
     * Sets the user ID
     * 
     * @param userId The user ID to set
     */
    public void setUserId(int userId) { this.userId = userId; }
    
    /**
     * Gets the current credit balance
     * 
     * @return The credit balance
     */
    public int getBalance() { return balance; }
    
    /**
     * Sets the credit balance
     * 
     * @param balance The balance to set
     */
    public void setBalance(int balance) { this.balance = balance; }
    
    /**
     * Returns a string representation of the Credit object
     * 
     * @return String representation with user ID and balance
     */
    @Override
    public String toString() {
        return "Credit{userId=" + userId + ", balance=" + balance + "}";
    }
}
