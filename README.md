# ExamtraceX

Build a complete, modern, professional hackathon prototype website called "ExamTraceX".

PROJECT TITLE:

Automated Exam Paper Leak Detection and Chain of Custody System

TAGLINE:

"Secure Every Exam Paper. Trace Every Step."

IMPORTANT:

This is a hackathon prototype for a project demonstration. Build a polished, realistic, fully navigable website with mock/demo data. Do not overcomplicate it with blockchain, GPS, machine learning, or other unnecessary technologies.

The main purpose is to demonstrate how an exam paper can be securely created, tracked, monitored, and investigated if suspicious activity occurs.

CORE WORKFLOW:

Exam Officer

→ Creates Exam Paper

→ System generates unique Paper ID

→ System generates SHA-256 hash

→ Paper is transferred

→ Every transfer/access is recorded

→ Suspicious access is detected

→ 🚨 Alert generated

→ Admin investigates

→ Chain of Custody is displayed

→ Paper can be marked COMPROMISED

→ Admin can CANCEL the paper

==================================================

1. LANDING PAGE

==================================================

Create a premium cybersecurity-style landing page.

Header:

- ExamTraceX logo

- Home

- Features

- How It Works

- Security

- Login

Hero section:

Heading:

"Secure Every Exam Paper. Trace Every Step."

Subtitle:

"ExamTraceX is an automated examination security system that monitors paper access, tracks every transfer, detects suspicious activity, and maintains a complete chain of custody."

Buttons:

- "Get Started"

- "View Demo"

Add a visual security dashboard illustration on the right.

Features section with 6 cards:

1. Secure Paper Management

2. Unique Paper ID

3. SHA-256 Integrity Verification

4. Chain of Custody

5. Leak Detection

6. Real-Time Alerts

How It Works section:

CREATE

↓

SECURE

↓

TRANSFER

↓

MONITOR

↓

DETECT

↓

ALERT

↓

INVESTIGATE

↓

TAKE ACTION

Add a section explaining:

"Every important paper event is recorded with:

WHO + WHAT + WHEN + WHERE"

==================================================

2. LOGIN PAGE

==================================================

Create a professional login page.

Fields:

- Email

- Password

Add demo role buttons:

- Admin

- Exam Officer

- Printing Staff

- Exam Center

For the prototype, clicking a demo role should directly open the corresponding dashboard.

==================================================

3. ADMIN DASHBOARD

==================================================

Create a professional security dashboard with a left sidebar.

Sidebar:

- Dashboard

- Exam Papers

- Create Paper

- Chain of Custody

- Access Logs

- Alerts

- Users

- Settings

- Logout

Top bar:

"ExamTraceX Security Dashboard"

Statistics cards:

Total Papers: 24

Active Papers: 19

Compromised Papers: 2

Cancelled Papers: 3

Open Alerts: 4

Authorized Users: 18

Security status card:

SYSTEM STATUS

🟢 Operational

Access Control: Active

Paper Integrity: Active

Chain of Custody: Active

Leak Detection: Active

Recent Alerts section:

🚨 HIGH

Possible Paper Leak

Paper: EP001

Reason: Unauthorized Access

User: Unknown

Time: 10:35 AM

Button:

"Investigate"

Recent Activity timeline:

🟢 EP001 created

🟢 EP001 transferred to Printing Staff

🟢 EP001 received by Printing Staff

🟠 Suspicious access detected

🔴 EP003 marked compromised

==================================================

4. EXAM PAPERS PAGE

==================================================

Create a searchable/filterable table.

Columns:

Paper ID

Subject

Exam Date

Created By

Status

Last Activity

Actions

Demo papers:

EP001 | Mathematics | 25 Aug 2026 | Exam Officer | COMPROMISED

EP002 | Physics | 26 Aug 2026 | Exam Officer | ACTIVE

EP003 | Chemistry | 27 Aug 2026 | Exam Officer | CANCELLED

EP004 | Computer Science | 28 Aug 2026 | Exam Officer | ACTIVE

EP005 | English | 29 Aug 2026 | Exam Officer | ACTIVE

Status badges:

ACTIVE = green

COMPROMISED = orange/red

CANCELLED = red

Actions:

- View

- Chain of Custody

- Access Logs

==================================================

5. CREATE EXAM PAPER PAGE

