package userskill;

import database.DatabaseUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * UserSkill Data Access Object for SkillSync Platform
 * 
 * This class handles all database operations related to user-skill relationships,
 * including assigning skills to users, finding matches, and retrieving user skills.
 */
public class UserSkillDAO {
    
    /**
     * Assigns a skill to a user with a specific type (TEACH or LEARN)
     * 
     * @param userId The ID of the user
     * @param skillId The ID of the skill
     * @param type The type of assignment (TEACH or LEARN)
     * @return true if assignment successful, false otherwise
     */
    public boolean assignSkillToUser(int userId, int skillId, String type) {
        String sql = "INSERT INTO user_skills (user_id, skill_id, type) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            pstmt.setInt(2, skillId);
            pstmt.setString(3, type);
            
            int affectedRows = pstmt.executeUpdate();
            return affectedRows > 0;
            
        } catch (SQLException e) {
            System.err.println("Error assigning skill to user: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Retrieves skill IDs for a user based on type (TEACH or LEARN)
     * 
     * @param userId The ID of the user
     * @param type The type of skills to retrieve (TEACH or LEARN)
     * @return List of skill IDs matching the criteria
     */
    public List<Integer> getSkillsByUserAndType(int userId, String type) {
        List<Integer> skillIds = new ArrayList<>();
        String sql = "SELECT skill_id FROM user_skills WHERE user_id = ? AND type = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            pstmt.setString(2, type);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                skillIds.add(rs.getInt("skill_id"));
            }
        } catch (SQLException e) {
            System.err.println("Error getting skills by user and type: " + e.getMessage());
        }
        return skillIds;
    }
    
    /**
     * Finds users who can teach skills that a specific user wants to learn
     * This is the core matching algorithm for the SkillSync platform
     * 
     * @param userId The ID of the user looking for matches
     * @return List of user IDs who can teach the skills the user wants to learn
     */
    public List<Integer> findMatches(int userId) {
        List<Integer> matchedUserIds = new ArrayList<>();
        
        // SQL query to find users who can teach skills that the given user wants to learn
        String sql = "SELECT DISTINCT us1.user_id " +
                     "FROM user_skills us1 " +
                     "JOIN user_skills us2 ON us1.skill_id = us2.skill_id " +
                     "WHERE us2.user_id = ? AND us2.type = 'LEARN' " +
                     "AND us1.type = 'TEACH' AND us1.user_id != ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            pstmt.setInt(2, userId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                matchedUserIds.add(rs.getInt("user_id"));
            }
        } catch (SQLException e) {
            System.err.println("Error finding matches: " + e.getMessage());
        }
        return matchedUserIds;
    }
    
    /**
     * Retrieves all skills associated with a user (both TEACH and LEARN)
     * 
     * @param userId The ID of the user
     * @return List of UserSkill objects representing all user's skills
     */
    public List<UserSkill> getUserSkills(int userId) {
        List<UserSkill> userSkills = new ArrayList<>();
        String sql = "SELECT * FROM user_skills WHERE user_id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            
            while (rs.next()) {
                UserSkill userSkill = new UserSkill();
                userSkill.setUserId(rs.getInt("user_id"));
                userSkill.setSkillId(rs.getInt("skill_id"));
                userSkill.setType(rs.getString("type"));
                userSkills.add(userSkill);
            }
        } catch (SQLException e) {
            System.err.println("Error getting user skills: " + e.getMessage());
        }
        return userSkills;
    }
}
