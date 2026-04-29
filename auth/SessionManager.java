package auth;

import user.User;

/**
 * Session Manager for SkillSync Platform
 * 
 * This class manages user sessions throughout the application lifecycle.
 * It provides static methods to handle user authentication state and
 * session information.
 */
public class SessionManager {
    private static User currentUser;
    
    /**
     * Sets the current logged-in user
     * 
     * @param user User object to set as current user
     */
    public static void setCurrentUser(User user) {
        currentUser = user;
    }
    
    /**
     * Gets the current logged-in user
     * 
     * @return Current user object, or null if no user is logged in
     */
    public static User getCurrentUser() {
        return currentUser;
    }
    
    /**
     * Checks if a user is currently logged in
     * 
     * @return true if user is logged in, false otherwise
     */
    public static boolean isLoggedIn() {
        return currentUser != null;
    }
    
    /**
     * Logs out the current user by clearing the session
     */
    public static void logout() {
        currentUser = null;
    }
    
    /**
     * Gets the current user's ID
     * 
     * @return User ID if logged in, -1 if no user is logged in
     */
    public static int getCurrentUserId() {
        return currentUser != null ? currentUser.getId() : -1;
    }
}