==================================================

Create a professional form.

Fields:

Subject

Exam Date

Exam Time

Exam Type

Upload Question Paper

Button:

"Create Secure Paper"

After clicking the button, simulate creation and show:

✅ Paper Created Successfully

Paper ID:

EP006

SHA-256 Hash:

8f3a92xxxxxxxxxxxxxxxx

Status:

ACTIVE

Created By:

Exam Officer

Created At:

19 Aug 2026

Also automatically add:

"Paper Created" to the Chain of Custody.

==================================================

6. PAPER DETAILS PAGE

==================================================

Show:

Paper ID: EP001

Subject: Mathematics

Exam Date: 25 Aug 2026

Exam Time: 09:00 AM

Status: ACTIVE

Security Information:

SHA-256 Hash:

8f3a92xxxxxxxx

Integrity:

🟢 VERIFIED

Created By:

Exam Officer

Created At:

19 Aug 2026

Buttons:

- Verify Integrity

- Transfer Paper

- View Chain of Custody

- View Access Logs

- Simulate Unauthorized Access

IMPORTANT:

When "Simulate Unauthorized Access" is clicked:

1. Create a suspicious access event.

2. Show a red warning.

3. Generate a HIGH severity alert.

4. Add the event to the access logs.

5. Add the event to the Chain of Custody.

Display:

🚨 POSSIBLE PAPER LEAK DETECTED

Reason:

Unauthorized Access

Paper:

EP001

Severity:

HIGH

==================================================

7. CHAIN OF CUSTODY PAGE

==================================================

This is one of the most important features.

Create a beautiful vertical timeline.

Example:

🟢 PAPER CREATED

19 Aug 2026 — 09:00 AM

Exam Officer

Location: Examination Office

↓

🟢 PAPER TRANSFERRED

19 Aug 2026 — 10:00 AM

Exam Officer → Printing Staff

Location: Printing Center

↓

🟢 PAPER RECEIVED

19 Aug 2026 — 10:15 AM

Printing Staff

Location: Printing Center

↓

🟢 PAPER TRANSFERRED

19 Aug 2026 — 12:00 PM

Printing Staff → Storage Officer

Location: Secure Storage

↓

🟠 SUSPICIOUS ACCESS

19 Aug 2026 — 12:15 PM

Unknown User

Location: Unknown

↓

🔴 ALERT GENERATED

Possible unauthorized access detected.

Each event should show:

- User

- Action

- Date

- Time

- Location

- From

- To

Add a heading:

"Complete Chain of Custody"

Subtitle:

"Every important movement and access event is recorded."

==================================================

8. ACCESS LOGS PAGE

==================================================

Create a professional table.

Columns:

Paper ID

User

Action

Date

Time

Result

Device/IP

Demo data:

EP001 | Exam Officer | VIEW | 19 Aug | 10:00 | ALLOWED

EP001 | Printing Staff | VIEW | 19 Aug | 11:00 | ALLOWED

EP001 | Unknown User | ACCESS ATTEMPT | 19 Aug | 11:05 | BLOCKED

Status badges:

🟢 ALLOWED

🟠 SUSPICIOUS

🔴 BLOCKED

==================================================

9. LEAK DETECTION CENTER

==================================================

Create a page called:

"Leak Detection Center"

Explain that the prototype detects suspicious behavior using security rules.

Create three rules:

RULE 1:

Unauthorized Access

RULE 2:

Multiple Failed Access Attempts

RULE 3:

Unexpected Access Time

When triggered, show:

🚨 POSSIBLE LEAK DETECTED

Include:

Paper ID

User

Reason

Detection Time

Severity

Status

==================================================

10. ALERTS PAGE

==================================================

Create a professional alert management page.

Show alert cards/table:

Alert ID

Paper ID

Reason

Severity

User

Time

Status

Example:

ALERT-001

Paper: EP001

Reason: Unauthorized Access

Severity: HIGH

User: Unknown

Status: OPEN

Buttons:

"Investigate"

"Resolve"

Use severity badges:

HIGH

MEDIUM

LOW

==================================================

11. INVESTIGATION PAGE

==================================================

When Admin clicks "Investigate", show:

ALERT DETAILS

Alert ID: ALERT-001

Paper ID: EP001

