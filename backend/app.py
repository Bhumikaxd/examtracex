from flask import Flask, request, jsonify
import sqlite3
import hashlib
from datetime import datetime

app = Flask(__name__)

DB_NAME = "database.db"


# ==========================================
# DATABASE CONNECTION
# ==========================================

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ==========================================
# HOME
# ==========================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "ExamTraceX Backend is running!",
        "status": "success"
    })


# ==========================================
# CREATE EXAM PAPER
# ==========================================

@app.route("/api/papers", methods=["POST"])
def create_paper():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    subject = data.get("subject")
    exam_date = data.get("exam_date")
    exam_time = data.get("exam_time")
    created_by = data.get("created_by")

    if not all([subject, exam_date, exam_time, created_by]):
        return jsonify({
            "error": "All fields are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Generate Paper ID
    cursor.execute("SELECT COUNT(*) FROM exam_papers")
    count = cursor.fetchone()[0]

    paper_id = f"EP{count + 1:03d}"

    # Generate SHA-256 hash
    paper_data = f"{paper_id}{subject}{exam_date}{exam_time}{created_by}"
    paper_hash = hashlib.sha256(
        paper_data.encode()
    ).hexdigest()

    cursor.execute("""
        INSERT INTO exam_papers
        (paper_id, subject, exam_date, exam_time,
         paper_hash, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        paper_id,
        subject,
        exam_date,
        exam_time,
        paper_hash,
        "ACTIVE",
        created_by
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Exam paper created successfully",
        "paper": {
            "paper_id": paper_id,
            "subject": subject,
            "exam_date": exam_date,
            "exam_time": exam_time,
            "paper_hash": paper_hash,
            "status": "ACTIVE",
            "created_by": created_by
        }
    }), 201


# ==========================================
# GET ALL PAPERS
# ==========================================

@app.route("/api/papers", methods=["GET"])
def get_papers():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM exam_papers
        ORDER BY id DESC
    """)

    papers = cursor.fetchall()

    conn.close()

    return jsonify({
        "count": len(papers),
        "papers": [dict(paper) for paper in papers]
    })


# ==========================================
# GET SINGLE PAPER
# ==========================================

@app.route("/api/papers/<paper_id>", methods=["GET"])
def get_paper(paper_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM exam_papers
        WHERE paper_id = ?
    """, (paper_id,))

    paper = cursor.fetchone()

    conn.close()

    if not paper:
        return jsonify({
            "error": "Paper not found"
        }), 404

    return jsonify(dict(paper))


# ==========================================
# ADD CHAIN OF CUSTODY EVENT
# ==========================================

@app.route("/api/papers/<paper_id>/custody", methods=["POST"])
def add_custody_event(paper_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    action = data.get("action")
    from_location = data.get("from_location")
    to_location = data.get("to_location")
    performed_by = data.get("performed_by")

    if not action or not performed_by:
        return jsonify({
            "error": "Action and performed_by are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check paper
    cursor.execute("""
        SELECT * FROM exam_papers
        WHERE paper_id = ?
    """, (paper_id,))

    paper = cursor.fetchone()

    if not paper:
        conn.close()

        return jsonify({
            "error": "Paper not found"
        }), 404

    # Insert custody event
    cursor.execute("""
        INSERT INTO custody_logs
        (paper_id, action, from_location,
         to_location, performed_by)
        VALUES (?, ?, ?, ?, ?)
    """, (
        paper_id,
        action,
        from_location,
        to_location,
        performed_by
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Chain of custody event recorded",
        "paper_id": paper_id,
        "action": action,
        "from_location": from_location,
        "to_location": to_location,
        "performed_by": performed_by
    }), 201


# ==========================================
# GET CHAIN OF CUSTODY
# ==========================================

@app.route("/api/papers/<paper_id>/custody", methods=["GET"])
def get_custody(paper_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM exam_papers
        WHERE paper_id = ?
    """, (paper_id,))

    paper = cursor.fetchone()

    if not paper:
        conn.close()

        return jsonify({
            "error": "Paper not found"
        }), 404

    cursor.execute("""
        SELECT * FROM custody_logs
        WHERE paper_id = ?
        ORDER BY id ASC
    """, (paper_id,))

    logs = cursor.fetchall()

    conn.close()

    return jsonify({
        "paper_id": paper_id,
        "custody_history": [dict(log) for log in logs]
    })


# ==========================================
# ACCESS PAPER
# ==========================================

@app.route("/api/papers/<paper_id>/access", methods=["POST"])
def access_paper(paper_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No data received"
        }), 400

    user_name = data.get("user_name")
    role = data.get("role")
    location = data.get("location")
    access_type = data.get("access_type")

    if not all([user_name, role, location, access_type]):
        return jsonify({
            "error": "All access fields are required"
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check paper
    cursor.execute("""
        SELECT * FROM exam_papers
        WHERE paper_id = ?
    """, (paper_id,))

    paper = cursor.fetchone()

    if not paper:
        conn.close()

        return jsonify({
            "error": "Paper not found"
        }), 404

    # ==========================================
    # AUTHORIZATION RULE
    # ==========================================

    authorized_roles = [
        "Exam Officer",
        "Printing Officer",
        "Exam Center Officer"
    ]

    authorized = 1 if role in authorized_roles else 0

    # Save access log
    cursor.execute("""
        INSERT INTO access_logs
        (paper_id, user_name, role, location,
         access_type, authorized)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        paper_id,
        user_name,
        role,
        location,
        access_type,
        authorized
    ))

    # ==========================================
    # UNAUTHORIZED ACCESS
    # ==========================================

    if authorized == 0:

        # Change paper status
        cursor.execute("""
            UPDATE exam_papers
            SET status = 'COMPROMISED'
            WHERE paper_id = ?
        """, (paper_id,))

        # Create alert
        cursor.execute("""
            INSERT INTO alerts
            (paper_id, alert_type, message, severity, status)
            VALUES (?, ?, ?, ?, ?)
        """, (
            paper_id,
            "UNAUTHORIZED_ACCESS",
            f"Unauthorized access detected by {user_name} at {location}",
            "CRITICAL",
            "OPEN"
        ))

        conn.commit()
        conn.close()

        return jsonify({
            "message": "UNAUTHORIZED ACCESS DETECTED",
            "alert": True,
            "paper_id": paper_id,
            "status": "COMPROMISED"
        }), 403

    # ==========================================
    # AUTHORIZED ACCESS
    # ==========================================

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Access authorized",
        "alert": False,
        "paper_id": paper_id,
        "status": paper["status"]
    }), 200


# ==========================================
# GET ACCESS LOGS
# ==========================================

@app.route("/api/papers/<paper_id>/access", methods=["GET"])
def get_access_logs(paper_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM access_logs
        WHERE paper_id = ?
        ORDER BY id ASC
    """, (paper_id,))

    logs = cursor.fetchall()

    conn.close()

    return jsonify({
        "paper_id": paper_id,
        "access_logs": [dict(log) for log in logs]
    })


# ==========================================
# GET ALERTS
# ==========================================

@app.route("/api/alerts", methods=["GET"])
def get_alerts():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM alerts
        ORDER BY id DESC
    """)

    alerts = cursor.fetchall()

    conn.close()

    return jsonify({
        "count": len(alerts),
        "alerts": [dict(alert) for alert in alerts]
    })


# ==========================================
# CANCEL PAPER
# ==========================================

@app.route("/api/papers/<paper_id>/cancel", methods=["POST"])
def cancel_paper(paper_id):

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM exam_papers
        WHERE paper_id = ?
    """, (paper_id,))

    paper = cursor.fetchone()

    if not paper:
        conn.close()

        return jsonify({
            "error": "Paper not found"
        }), 404

    cursor.execute("""
        UPDATE exam_papers
        SET status = 'CANCELLED'
        WHERE paper_id = ?
    """, (paper_id,))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Exam paper cancelled successfully",
        "paper_id": paper_id,
        "status": "CANCELLED"
    })


# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)