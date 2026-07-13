const { Pool } = require("@neondatabase/serverless");
const bcrypt = require("bcryptjs");

/**
 * Comprehensive seed script for CampusFlow University ERP.
 * Creates: 4 departments, 4 sections, 1 academic year, 15 subjects,
 * 4 test users with profiles, 3 teaching assignments, and sample timetable slots.
 *
 * Usage: DATABASE_URL=... node seed-erp.js
 */

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const passwordHash = await bcrypt.hash("password123", 10);

  console.log("🚀 Seeding University ERP database...\n");

  // ─── 1. Departments ────────────────────────────────────
  console.log("📚 Creating departments...");
  const deptRows = await pool.query(`
    INSERT INTO departments (id, name, code, description, "createdAt")
    VALUES
      ('dept-cse', 'Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering', NOW()),
      ('dept-ece', 'Electronics & Communication', 'ECE', 'Department of Electronics and Communication Engineering', NOW()),
      ('dept-me',  'Mechanical Engineering', 'ME',  'Department of Mechanical Engineering', NOW()),
      ('dept-ce',  'Civil Engineering', 'CE',  'Department of Civil Engineering', NOW())
    ON CONFLICT (code) DO NOTHING
    RETURNING id, code;
  `);
  console.log(`   ✅ ${deptRows.rowCount} departments created`);

  // ─── 2. Sections ───────────────────────────────────────
  console.log("🏫 Creating sections...");
  const secRows = await pool.query(`
    INSERT INTO sections (id, name, "createdAt")
    VALUES
      ('sec-a', 'A', NOW()),
      ('sec-b', 'B', NOW()),
      ('sec-c', 'C', NOW()),
      ('sec-d', 'D', NOW())
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name;
  `);
  console.log(`   ✅ ${secRows.rowCount} sections created`);

  // ─── 3. Academic Year ──────────────────────────────────
  console.log("📅 Creating academic year...");
  const ayRows = await pool.query(`
    INSERT INTO academic_years (id, name, "startDate", "endDate", "isCurrent", "createdAt")
    VALUES
      ('ay-2026-27', '2026-27', '2026-07-01', '2027-06-30', true, NOW())
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name;
  `);
  console.log(`   ✅ ${ayRows.rowCount} academic year(s) created`);

  // ─── 4. Subjects ───────────────────────────────────────
  console.log("📖 Creating subjects...");
  const subRows = await pool.query(`
    INSERT INTO subjects (id, name, code, "creditHours", "departmentId", description, "createdAt")
    VALUES
      ('sub-dbms',   'Database Management Systems',     'CS501', 4, 'dept-cse', 'Relational databases, SQL, normalization, transactions', NOW()),
      ('sub-coa',    'Computer Organization & Arch.',    'CS201', 3, 'dept-cse', 'CPU design, memory hierarchy, instruction sets', NOW()),
      ('sub-se',     'Software Engineering',             'CS101', 3, 'dept-cse', 'SDLC, agile methods, design patterns', NOW()),
      ('sub-os',     'Operating Systems',                'CS502', 4, 'dept-cse', 'Process management, memory, file systems', NOW()),
      ('sub-cn',     'Computer Networks',                'CS503', 3, 'dept-cse', 'OSI model, TCP/IP, routing protocols', NOW()),
      ('sub-dsa',    'Data Structures & Algorithms',     'CS102', 4, 'dept-cse', 'Arrays, trees, graphs, sorting, dynamic programming', NOW()),
      ('sub-dcom',   'Digital Communication',            'EC501', 3, 'dept-ece', 'Modulation, signal processing, digital transmission', NOW()),
      ('sub-vlsi',   'VLSI Design',                      'EC502', 4, 'dept-ece', 'CMOS circuits, FPGA, ASIC design flow', NOW()),
      ('sub-signals','Signals & Systems',                'EC201', 3, 'dept-ece', 'Fourier transform, Laplace, z-transform', NOW()),
      ('sub-thermo', 'Thermodynamics',                   'ME301', 3, 'dept-me',  'Laws of thermodynamics, entropy, heat engines', NOW()),
      ('sub-fm',     'Fluid Mechanics',                  'ME302', 3, 'dept-me',  'Fluid statics, dynamics, Bernoulli equation', NOW()),
      ('sub-som',    'Strength of Materials',            'CE301', 4, 'dept-ce',  'Stress, strain, bending, torsion', NOW()),
      ('sub-survey', 'Surveying',                        'CE302', 3, 'dept-ce',  'Leveling, traversing, contour mapping', NOW()),
      ('sub-math',   'Engineering Mathematics',          'MA101', 4, 'dept-cse', 'Calculus, linear algebra, probability', NOW()),
      ('sub-phy',    'Engineering Physics',              'PH101', 3, 'dept-cse', 'Quantum mechanics, optics, semiconductors', NOW())
    ON CONFLICT (code) DO NOTHING
    RETURNING id, code;
  `);
  console.log(`   ✅ ${subRows.rowCount} subjects created`);

  // ─── 5. Users ──────────────────────────────────────────
  console.log("👤 Creating test users...");
  const userRows = await pool.query(
    `
    INSERT INTO users (id, name, email, password, role, phone, "isActive", "createdAt", "updatedAt")
    VALUES
      ('user-admin',   'Dr. Rajesh Kumar',  'admin@campusflow.edu',   $1, 'admin',   '+91 9876543210', true, NOW(), NOW()),
      ('user-teacher', 'Mr. Anil Sharma',   'teacher@campusflow.edu', $1, 'teacher', '+91 9876543211', true, NOW(), NOW()),
      ('user-student', 'Aman Verma',        'student@campusflow.edu', $1, 'student', '+91 9876543212', true, NOW(), NOW()),
      ('user-parent',  'Mrs. Sunita Verma', 'parent@campusflow.edu',  $1, 'parent',  '+91 9876543213', true, NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      password = EXCLUDED.password,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      "updatedAt" = NOW()
    RETURNING id, email, role;
  `,
    [passwordHash]
  );
  console.log(`   ✅ ${userRows.rowCount} users created/updated`);

  const teacherId = userRows.rows.find((u) => u.email === 'teacher@campusflow.edu').id;
  const studentId = userRows.rows.find((u) => u.email === 'student@campusflow.edu').id;
  const parentId = userRows.rows.find((u) => u.email === 'parent@campusflow.edu').id;

  // ─── 6. Teacher Profile ────────────────────────────────
  console.log("👨‍🏫 Creating teacher profile...");
  await pool.query(`
    INSERT INTO teacher_profiles ("userId", "employeeNumber", "departmentId", designation, "createdAt")
    VALUES ($1, 'EMP-001', 'dept-cse', 'Assistant Professor', NOW())
    ON CONFLICT ("userId") DO UPDATE SET
      "employeeNumber" = EXCLUDED."employeeNumber",
      "departmentId" = EXCLUDED."departmentId",
      designation = EXCLUDED.designation;
  `, [teacherId]);
  console.log("   ✅ Teacher profile created");

  // ─── 7. Student Profile ────────────────────────────────
  console.log("🎓 Creating student profile...");
  await pool.query(`
    INSERT INTO student_profiles ("userId", "rollNumber", "departmentId", semester, "sectionId", "admissionYear", "createdAt")
    VALUES ($1, 'CSE-2026-001', 'dept-cse', 5, 'sec-a', 2024, NOW())
    ON CONFLICT ("userId") DO UPDATE SET
      "rollNumber" = EXCLUDED."rollNumber",
      "departmentId" = EXCLUDED."departmentId",
      semester = EXCLUDED.semester,
      "sectionId" = EXCLUDED."sectionId",
      "admissionYear" = EXCLUDED."admissionYear";
  `, [studentId]);
  console.log("   ✅ Student profile created (CSE → Sem 5 → Section A)");

  // ─── 8. Parent-Student Link ────────────────────────────
  console.log("👪 Creating parent-student link...");
  await pool.query(`
    INSERT INTO parent_student_links (id, "parentId", "studentId", relationship, "isVerified", "createdAt")
    VALUES ('psl-1', $1, $2, 'Mother', true, NOW())
    ON CONFLICT ("parentId", "studentId") DO NOTHING;
  `, [parentId, studentId]);
  console.log("   ✅ Parent linked to student");

  // ─── 9. Teaching Assignments ───────────────────────────
  console.log("📝 Creating teaching assignments...");
  const taRows = await pool.query(`
    INSERT INTO teaching_assignments (id, "teacherProfileId", "subjectId", "departmentId", semester, "sectionId", "academicYearId", "createdAt")
    VALUES
      ('ta-dbms', $1, 'sub-dbms', 'dept-cse', 5, 'sec-a', 'ay-2026-27', NOW()),
      ('ta-coa',  $1, 'sub-coa',  'dept-cse', 2, 'sec-c', 'ay-2026-27', NOW()),
      ('ta-se',   $1, 'sub-se',   'dept-cse', 1, 'sec-a', 'ay-2026-27', NOW())
    ON CONFLICT ("teacherProfileId", "subjectId", "departmentId", semester, "sectionId", "academicYearId") DO NOTHING
    RETURNING id;
  `, [teacherId]);
  console.log(`   ✅ ${taRows.rowCount} teaching assignments created`);

  // ─── 10. Timetable Slots ──────────────────────────────
  console.log("🗓️  Creating timetable slots...");
  const ttRows = await pool.query(`
    INSERT INTO timetable_slots (id, "teachingAssignmentId", "dayOfWeek", "startTime", "endTime", room)
    VALUES
      (gen_random_uuid(), 'ta-dbms', 'monday',    '09:00', '10:00', 'Room 101, Block A'),
      (gen_random_uuid(), 'ta-dbms', 'wednesday', '09:00', '10:00', 'Room 101, Block A'),
      (gen_random_uuid(), 'ta-dbms', 'friday',    '11:00', '12:00', 'Lab 3, Block B'),
      (gen_random_uuid(), 'ta-coa',  'tuesday',   '10:00', '11:00', 'Room 205, Block C'),
      (gen_random_uuid(), 'ta-coa',  'thursday',  '10:00', '11:00', 'Room 205, Block C'),
      (gen_random_uuid(), 'ta-se',   'monday',    '14:00', '15:00', 'Room 102, Block A'),
      (gen_random_uuid(), 'ta-se',   'thursday',  '14:00', '15:00', 'Room 102, Block A')
    ON CONFLICT DO NOTHING
    RETURNING id;
  `);
  console.log(`   ✅ ${ttRows.rowCount} timetable slots created`);

  // ─── 11. Fee Records ──────────────────────────────────
  console.log("💳 Creating fee records...");
  const feeRows = await pool.query(`
    INSERT INTO fee_records (id, "studentId", "academicYearId", "feeType", description, amount, "paidAmount", "dueDate", status, "createdAt")
    VALUES
      (gen_random_uuid(), $1, 'ay-2026-27', 'Tuition',  'Semester 5 tuition fee',  45000, 45000, '2026-08-15', 'paid',    NOW()),
      (gen_random_uuid(), $1, 'ay-2026-27', 'Hostel',   'Hostel fee – Block C',    12000, 6000,  '2026-09-01', 'partial', NOW()),
      (gen_random_uuid(), $1, 'ay-2026-27', 'Lab',      'Computer lab fee',         3000, 0,     '2026-10-01', 'pending', NOW()),
      (gen_random_uuid(), $1, 'ay-2026-27', 'Library',  'Library membership',       1500, 0,     '2026-10-01', 'pending', NOW())
    ON CONFLICT DO NOTHING
    RETURNING id;
  `, [studentId]);
  console.log(`   ✅ ${feeRows.rowCount} fee records created`);

  // ─── Summary ───────────────────────────────────────────
  console.log("\n" + "═".repeat(50));
  console.log("🎉 SEED COMPLETE! University ERP is ready.");
  console.log("═".repeat(50));
  console.log(`
  📊 Summary:
     • 4 Departments (CSE, ECE, ME, CE)
     • 4 Sections (A, B, C, D)
     • 1 Academic Year (2026-27)
     • 15 Subjects across all departments
     • 4 Test Users:
       - admin@campusflow.edu   (Admin)
       - teacher@campusflow.edu (Teacher: Mr. Anil Sharma)
       - student@campusflow.edu (Student: Aman Verma – CSE Sem 5 Sec A)
       - parent@campusflow.edu  (Parent: Mrs. Sunita Verma)
     • 3 Teaching Assignments for Mr. Sharma
     • 7 Timetable Slots
     • 4 Fee Records for student
     • Password for all: password123
  `);

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
