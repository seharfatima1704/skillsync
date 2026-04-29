package request;

import database.DatabaseUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Request Data Access Object for SkillSync Platform
 * 
 * This class handles all database operations related to skill exchange requests,
 * including sending, accepting, rejecting, and retrieving requests.
 */
public class RequestDAO {
    
    /**
     * Sends a new skill exchange request from one user to another
     * 
     * @param senderId ID of the user sending the request
     * @param receiverId ID of the user receiving the request
     * @return true if request sent successfully, false otherwise
     */
    public boolean sendRequest(int senderId, int receiverId) {
        String sql = "INSERT INTO requests (sender_id, receiver_id, status) VALUES (?, ?, 'PENDING')";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, senderId);
            pstmt.setInt(2, receiverId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error sending request: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Accepts a pending skill exchange request
     * 
     * @param requestId ID of the request to accept
     * @return true if request accepted successfully, false otherwise
     */
    public boolean acceptRequest(int requestId) {
        String sql = "UPDATE requests SET status = 'ACCEPTED' WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, requestId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error accepting request: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Rejects a pending skill exchange request
     * 
     * @param requestId ID of the request to reject
     * @return true if request rejected successfully, false otherwise
     */
    public boolean rejectRequest(int requestId) {
        String sql = "UPDATE requests SET status = 'REJECTED' WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, requestId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error rejecting request: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Retrieves all requests received by a specific user
     * 
     * @param receiverId ID of the user receiving the requests
     * @return List of requests received by the user, ordered by creation date (newest first)
     */
    public List<Request> getRequestsByReceiver(int receiverId) {
        List<Request> requests = new ArrayList<>();
        String sql = "SELECT * FROM requests WHERE receiver_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, receiverId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                requests.add(extractRequestFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting requests by receiver: " + e.getMessage());
        }
        return requests;
    }
    
    /**
     * Retrieves all requests sent by a specific user
     * 
     * @param senderId ID of the user sending the requests
     * @return List of requests sent by the user, ordered by creation date (newest first)
     */
    public List<Request> getRequestsBySender(int senderId) {
        List<Request> requests = new ArrayList<>();
        String sql = "SELECT * FROM requests WHERE sender_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, senderId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                requests.add(extractRequestFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting requests by sender: " + e.getMessage());
        }
        return requests;
    }
    
    /**
     * Retrieves a specific request by its ID
     * 
     * @param requestId ID of the request to retrieve
     * @return Request object if found, null otherwise
     */
    public Request getRequestById(int requestId) {
        String sql = "SELECT * FROM requests WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, requestId);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return extractRequestFromResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting request by ID: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Marks a request as completed (after session is finished)
     * This triggers credit transfer between learner and teacher
     * 
     * @param requestId ID of the request to mark as completed
     * @return true if request marked as completed successfully, false otherwise
     */
    public boolean completeRequest(int requestId) {
        String sql = "UPDATE requests SET status = 'COMPLETED' WHERE id = ? AND status = 'ACCEPTED'";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, requestId);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error completing request: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Checks if there is an accepted request between two users
     * 
     * @param senderId ID of the sender user
     * @param receiverId ID of the receiver user
     * @return true if an accepted request exists, false otherwise
     */
    public boolean isRequestAccepted(int senderId, int receiverId) {
        String sql = "SELECT * FROM requests WHERE sender_id = ? AND receiver_id = ? AND status = 'ACCEPTED'";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, senderId);
            pstmt.setInt(2, receiverId);
            ResultSet rs = pstmt.executeQuery();
            
            return rs.next();
        } catch (SQLException e) {
            System.err.println("Error checking if request is accepted: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Helper method to extract Request object from ResultSet
     * 
     * @param rs ResultSet containing request data
     * @return Request object populated with data from ResultSet
     * @throws SQLException if database access error occurs
     */
    private Request extractRequestFromResultSet(ResultSet rs) throws SQLException {
        Request request = new Request();
        request.setId(rs.getInt("id"));
        request.setSenderId(rs.getInt("sender_id"));
        request.setReceiverId(rs.getInt("receiver_id"));
        request.setStatus(rs.getString("status"));
        request.setCreatedAt(rs.getTimestamp("created_at"));
        return request;
    }
}
