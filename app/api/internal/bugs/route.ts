import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { bugs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/internal/bugs - Get all bugs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    
    let query = getDb().select().from(bugs).orderBy(desc(bugs.createdAt));
    
    if (status) {
      query = query.where(eq(bugs.status, status as any)) as any;
    }
    
    const allBugs = await query;
    
    return NextResponse.json({
      success: true,
      data: allBugs,
      count: allBugs.length
    });
  } catch (error: any) {
    console.error('Error fetching bugs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bugs', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/internal/bugs - Create new bug
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, description, projectId, severity, status, reportedByUserId } = body;
    
    if (!title || !projectId) {
      return NextResponse.json(
        { error: 'Bug title and projectId are required' },
        { status: 400 }
      );
    }

    const { nanoid } = await import('nanoid');
    
    const newBug = await getDb().insert(bugs).values({
      id: nanoid(),
      title,
      description,
      projectId,
      severity: severity || 'medium',
      status: status || 'open',
      reportedByUserId,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime()
    } as any).returning();
    
    return NextResponse.json({
      success: true,
      data: newBug[0]
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bug:', error);
    return NextResponse.json(
      { error: 'Failed to create bug', details: error.message },
      { status: 500 }
    );
  }
}


