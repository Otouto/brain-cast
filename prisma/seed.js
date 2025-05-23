const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get the first user to assign templates to
  const firstUser = await prisma.user.findFirst({
    orderBy: { createdAt: 'asc' }
  });

  if (!firstUser) {
    console.log('No users found. Please create a user first before seeding templates.');
    return;
  }

  console.log(`Assigning templates to user: ${firstUser.email} (${firstUser.id})`);

  // Create default templates
  const templates = [
    {
      name: 'Professional Announcement',
      description: 'Formal announcement of news, achievements, or milestones',
      platform: 'linkedin',
      prompt: 'Format the following content as a professional LinkedIn announcement. Add appropriate hashtags and call to action: {{content}}',
      userId: firstUser.id
    },
    {
      name: 'Engagement Question',
      description: 'Post ending with a question to drive audience engagement',
      platform: 'all',
      prompt: 'Format the following content and end with an engaging question to encourage responses: {{content}}',
      userId: firstUser.id
    },
    {
      name: 'Trending Topic Commentary',
      description: 'Your perspective on a trending industry topic',
      platform: 'twitter',
      prompt: 'Format the following content as a Twitter post commenting on a trending topic. Keep it concise and add appropriate hashtags: {{content}}',
      userId: firstUser.id
    },
    {
      name: 'Quick Tip',
      description: 'Share a valuable tip related to your expertise',
      platform: 'all',
      prompt: 'Format the following content as a quick professional tip. Structure it to be easily scannable and valuable: {{content}}',
      userId: firstUser.id
    }
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { 
        name_platform_user: {
          name: template.name,
          platform: template.platform,
          userId: template.userId
        }
      },
      update: template, // If it exists, update it
      create: template // If it doesn't exist, create it
    });
  }

  console.log('Seeded default templates');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 