import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const res = await fetch(
    `${supabaseUrl}/rest/v1/coupons?code=eq.${code}&is_active=eq.true&select=*`,
    {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  const data = await res.json();

  if (!data || data.length === 0) {
    return NextResponse.json(null, { status: 404 });
  }

  const coupon = data[0];

  if (coupon.max_uses > 0 && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(coupon);
}
