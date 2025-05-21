import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUser, updateUser, deleteUser } from '@/services/user.service';
import { headers } from 'next/headers';
import { Webhook } from 'svix';

// This config needs to be moved to the middleware file
// The route matcher here doesn't work as expected
export const config = {
  runtime: 'edge'
};

export async function POST(request: NextRequest) {
  try {
    console.log("Webhook received");
    // Get the headers
    const headersList = await headers();
    const svix_id = headersList.get('svix-id');
    const svix_timestamp = headersList.get('svix-timestamp');
    const svix_signature = headersList.get('svix-signature');

    // If there are no headers, return 400
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing Svix headers", { svix_id, svix_timestamp, svix_signature });
      return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 });
    }

    // Get the body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    // Get the webhook secret from environment variables
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let evt: WebhookEvent;

    try {
      // Create a new svix instance with the secret
      const wh = new Webhook(secret);
      
      // Verify the webhook payload
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Error verifying webhook' },
        { status: 400 }
      );
    }

    // Handle the webhook event
    const eventType = evt.type;
    console.log(`Processing webhook event: ${eventType}`);

    switch (eventType) {
      case 'user.created':
        // Create a new user in the database when a user is created in Clerk
        await createUser({
          clerkId: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || undefined,
        });
        console.log(`User created: ${evt.data.id}`);
        break;
      
      case 'user.updated':
        // Update the user in the database when a user is updated in Clerk
        if (evt.data.id) {
          await updateUser(evt.data.id, {
            email: evt.data.email_addresses[0].email_address,
            name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim() || undefined,
          });
          console.log(`User updated: ${evt.data.id}`);
        }
        break;
      
      case 'user.deleted':
        // Delete the user from the database when a user is deleted in Clerk
        if (evt.data.id) {
          await deleteUser(evt.data.id);
          console.log(`User deleted: ${evt.data.id}`);
        }
        break;
      
      default:
        // Ignore other event types
        console.log(`Ignoring event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error handling webhook:`, error);
    return NextResponse.json(
      { error: `Error handling webhook: ${error}` },
      { status: 500 }
    );
  }
} 