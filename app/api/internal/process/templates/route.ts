/**
 * Process Templates API
 * 
 * GET  /api/internal/process/templates - List all templates
 * POST /api/internal/process/templates - Create a new template
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/auth';
import {
  getProcessTemplates,
  getTemplateByKey,
  createProcessTemplate,
  cloneTemplate,
  updateTemplateMetadata,
  deleteTemplate,
  getTemplateCategoryCounts,
  searchTemplates,
  ensureDefaultTemplates,
} from '@/lib/workflow/templateSystem';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const key = searchParams.get('key');
  const search = searchParams.get('search');
  const includeDefinition = searchParams.get('includeDefinition') === 'true';

  try {
    // Ensure default templates exist
    await ensureDefaultTemplates();

    // Get specific template by key
    if (key) {
      const template = await getTemplateByKey(key);
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
      }
      return NextResponse.json(template);
    }

    // Search templates
    if (search) {
      const results = await searchTemplates(search);
      return NextResponse.json({ templates: results });
    }

    // List templates
    const templates = await getProcessTemplates({
      category: category as any || undefined,
      activeOnly: true,
      includeDefinition,
    });

    const categoryCounts = await getTemplateCategoryCounts();

    return NextResponse.json({
      templates,
      categoryCounts,
      total: templates.length,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only admin can create templates
  const userRole = session.user.role;
  if (userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        const { name, description, category, tags, complexity, estimatedDurationDays, recommendedTeamSize, steps, baseTemplateKey } = body;

        if (!name || !description || !category) {
          return NextResponse.json(
            { error: 'Missing required fields: name, description, category' },
            { status: 400 }
          );
        }

        const template = await createProcessTemplate({
          name,
          description,
          category,
          tags,
          complexity,
          estimatedDurationDays,
          recommendedTeamSize,
          steps,
          baseTemplateKey,
          createdByUserId: session.user.id,
        });

        return NextResponse.json({
          success: true,
          template,
        });

      case 'clone':
        const { sourceKey, newName, customizations } = body;

        if (!sourceKey || !newName) {
          return NextResponse.json(
            { error: 'Missing required fields: sourceKey, newName' },
            { status: 400 }
          );
        }

        const clonedTemplate = await cloneTemplate(sourceKey, newName, {
          ...customizations,
          createdByUserId: session.user.id,
        });

        if (!clonedTemplate) {
          return NextResponse.json(
            { error: 'Source template not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          template: clonedTemplate,
        });

      case 'update':
        const { key, updates } = body;

        if (!key || !updates) {
          return NextResponse.json(
            { error: 'Missing required fields: key, updates' },
            { status: 400 }
          );
        }

        const updatedTemplate = await updateTemplateMetadata(key, updates);

        if (!updatedTemplate) {
          return NextResponse.json(
            { error: 'Template not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          template: updatedTemplate,
        });

      case 'delete':
        const { templateKey } = body;

        if (!templateKey) {
          return NextResponse.json(
            { error: 'Missing required field: templateKey' },
            { status: 400 }
          );
        }

        const deleted = await deleteTemplate(templateKey);

        if (!deleted) {
          return NextResponse.json(
            { error: 'Cannot delete default template' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Template deleted',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: create, clone, update, or delete' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing template action:', error);
    return NextResponse.json(
      { error: 'Failed to process template action' },
      { status: 500 }
    );
  }
}
