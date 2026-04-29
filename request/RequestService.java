package request;

import credit.CreditDAO;
import database.DatabaseUtil;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Request Service for SkillSync Platform
 * 
 * This service layer handles business logic for requests, including
 * the credit transfer system when requests are completed.
 * It ensures atomic operations using database transactions.
 */
public class RequestService {
    
    private RequestDAO requestDAO;
    private CreditDAO creditDAO;
    
    /**
     * Constructor initializes DAOs
     */
    public RequestService() {
        this.requestDAO = new RequestDAO();
        this.creditDAO = new CreditDAO();
    }
    
    /**
     * Completes a request and transfers credits atomically
     * 
     * Process:
     * 1. Mark request as COMPLETED (only if currently ACCEPTED)
     * 2. Deduct 1 credit from learner (sender)
     * 3. Add 1 credit to teacher (receiver)
     * 4. Record transaction in credit_transactions table
     * 
     * All operations are wrapped in a single database transaction
     * 
     * @param requestId ID of the request to complete
     * @return true if request completed and credits transferred successfully, false otherwise
     */
    public boolean completeRequestWithCreditTransfer(int requestId) {
        Connection conn = null;
        
        try {
            // Get request details first
            request.Request request = requestDAO.getRequestById(requestId);
            if (request == null) {
                System.err.println("Request not found: " + requestId);
                return false;
            }
            
            if (!"ACCEPTED".equals(request.getStatus())) {
                System.err.println("Request must be ACCEPTED before completion. Current status: " + request.getStatus());
                return false;
            }
            
            // Start database transaction
            conn = DatabaseUtil.getConnection();
            conn.setAutoCommit(false);
            
            // Step 1: Mark request as completed
            String completeRequestSql = "UPDATE requests SET status = 'COMPLETED' WHERE id = ? AND status = 'ACCEPTED'";
            try (java.sql.PreparedStatement pstmt = conn.prepareStatement(completeRequestSql)) {
                pstmt.setInt(1, requestId);
                int affectedRows = pstmt.executeUpdate();
                
                if (affectedRows == 0) {
                    conn.rollback();
                    System.err.println("Failed to mark request as completed");
                    return false;
                }
            }
            
            // Step 2: Deduct credit from learner (sender)
            String deductSql = "UPDATE credits SET balance = balance - 1 WHERE user_id = ? AND balance >= 1";
            try (java.sql.PreparedStatement pstmt = conn.prepareStatement(deductSql)) {
                pstmt.setInt(1, request.getSenderId());
                int affectedRows = pstmt.executeUpdate();
                
                if (affectedRows == 0) {
                    conn.rollback();
                    System.err.println("Failed to deduct credit from learner (insufficient balance or user not found)");
                    return false;
                }
            }
            
            // Step 3: Add credit to teacher (receiver)
            String addSql = "UPDATE credits SET balance = balance + 1 WHERE user_id = ?";
            try (java.sql.PreparedStatement pstmt = conn.prepareStatement(addSql)) {
                pstmt.setInt(1, request.getReceiverId());
                int affectedRows = pstmt.executeUpdate();
                
                if (affectedRows == 0) {
                    conn.rollback();
                    System.err.println("Failed to add credit to teacher (user not found)");
                    return false;
                }
            }
            
            // Step 4: Record transaction for learner
            String learnerTransactionSql = "INSERT INTO credit_transactions (user_id, credits, transaction_type) VALUES (?, -1, 'SESSION_COMPLETED')";
            try (java.sql.PreparedStatement pstmt = conn.prepareStatement(learnerTransactionSql)) {
                pstmt.setInt(1, request.getSenderId());
                pstmt.executeUpdate();
            }
            
            // Step 5: Record transaction for teacher
            String teacherTransactionSql = "INSERT INTO credit_transactions (user_id, credits, transaction_type) VALUES (?, 1, 'SESSION_TAUGHT')";
            try (java.sql.PreparedStatement pstmt = conn.prepareStatement(teacherTransactionSql)) {
                pstmt.setInt(1, request.getReceiverId());
                pstmt.executeUpdate();
            }
            
            // Commit transaction if all operations successful
            conn.commit();
            System.out.println("Request " + requestId + " completed successfully. Credits transferred from user " + 
                             request.getSenderId() + " to user " + request.getReceiverId());
            return true;
            
        } catch (SQLException e) {
            // Rollback on any error
            try {
                if (conn != null) {
                    conn.rollback();
                }
            } catch (SQLException rollbackEx) {
                System.err.println("Error rolling back transaction: " + rollbackEx.getMessage());
            }
            System.err.println("Error completing request with credit transfer: " + e.getMessage());
            return false;
        } finally {
            // Clean up connection
            try {
                if (conn != null) {
                    conn.setAutoCommit(true);
                    conn.close();
                }
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
    
    /**
     * Gets the current credit balance for a user
     * 
     * @param userId ID of the user
     * @return Current credit balance
     */
    public int getUserCredits(int userId) {
        return creditDAO.getCredits(userId);
    }
    
    /**
     * Checks if a user has sufficient credits for a session
     * 
     * @param userId ID of the user (learner)
     * @param requiredCredits Number of credits required (typically 1)
     * @return true if user has sufficient credits, false otherwise
     */
    public boolean hasSufficientCredits(int userId, int requiredCredits) {
        int currentCredits = creditDAO.getCredits(userId);
        return currentCredits >= requiredCredits;
    }
}
