package credit;

import database.DatabaseUtil;
import java.sql.*;

/**
 * Credit Data Access Object for SkillSync Platform
 * 
 * This class handles all database operations related to user credits,
 * including initialization, balance queries, adding credits, and deducting credits.
 */
public class CreditDAO {
    
    /**
     * Initializes credit balance for a new user with 10 default credits
     * 
     * @param userId The ID of the user to initialize credits for
     * @return true if initialization successful, false otherwise
     */
    public boolean initializeCredits(int userId) {
        String sql = "INSERT INTO credits (user_id, balance) VALUES (?, 10)";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error initializing credits: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Gets the current credit balance for a user
     * 
     * @param userId The ID of the user
     * @return Current credit balance, 0 if user not found
     */
    public int getCredits(int userId) {
        String sql = "SELECT balance FROM credits WHERE user_id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return rs.getInt("balance");
            }
        } catch (SQLException e) {
            System.err.println("Error getting credits: " + e.getMessage());
        }
        return 0;
    }
    
    /**
     * Adds credits to a user's balance
     * 
     * @param userId The ID of the user
     * @param amount The amount of credits to add
     * @return true if credits added successfully, false otherwise
     */
    public boolean addCredits(int userId, int amount) {
        String sql = "UPDATE credits SET balance = balance + ? WHERE user_id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, amount);
            pstmt.setInt(2, userId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error adding credits: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Deducts credits from a user's balance if sufficient funds available
     * 
     * @param userId The ID of the user
     * @param amount The amount of credits to deduct
     * @return true if credits deducted successfully, false if insufficient funds or error
     */
    public boolean deductCredits(int userId, int amount) {
        String checkSql = "SELECT balance FROM credits WHERE user_id = ?";
        String updateSql = "UPDATE credits SET balance = balance - ? WHERE user_id = ? AND balance >= ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement checkStmt = conn.prepareStatement(checkSql);
             PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
            
            checkStmt.setInt(1, userId);
            ResultSet rs = checkStmt.executeQuery();
            
            if (rs.next()) {
                int currentBalance = rs.getInt("balance");
                if (currentBalance >= amount) {
                    updateStmt.setInt(1, amount);
                    updateStmt.setInt(2, userId);
                    updateStmt.setInt(3, amount);
                    
                    int affectedRows = updateStmt.executeUpdate();
                    return affectedRows > 0;
                }
            }
        } catch (SQLException e) {
            System.err.println("Error deducting credits: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Gets complete credit information for a user
     * 
     * @param userId The ID of the user
     * @return Credit object with user's credit info, null if not found
     */
    public Credit getCreditInfo(int userId) {
        String sql = "SELECT * FROM credits WHERE user_id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                Credit credit = new Credit();
                credit.setUserId(rs.getInt("user_id"));
                credit.setBalance(rs.getInt("balance"));
                return credit;
            }
        } catch (SQLException e) {
            System.err.println("Error getting credit info: " + e.getMessage());
        }
        return null;
    }
}
