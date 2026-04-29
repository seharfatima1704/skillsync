package skill;

/**
 * Skill Entity for SkillSync Platform
 * 
 * This class represents a skill that can be taught or learned by users
 * in the SkillSync system. Skills are the core currency for matching
 * users who want to learn with users who can teach.
 */
public class Skill {
    private int id;
    private String name;
    
    /**
     * Default constructor
     */
    public Skill() {}
    
    /**
     * Constructor for creating a new skill with name
     * 
     * @param name The name of the skill
     */
    public Skill(String name) {
        this.name = name;
    }
    
    /**
     * Constructor for creating a skill with both ID and name
     * 
     * @param id The skill ID
     * @param name The name of the skill
     */
    public Skill(int id, String name) {
        this.id = id;
        this.name = name;
    }
    
    /**
     * Gets the skill ID
     * 
     * @return The skill ID
     */
    public int getId() { return id; }
    
    /**
     * Sets the skill ID
     * 
     * @param id The skill ID to set
     */
    public void setId(int id) { this.id = id; }
    
    /**
     * Gets the skill name
     * 
     * @return The skill name
     */
    public String getName() { return name; }
    
    /**
     * Sets the skill name
     * 
     * @param name The skill name to set
     */
    public void setName(String name) { this.name = name; }
    
    /**
     * Returns a string representation of the Skill object
     * 
     * @return String representation with skill ID and name
     */
    @Override
    public String toString() {
        return "Skill{id=" + id + ", name='" + name + "'}";
    }
}
