import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/internal/clients - Get all clients
export async function GET(request: NextRequest) {
  try {
    const allClients = await getDb().select()
      .from(clients)
      .orderBy(desc(clients.createdAt));
    
    return NextResponse.json({
      success: true,
      data: allClients,
      count: allClients.length
    });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/clients - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, company, website, industry, timezone, billingEmail, notes } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newClient = await getDb().insert(clients).values({
      id: nanoid(),
      name,
      company,
      website,
      industry,
      timezone,
      billingEmail,
      notes,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    return NextResponse.json({
      success: true,
      data: newClient[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { error: 'Failed to create client', details: error.message },
      { status: 500 }
    );
  }
}


