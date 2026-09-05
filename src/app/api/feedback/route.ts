import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, rating, tags, comment, category, message, customerEmail, customerName } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const authorEmail = customerEmail || user?.email || 'Anonymous Patron';
    const authorName = customerName || user?.user_metadata?.full_name || 'Ìrísí Patron';

    console.log('[IRISI FEEDBACK RECORDED]:', {
      type: type || 'app_feedback',
      authorName,
      authorEmail,
      rating: rating || null,
      tags: tags || [],
      comment: comment || message || '',
      category: category || 'General Suggestion',
      timestamp: new Date().toISOString(),
    });

    // If reviews table or audit logs are present, we can store in supabase
    try {
      if (type === 'app_rating' && rating) {
        // Log rating
      }
    } catch (dbErr) {
      console.warn('Feedback db note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: type === 'app_rating' ? 'Thank you for rating Ìrísí!' : 'Feedback received. Thank you for helping us improve!',
    });
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
