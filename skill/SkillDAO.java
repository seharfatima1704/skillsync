package skill;

import database.DatabaseUtil;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Skill Data Access Object for SkillSync Platform
 * 
 * This class handles all database operations related to skills,
 * including adding, retrieving, and querying skills.
 */
public class SkillDAO {
    
    /**
     * Adds a new skill to the database
     * 
     * @param skill Skill object to add
     * @return true if skill added successfully, false otherwise
     */
    public boolean addSkill(Skill skill) {
        String sql = "INSERT INTO skills (name) VALUES (?)";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            pstmt.setString(1, skill.getName());
            
            int affectedRows = pstmt.executeUpdate();
            
            if (affectedRows > 0) {
                ResultSet rs = pstmt.getGeneratedKeys();
                if (rs.next()) {
                    skill.setId(rs.getInt(1));
                }
                return true;
            }
        } catch (SQLException e) {
            System.err.println("Error adding skill: " + e.getMessage());
        }
        return false;
    }
    
    /**
     * Retrieves a skill by its name
     * 
     * @param name The name of the skill to find
     * @return Skill object if found, null otherwise
     */
    public Skill getSkillByName(String name) {
        String sql = "SELECT * FROM skills WHERE name = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setString(1, name);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return extractSkillFromResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting skill by name: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Retrieves a skill by its ID
     * 
     * @param id The ID of the skill to find
     * @return Skill object if found, null otherwise
     */
    public Skill getSkillById(int id) {
        String sql = "SELECT * FROM skills WHERE id = ?";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            
            pstmt.setInt(1, id);
            ResultSet rs = pstmt.executeQuery();
            
            if (rs.next()) {
                return extractSkillFromResultSet(rs);
            }
        } catch (SQLException e) {
            System.err.println("Error getting skill by ID: " + e.getMessage());
        }
        return null;
    }
    
    /**
     * Retrieves all skills from the database
     * 
     * @return List of all skills in the system
     */
    public List<Skill> getAllSkills() {
        List<Skill> skills = new ArrayList<>();
        String sql = "SELECT * FROM skills";
        
        try (Connection conn = DatabaseUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            
            while (rs.next()) {
                skills.add(extractSkillFromResultSet(rs));
            }
        } catch (SQLException e) {
            System.err.println("Error getting all skills: " + e.getMessage());
        }
        return skills;
    }
    
    /**
     * Helper method to extract Skill object from ResultSet
     * 
     * @param rs ResultSet containing skill data
     * @return Skill object populated with data from ResultSet
     * @throws SQLException if database access error occurs
     */
    private Skill extractSkillFromResultSet(ResultSet rs) throws SQLException {
        Skill skill = new Skill();
        skill.setId(rs.getInt("id"));
        skill.setName(rs.getString("name"));
        return skill;
    }
}
