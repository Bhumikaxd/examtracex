import sqlite3

DB_NAME = "database.db"


def create_database():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # ==========================================
    # 1. EXAM PAPERS TABLE
    # ==========================================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS exam_papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_id TEXT UNIQUE NOT NULL,
            subject TEXT NOT NULL,
            exam_date TEXT NOT NULL,
            exam_time TEXT NOT NULL,
            paper_hash TEXT NOT NULL,
            status TEXT DEFAULT 'ACTIVE',
            created_by TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # 2. CHAIN OF CUSTODY TABLE
    # ==========================================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS custody_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_id TEXT NOT NULL,
            action TEXT NOT NULL,
            from_location TEXT,
            to_location TEXT,
            performed_by TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # 3. ACCESS LOGS TABLE
    # ==========================================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS access_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_id TEXT NOT NULL,
            user_name TEXT NOT NULL,
            role TEXT NOT NULL,
            location TEXT NOT NULL,
            access_type TEXT NOT NULL,
            authorized INTEGER NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # ==========================================
    # 4. ALERTS TABLE
    # ==========================================
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            paper_id TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            message TEXT NOT NULL,
            severity TEXT DEFAULT 'HIGH',
            status TEXT DEFAULT 'OPEN',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()

    print("Database and all tables created successfully!")


if __name__ == "__main__":
    create_database()