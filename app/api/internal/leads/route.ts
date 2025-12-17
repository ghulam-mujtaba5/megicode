import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/internal/leads - Get all leads
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query = getDb().select().from(leads).orderBy(desc(leads.createdAt));
    
    if (status) {
      query = query.where(eq(leads.status, status as any)) as any;
    }
    
    const allLeads = await query;
    
    return NextResponse.json({
      success: true,
      data: allLeads,
      count: allLeads.length
    });
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, company, email, phone, status, source, message } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Lead name is required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newLead = await getDb().insert(leads).values({
      id: nanoid(),
      name,
      company,
      email,
      phone,
      status: status || 'new',
      source: source || 'internal_manual',
      message,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    return NextResponse.json({
      success: true,
      data: newLead[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead', details: error.message },
      { status: 500 }
    );
  }
}


