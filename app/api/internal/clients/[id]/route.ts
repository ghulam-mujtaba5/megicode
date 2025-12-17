import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { clients } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/internal/clients/[id] - Get single client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const client = await getDb().select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);
    
    if (!client.length) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: client[0]
    });
  } catch (error: any) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/internal/clients/[id] - Update client
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updated = await getDb().update(clients)
      .set({
        ...body,
        updatedAt: new Date().getTime()
      })
      .where(eq(clients.id, id))
      .returning();
    
    if (!updated.length) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updated[0]
    });
  } catch (error: any) {
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: 'Failed to update client', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/internal/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = await getDb().delete(clients)
      .where(eq(clients.id, id))
      .returning();
    
    if (!deleted.length) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: 'Failed to delete client', details: error.message },
      { status: 500 }
    );
  }
}
