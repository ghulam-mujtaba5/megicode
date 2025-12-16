/**
 * Lead Scoring API
 * 
 * POST /api/internal/leads/score
 * 
 * Automated lead scoring based on:
 * - Data completeness (contact info, company, requirements)
 * - Engagement signals (response time, message quality)
 * - Business fit (budget, timeline, project type)
 * - Source quality
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { eq } from 'drizzle-orm';

import { authOptions } from '@/auth';
import { getDb } from '@/lib/db';
import { leads, events, leadScoringRules } from '@/lib/db/schema';

interface ScoringCriteria {
  category: string;
  field: string;
  condition: 'exists' | 'length_gt' | 'equals' | 'contains' | 'matches';
  value?: any;
  points: number;
  reason: string;
}

// Default scoring criteria (can be configured via leadScoringRules table)
const DEFAULT_SCORING_CRITERIA: ScoringCriteria[] = [
  // Contact Information (max 25 points)
  { category: 'contact', field: 'email', condition: 'exists', points: 10, reason: 'Email provided' },
  { category: 'contact', field: 'phone', condition: 'exists', points: 8, reason: 'Phone number provided' },
  { category: 'contact', field: 'company', condition: 'exists', points: 7, reason: 'Company name provided' },
  
  // Message Quality (max 25 points)
  { category: 'engagement', field: 'message', condition: 'length_gt', value: 50, points: 10, reason: 'Detailed message (50+ chars)' },
  { category: 'engagement', field: 'message', condition: 'length_gt', value: 150, points: 8, reason: 'Comprehensive message (150+ chars)' },
  { category: 'engagement', field: 'message', condition: 'contains', value: 'budget', points: 7, reason: 'Mentions budget' },
  
  // Project Requirements (max 25 points)
  { category: 'requirements', field: 'service', condition: 'exists', points: 8, reason: 'Service type specified' },
  { category: 'requirements', field: 'srsUrl', condition: 'exists', points: 12, reason: 'SRS document provided' },
  { category: 'requirements', field: 'targetPlatforms', condition: 'exists', points: 5, reason: 'Target platforms specified' },
  
  // Business Indicators (max 25 points)
  { category: 'business', field: 'estimatedBudget', condition: 'exists', points: 10, reason: 'Budget estimate provided' },
  { category: 'business', field: 'company', condition: 'length_gt', value: 3, points: 5, reason: 'Company name length indicates real company' },
  { category: 'business', field: 'source', condition: 'equals', value: 'referral', points: 10, reason: 'Referral lead' },
];

// High-value keywords that indicate serious intent
const INTENT_KEYWORDS = [
  { keyword: 'asap|urgent|immediately|quickly', points: 5, reason: 'Urgent timeline' },
  { keyword: 'enterprise|corporate|large', points: 5, reason: 'Enterprise client indicator' },
  { keyword: 'mvp|minimum viable|startup', points: 3, reason: 'Startup project' },
  { keyword: 'redesign|rebuild|migrate', points: 4, reason: 'Existing system upgrade' },
  { keyword: 'integration|api|connect', points: 3, reason: 'Integration requirements' },
  { keyword: 'mobile|ios|android|app', points: 3, reason: 'Mobile development' },
  { keyword: 'saas|subscription|platform', points: 5, reason: 'SaaS platform' },
];

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();

  try {
    const body = await request.json();
    const { leadId, recalculate = false } = body;

    // Fetch the lead
    const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Use default scoring criteria for now
    // Custom rules from leadScoringRules table can be integrated later
    // when schema is updated with category, points, and reason fields
    const scoringCriteria = DEFAULT_SCORING_CRITERIA;

    // Calculate score
    const scoreBreakdown: Array<{ category: string; reason: string; points: number }> = [];
    let totalScore = 0;

    for (const criteria of scoringCriteria) {
      const points = evaluateCriteria(lead, criteria);
      if (points > 0) {
        scoreBreakdown.push({
          category: criteria.category,
          reason: criteria.reason,
          points,
        });
        totalScore += points;
      }
    }

    // Check for intent keywords in message
    if (lead.message) {
      const messageLower = lead.message.toLowerCase();
      for (const intent of INTENT_KEYWORDS) {
        const regex = new RegExp(intent.keyword, 'i');
        if (regex.test(messageLower)) {
          scoreBreakdown.push({
            category: 'intent',
            reason: intent.reason,
            points: intent.points,
          });
          totalScore += intent.points;
        }
      }
    }

    // Apply score cap (0-100)
    totalScore = Math.min(100, Math.max(0, totalScore));

    // Determine qualification status
    const qualificationThreshold = 70;
    const isQualified = totalScore >= qualificationThreshold;

    // Update lead with score (if desired - requires schema update)
    // For now, we log the score event
    const now = new Date();

    await db.insert(events).values({
      id: crypto.randomUUID(),
      leadId,
      type: 'lead.scored',
      actorUserId: session.user.id,
      payloadJson: {
        score: totalScore,
        isQualified,
        threshold: qualificationThreshold,
        breakdown: scoreBreakdown,
        scoredAt: now,
      },
      createdAt: now,
    });

    // Update lead status if newly qualified and currently 'new'
    if (isQualified && lead.status === 'new') {
      await db
        .update(leads)
        .set({ status: 'in_review', updatedAt: now })
        .where(eq(leads.id, leadId));
    }

    return NextResponse.json({
      leadId,
      score: totalScore,
      maxScore: 100,
      isQualified,
      qualificationThreshold,
      breakdown: scoreBreakdown,
      categoryScores: calculateCategoryScores(scoreBreakdown),
      recommendations: generateRecommendations(lead, scoreBreakdown, totalScore),
      nextAction: isQualified ? 'schedule_followup' : 'add_to_nurture',
    });
  } catch (error) {
    console.error('Error scoring lead:', error);
    return NextResponse.json(
      { error: 'Failed to score lead' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/internal/leads/score
 * 
 * Get scoring configuration and thresholds
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Use default scoring criteria
    const criteria = DEFAULT_SCORING_CRITERIA;

    // Group by category
    const categories: Record<string, any[]> = {};
    for (const c of criteria) {
      if (!categories[c.category]) {
        categories[c.category] = [];
      }
      categories[c.category].push(c);
    }

    return NextResponse.json({
      qualificationThreshold: 70,
      maxScore: 100,
      categories,
      intentKeywords: INTENT_KEYWORDS,
      scoreRanges: [
        { min: 0, max: 39, label: 'Low', color: 'red', action: 'Nurture sequence' },
        { min: 40, max: 69, label: 'Medium', color: 'yellow', action: 'Manual review' },
        { min: 70, max: 84, label: 'High', color: 'green', action: 'Priority follow-up' },
        { min: 85, max: 100, label: 'Hot', color: 'blue', action: 'Immediate contact' },
      ],
    });
  } catch (error) {
    console.error('Error fetching scoring config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scoring configuration' },
      { status: 500 }
    );
  }
}

function evaluateCriteria(lead: any, criteria: ScoringCriteria): number {
  const fieldValue = lead[criteria.field];

  switch (criteria.condition) {
    case 'exists':
      return fieldValue !== null && fieldValue !== undefined && fieldValue !== '' ? criteria.points : 0;

    case 'length_gt':
      if (typeof fieldValue === 'string') {
        return fieldValue.length > (criteria.value || 0) ? criteria.points : 0;
      }
      return 0;

    case 'equals':
      return fieldValue === criteria.value ? criteria.points : 0;

    case 'contains':
      if (typeof fieldValue === 'string') {
        return fieldValue.toLowerCase().includes(String(criteria.value).toLowerCase()) ? criteria.points : 0;
      }
      return 0;

    case 'matches':
      if (typeof fieldValue === 'string' && criteria.value) {
        const regex = new RegExp(criteria.value, 'i');
        return regex.test(fieldValue) ? criteria.points : 0;
      }
      return 0;

    default:
      return 0;
  }
}

function calculateCategoryScores(breakdown: Array<{ category: string; points: number }>): Record<string, number> {
  const categoryScores: Record<string, number> = {};
  for (const item of breakdown) {
    if (!categoryScores[item.category]) {
      categoryScores[item.category] = 0;
    }
    categoryScores[item.category] += item.points;
  }
  return categoryScores;
}

function generateRecommendations(lead: any, breakdown: Array<{ category: string }>, score: number): string[] {
  const recommendations: string[] = [];

  // Check what's missing
  if (!lead.email) {
    recommendations.push('Request email address for follow-up');
  }
  if (!lead.phone) {
    recommendations.push('Obtain phone number for faster communication');
  }
  if (!lead.srsUrl && !lead.message?.toLowerCase().includes('requirement')) {
    recommendations.push('Gather detailed requirements via discovery call');
  }
  if (!lead.estimatedBudget) {
    recommendations.push('Discuss budget expectations');
  }

  // Score-based recommendations
  if (score >= 85) {
    recommendations.unshift('🔥 Hot lead - Contact within 1 hour');
  } else if (score >= 70) {
    recommendations.unshift('✅ Qualified - Schedule discovery call within 24 hours');
  } else if (score >= 40) {
    recommendations.unshift('📋 Review manually - Consider qualification criteria');
  } else {
    recommendations.unshift('📧 Add to nurture sequence');
  }

  return recommendations.slice(0, 5);
}
