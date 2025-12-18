/**
 * API Route: POST /api/camunda/deploy
 * Deploy BPMN/DMN resources to Camunda
 */

import { NextRequest, NextResponse } from 'next/server';
import { deployResources } from '@/lib/camunda';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body; // Array of file paths relative to project root

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'files array is required' },
        { status: 400 }
      );
    }

    // Load BPMN files
    const resources = await Promise.all(
      files.map(async (filePath: string) => {
        const fullPath = path.join(process.cwd(), filePath);
        const content = await fs.readFile(fullPath);
        const name = path.basename(filePath);

        return {
          name,
          content,
        };
      })
    );

    // Deploy to Camunda
    const result = await deployResources({ resources });

    return NextResponse.json({
      success: true,
      deploymentKey: result.key,
      deployments: result.deployments,
    });
  } catch (error: any) {
    console.error('[API] Error deploying resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy resources' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/camunda/deploy
 * Deploy default BPMN files (convenience endpoint)
 */
export async function GET() {
  try {
    const defaultFiles = [
      'Megicode Client Acquisition _ Onboarding.bpmn',
      'megicode_delivery_process.bpmn',
    ];

    const resources = await Promise.all(
      defaultFiles.map(async (fileName) => {
        const fullPath = path.join(process.cwd(), fileName);
        const content = await fs.readFile(fullPath);

        return {
          name: fileName,
          content,
        };
      })
    );

    const result = await deployResources({ resources });

    return NextResponse.json({
      success: true,
      message: 'Default BPMN files deployed',
      deploymentKey: result.key,
      deployments: result.deployments,
    });
  } catch (error: any) {
    console.error('[API] Error deploying default resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to deploy default resources' },
      { status: 500 }
    );
  }
}
