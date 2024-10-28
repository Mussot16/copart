const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  // Get all users
  const users = await prisma.user.findMany();

  for (const user of users) {
    // Check if password is already hashed (if not, it's plain text)
    if (!user.password.startsWith('$2b$')) {
      // Hash the plain-text password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update the user's password in the database
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      console.log(`Updated password for user: ${user.email}`);
    }
  }

  console.log('All passwords updated');
}

hashExistingPasswords()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
