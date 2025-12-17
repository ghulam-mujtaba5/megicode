import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { proposals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/internal/proposals/[id] - Get single proposal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const proposal = await getDb().select()
      .from(proposals)
      .where(eq(proposals.id, id))
      .limit(1);
    
    if (!proposal.length) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: proposal[0]
    });
  } catch (error: any) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/internal/proposals/[id] - Update proposal
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await getDb().update(proposals)
      .set({
        ...body,
        updatedAt: new Date().getTime()
      })
      .where(eq(proposals.id, id))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated[0]
    });
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/internal/proposals/[id] - Delete proposal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = await getDb().delete(proposals)
      .where(eq(proposals.id, id))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json(
      { error: 'Failed to delete proposal', details: error.message },
      { status: 500 }
    );
  }
}
