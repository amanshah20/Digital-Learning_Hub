import sequelize from './connection.js';
import { User, Student, Teacher, Course } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function migrate() {
  try {
    console.log('🔄 Starting database migration...');

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully');

    // Create default admin user
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@eduverse.com';

    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      firstName: 'System',
      lastName: 'Administrator',
      isActive: true
    });

    console.log('✅ Default admin user created');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);

    // Create sample course
    const sampleCourse = await Course.create({
      name: 'Bachelor of Computer Science',
      code: 'BCS',
      description: 'Four-year undergraduate program in Computer Science',
      duration: 8,
      department: 'Computer Science',
      isActive: true
    });

    console.log('✅ Sample course created');

    console.log('\n🎉 Database migration completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Login with admin credentials');
    console.log('   3. Add teachers and students');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
