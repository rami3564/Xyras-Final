import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, college } = body;

    // Validate inputs
    if (!fullName || !email || !college) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: Add your preferred way to store the data
    // Options:
    // 1. Store in a database (e.g., Supabase, MongoDB, etc.)
    // 2. Send to an email service (e.g., SendGrid)
    // 3. Store in a spreadsheet (e.g., Google Sheets API)
    // For now, we'll just log the data
    console.log('New signup:', { fullName, email, college });

    return NextResponse.json(
      { message: 'Signup successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
