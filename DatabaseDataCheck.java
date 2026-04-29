import database.DatabaseUtil;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.ResultSet;

public class DatabaseDataCheck {
    public static void main(String[] args) {
        try {
            Connection conn = DatabaseUtil.getConnection();
            System.out.println("=== Database Data Check ===");
            
            Statement stmt = conn.createStatement();
            
            // Check users
            ResultSet users = stmt.executeQuery("SELECT id, name, email FROM users LIMIT 5");
            System.out.println("\nUsers:");
            while (users.next()) {
                System.out.println("  ID: " + users.getInt("id") + 
                                 ", Name: " + users.getString("name") + 
                                 ", Email: " + users.getString("email"));
            }
            
            // Check skills
            ResultSet skills = stmt.executeQuery("SELECT id, name FROM skills LIMIT 5");
            System.out.println("\nSkills:");
            while (skills.next()) {
                System.out.println("  ID: " + skills.getInt("id") + 
                                 ", Name: " + skills.getString("name"));
            }
            
            // Check user_skills
            ResultSet userSkills = stmt.executeQuery("SELECT COUNT(*) as count FROM user_skills");
            if (userSkills.next()) {
                System.out.println("\nUser-Skills relationships: " + userSkills.getInt("count"));
            }
            
            users.close();
            skills.close();
            userSkills.close();
            stmt.close();
            conn.close();
            
        } catch (Exception e) {
            System.out.println("Database error: " + e.getMessage());
        }
    }
}
