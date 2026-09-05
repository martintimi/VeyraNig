import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Get authenticated user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json(
        { error: 'You must be signed in to change your password.' },
        { status: 401 }
      );
    }

    // 2. If current password is provided, verify it first with Supabase
    if (currentPassword) {
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (verifyError) {
        return NextResponse.json(
          { error: 'Current password is incorrect. Please double check and try again.' },
          { status: 400 }
        );
      }
    }

    // 3. Update password in Supabase Auth
    const { data, error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Failed to update password in Supabase.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully changed in Supabase.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error: any) {
    console.error('Password change API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while changing password.' },
      { status: 500 }
    );
  }
}
