package userskill;

/**
 * UserSkill Entity for SkillSync Platform
 * 
 * This class represents the relationship between users and skills in the SkillSync system.
 * It tracks whether a user can teach a skill or wants to learn a skill.
 * 
 * Type values: TEACH, LEARN
 */
public class UserSkill {
    private int userId;
    private int skillId;
    private String type;
    
    /**
     * Default constructor
     */
    public UserSkill() {}
    
    /**
     * Constructor with initial values
     * 
     * @param userId The ID of the user
     * @param skillId The ID of the skill
     * @param type The type of relationship (TEACH or LEARN)
     */
    public UserSkill(int userId, int skillId, String type) {
        this.userId = userId;
        this.skillId = skillId;
        this.type = type;
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
     * Gets the skill ID
     * 
     * @return The skill ID
     */
    public int getSkillId() { return skillId; }
    
    /**
     * Sets the skill ID
     * 
     * @param skillId The skill ID to set
     */
    public void setSkillId(int skillId) { this.skillId = skillId; }
    
    /**
     * Gets the relationship type
     * 
     * @return The type (TEACH or LEARN)
     */
    public String getType() { return type; }
    
    /**
     * Sets the relationship type
     * 
     * @param type The type to set (TEACH or LEARN)
     */
    public void setType(String type) { this.type = type; }
    
    /**
     * Returns a string representation of the UserSkill object
     * 
     * @return String representation with user ID, skill ID, and type
     */
    @Override
    public String toString() {
        return "UserSkill{userId=" + userId + ", skillId=" + skillId + ", type='" + type + "'}";
    }
}
