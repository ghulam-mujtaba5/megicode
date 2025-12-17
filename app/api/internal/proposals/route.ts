import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { proposals } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/internal/proposals - Get all proposals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    
    let query = getDb().select().from(proposals).orderBy(desc(proposals.createdAt));
    
    if (status) {
      query = query.where(eq(proposals.status, status as any)) as any;
    }
    
    const allProposals = await query;
    
    return NextResponse.json({
      success: true,
      data: allProposals,
      count: allProposals.length
    });
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/proposals - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, clientId, leadId, totalAmount, status, validUntil } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Proposal title is required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newProposal = await getDb().insert(proposals).values({
      id: nanoid(),
      title,
      clientId,
      leadId,
      totalAmount,
      status: status || 'draft',
      validUntil: validUntil ? new Date(validUntil).getTime() : null,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    return NextResponse.json({
      success: true,
      data: newProposal[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal', details: error.message },
      { status: 500 }
    );
  }
}


