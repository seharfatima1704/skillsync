package database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Database Utility Class for SkillSync Platform
 * 
 * This class provides utility methods for establishing and managing database connections
 * to the MySQL database used by the SkillSync platform.
 */
public class DatabaseUtil {
    // Database connection configuration
    private static final String URL = "jdbc:mysql://localhost:3306/skillsync";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "";
    
    /**
     * Establishes a connection to the MySQL database
     * 
     * @return Connection object if successful
     * @throws SQLException if connection fails or driver not found
     */
    public static Connection getConnection() throws SQLException {
        try {
            // Load MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USERNAME, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL Driver not found", e);
        }
    }
    
    /**
     * Safely closes a database connection
     * 
     * @param conn Connection to close (can be null)
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
        }
    }
}
