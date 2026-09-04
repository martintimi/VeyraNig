import { NextResponse } from 'next/server';

// Strong Server-Side Master Security Keys
const ALLOWED_ADMIN_EMAILS = [
  process.env.SUPER_ADMIN_EMAIL,
  'admin@irisi.ng',
  'admin@veyra.ng'
].filter(Boolean).map(e => (e as string).toLowerCase());

const VALID_MASTER_KEYS = [
  'IRISI_SEC_9942#HQ_EXEC',
  'IrisiExecutive2026!#',
  'IRISI-MASTER-9821-KEY#NG',
  'VEYRA_SEC_9942#HQ_LAGOS_EXEC',
  'VeyraExecutive2026!#',
  'VEYRA-MASTER-9821-KEY#NG',
  process.env.SUPER_ADMIN_PASSWORD || ''
].filter(Boolean);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter your authorized email and master security key.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    const isPasswordValid = VALID_MASTER_KEYS.includes(cleanPassword);
    const isEmailValid = process.env.SUPER_ADMIN_EMAIL 
      ? cleanEmail === process.env.SUPER_ADMIN_EMAIL.toLowerCase().trim()
      : cleanEmail.length > 3 && cleanEmail.includes('@');

    if (!isEmailValid || !isPasswordValid) {
      return NextResponse.json({ error: 'Invalid executive credentials. Access denied.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Executive session authenticated.',
      admin: {
        id: 'admin-master-001',
        name: 'Ìrísí Executive HQ',
        email: cleanEmail,
        role: 'Super Administrator'
      },
      token: 'irisi_sec_' + Buffer.from(`${cleanEmail}-${Date.now()}`).toString('base64')
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Authentication service temporarily unavailable.' }, { status: 500 });
  }
}
