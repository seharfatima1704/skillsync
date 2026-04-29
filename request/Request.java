package request;

import java.sql.Timestamp;

/**
 * Request Entity for SkillSync Platform
 * 
 * This class represents a skill exchange request between users in the SkillSync system.
 * It tracks the sender, receiver, status, and creation timestamp of each request.
 * 
 * Status values: PENDING, ACCEPTED, REJECTED, COMPLETED
 */
public class Request {
    private int id;
    private int senderId;
    private int receiverId;
    private String status;
    private Timestamp createdAt;
    
    /**
     * Default constructor
     */
    public Request() {}
    
    /**
     * Constructor with initial values
     * 
     * @param senderId ID of the user sending the request
     * @param receiverId ID of the user receiving the request
     * @param status Initial status of the request (typically "PENDING")
     */
    public Request(int senderId, int receiverId, String status) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.status = status;
    }
    
    /**
     * Gets the request ID
     * 
     * @return The request ID
     */
    public int getId() { return id; }
    
    /**
     * Sets the request ID
     * 
     * @param id The request ID to set
     */
    public void setId(int id) { this.id = id; }
    
    /**
     * Gets the sender user ID
     * 
     * @return The sender user ID
     */
    public int getSenderId() { return senderId; }
    
    /**
     * Sets the sender user ID
     * 
     * @param senderId The sender user ID to set
     */
    public void setSenderId(int senderId) { this.senderId = senderId; }
    
    /**
     * Gets the receiver user ID
     * 
     * @return The receiver user ID
     */
    public int getReceiverId() { return receiverId; }
    
    /**
     * Sets the receiver user ID
     * 
     * @param receiverId The receiver user ID to set
     */
    public void setReceiverId(int receiverId) { this.receiverId = receiverId; }
    
    /**
     * Gets the request status
     * 
     * @return The request status (PENDING, ACCEPTED, REJECTED, COMPLETED)
     */
    public String getStatus() { return status; }
    
    /**
     * Sets the request status
     * 
     * @param status The status to set
     */
    public void setStatus(String status) { this.status = status; }
    
    /**
     * Gets the creation timestamp
     * 
     * @return The creation timestamp
     */
    public Timestamp getCreatedAt() { return createdAt; }
    
    /**
     * Sets the creation timestamp
     * 
     * @param createdAt The creation timestamp to set
     */
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    /**
     * Returns a string representation of the Request object
     * 
     * @return String representation with key request details
     */
    @Override
    public String toString() {
        return "Request{id=" + id + ", senderId=" + senderId + ", receiverId=" + receiverId + ", status='" + status + "'}";
    }
}