Reason: Unauthorized Access

Severity: HIGH

Time: 10:35 AM

User: Unknown

PAPER DETAILS

Subject: Mathematics

Exam Date: 25 Aug 2026

Current Status: ACTIVE

Integrity: VERIFIED

RECENT ACCESS HISTORY

Show the suspicious access and previous legitimate accesses.

CHAIN OF CUSTODY

Show complete timeline.

At bottom add:

"Mark as Compromised"

"Cancel Paper"

"Resolve Alert"

==================================================

12. MARK AS COMPROMISED

==================================================

When Admin clicks:

"Mark as Compromised"

Update:

ACTIVE

↓

COMPROMISED

Show:

⚠️ PAPER COMPROMISED

"This paper has been flagged as potentially leaked."

Add this action to the Chain of Custody.

==================================================

13. CANCEL PAPER

==================================================

When Admin clicks:

"Cancel Paper"

Show confirmation modal:

"Are you sure you want to cancel EP001?"

"Cancellation will mark this examination paper as CANCELLED."

Buttons:

Confirm Cancellation

Go Back

After confirmation:

❌ PAPER CANCELLED

Status:

CANCELLED

Add cancellation event to Chain of Custody.

IMPORTANT:

An alert should NOT automatically cancel the paper.

Correct workflow:

Suspicious Activity

→ Alert

→ Admin Investigation

→ Mark Compromised

→ Cancel if required

==================================================

14. USERS PAGE

==================================================

Create a user management page.

Columns:

Name

Email

Role

Status

Last Activity

Roles:

Admin

Exam Officer

Printing Staff

Exam Center

Demo users:

Admin User

Exam Officer

Printing Staff

Exam Center Officer

==================================================

15. DEMO SCENARIO

==================================================

Make the website support this complete presentation flow:

STEP 1:

Login as Exam Officer.

STEP 2:

Create a Mathematics exam paper.

STEP 3:

System generates:

Paper ID: EP001

SHA-256 Hash: XXXXX

Status: ACTIVE

STEP 4:

Transfer the paper to Printing Staff.

STEP 5:

Show the Chain of Custody.

STEP 6:

Simulate unauthorized access.

STEP 7:

System generates:

🚨 POSSIBLE PAPER LEAK DETECTED

STEP 8:

Login as Admin.

STEP 9:

Admin sees the HIGH severity alert.

STEP 10:

Admin investigates.

STEP 11:

Admin views:

- Paper details

- Access logs

- Chain of custody

STEP 12:

Admin clicks:

"Mark as Compromised"

STEP 13:

Admin clicks:

"Cancel Paper"

STEP 14:

Final status:

EP001

❌ CANCELLED

STEP 15:

Show the cancellation as the latest Chain of Custody event.

==================================================

16. IMPORTANT PROTOTYPE BEHAVIOR

==================================================

Make the website interactive.

Buttons should actually change the prototype state.

For example:

Create Paper

→ creates a new demo paper

Simulate Unauthorized Access

→ creates alert

Investigate

→ opens investigation page

Mark Compromised

→ changes status

Cancel Paper

→ changes status to CANCELLED

Resolve Alert

→ changes alert status to RESOLVED

Transfer Paper

→ adds a new Chain of Custody event

Use mock/local data or frontend state.

The prototype does NOT need a real backend yet.

==================================================

17. VISUAL DESIGN

==================================================

Make it look like a professional cybersecurity platform.

Use:

- Navy/dark blue primary theme

- White/light cards

- Red for critical alerts

- Orange for suspicious activity

- Green for secure/verified

- Modern icons

- Rounded cards

- Subtle animations

- Clean typography

- Responsive layout

- Professional charts where useful

Avoid excessive animations.

The dashboard should look impressive when presented to hackathon judges.

==================================================

18. FINAL REQUIREMENT

==================================================

The most important thing is that the prototype clearly communicates:

SECURE

↓

TRACK

↓

MONITOR

↓

DETECT

↓

ALERT

↓

INVESTIGATE

↓

COMPROMISE

↓

CANCEL

Make the entire website polished, connected, intuitive and presentation-ready.

Project name:

EXAMTRACEX

Tagline:

"Secure Every Exam Paper. Trace Every Step."

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2262e856-8a3b-4c69-9afc-87712528f9c3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
