const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash('password123', 10);

  const users = [
    { email: 'admin@campusflow.edu', name: 'Admin', role: 'admin' },
    { email: 'teacher@campusflow.edu', name: 'Teacher', role: 'teacher' },
    { email: 'student@campusflow.edu', name: 'Student', role: 'student' },
    { email: 'parent@campusflow.edu', name: 'Parent', role: 'parent' },
  ];

  for (const user of users) {
    await pool.query(
      `INSERT INTO "users" (id, name, email, password, role, "isActive", "createdAt", "updatedAt") 
       VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [user.name, user.email, hash, user.role]
    );
  }

  console.log('All 4 test users seeded successfully via raw SQL!');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
