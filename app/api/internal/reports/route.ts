import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { projects, tasks, leads, proposals, bugs, users } from '@/lib/db/schema';
import { eq, count, and, sql } from 'drizzle-orm';

// GET /api/internal/reports - Get dashboard analytics and reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'dashboard';
    
    if (type === 'dashboard') {
      // Get comprehensive dashboard statistics
      const [
        totalProjects,
        totalTasks,
        totalLeads,
        totalProposals,
        totalBugs,
        totalUsers,
        projectsByStatus,
        tasksByStatus,
        leadsByStatus
      ] = await Promise.all([
        getDb().select({ count: count() }).from(projects),
        getDb().select({ count: count() }).from(tasks),
        getDb().select({ count: count() }).from(leads),
        getDb().select({ count: count() }).from(proposals),
        getDb().select({ count: count() }).from(bugs),
        getDb().select({ count: count() }).from(users),
        getDb().select({ status: projects.status, count: count() })
          .from(projects)
          .groupBy(projects.status),
        getDb().select({ status: tasks.status, count: count() })
          .from(tasks)
          .groupBy(tasks.status),
        getDb().select({ status: leads.status, count: count() })
          .from(leads)
          .groupBy(leads.status)
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalProjects: totalProjects[0]?.count || 0,
            totalTasks: totalTasks[0]?.count || 0,
            totalLeads: totalLeads[0]?.count || 0,
            totalProposals: totalProposals[0]?.count || 0,
            totalBugs: totalBugs[0]?.count || 0,
            totalUsers: totalUsers[0]?.count || 0
          },
          breakdowns: {
            projectsByStatus,
            tasksByStatus,
            leadsByStatus
          },
          generatedAt: new Date().toISOString()
        }
      });
    } else if (type === 'projects') {
      // Project-specific analytics
      const projectStats = await getDb().select({
        id: projects.id,
        name: projects.name,
        status: projects.status,
        taskCount: count(tasks.id)
      })
        .from(projects)
        .leftJoin(tasks, eq(tasks.projectId, projects.id))
        .groupBy(projects.id);
      
      return NextResponse.json({
        success: true,
        data: projectStats
      });
    } else if (type === 'performance') {
      // Performance metrics
      const metrics = {
        tasksCompletedThisMonth: await getDb().select({ count: count() })
          .from(tasks)
          .where(and(
            eq(tasks.status, 'done'),
            sql`${tasks.updatedAt} >= datetime('now', '-30 days')`
          )),
        averageTaskCompletionTime: '3.5 days', // Placeholder - would need more complex query
        activeProjects: await getDb().select({ count: count() })
          .from(projects)
          .where(eq(projects.status, 'in_progress'))
      };
      
      return NextResponse.json({
        success: true,
        data: metrics
      });
    }
    
    return NextResponse.json({
      error: 'Invalid report type'
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}


