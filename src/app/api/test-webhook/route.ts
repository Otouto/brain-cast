import { NextRequest, NextResponse } from 'next/server';

export const config = {
  runtime: 'edge'
};

export async function GET() {
  return NextResponse.json({ status: 'OK', message: 'Webhook endpoint accessible' });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Test webhook received', body);
    
    return NextResponse.json({ 
      status: 'OK', 
      message: 'Test webhook received successfully',
      receivedData: body
    });
  } catch (error) {
    console.error('Error in test webhook:', error);
    return NextResponse.json({ 
      status: 'Error', 
      message: 'Error processing test webhook' 
    }, { status: 500 });
  }
} 