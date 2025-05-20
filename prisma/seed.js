const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default templates
  const templates = [
    {
      name: 'Professional Announcement',
      description: 'Formal announcement of news, achievements, or milestones',
      platform: 'linkedin',
      prompt: 'Format the following content as a professional LinkedIn announcement. Add appropriate hashtags and call to action: {{content}}'
    },
    {
      name: 'Engagement Question',
      description: 'Post ending with a question to drive audience engagement',
      platform: 'all',
      prompt: 'Format the following content and end with an engaging question to encourage responses: {{content}}'
    },
    {
      name: 'Trending Topic Commentary',
      description: 'Your perspective on a trending industry topic',
      platform: 'twitter',
      prompt: 'Format the following content as a Twitter post commenting on a trending topic. Keep it concise and add appropriate hashtags: {{content}}'
    },
    {
      name: 'Quick Tip',
      description: 'Share a valuable tip related to your expertise',
      platform: 'all',
      prompt: 'Format the following content as a quick professional tip. Structure it to be easily scannable and valuable: {{content}}'
    }
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { 
        // Using a composite unique constraint since we don't have a unique field
        // to query against in this initial seeding
        name_platform: {
          name: template.name,
          platform: template.platform
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