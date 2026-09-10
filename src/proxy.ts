import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/auth';

const PROTECTED_API_ROUTES = ['/api/eai/v4/identity/'];
const PUBLIC_ROUTES = [
  '/api/auth',
  '/api/eai/config',
  '/api/eai/stream',
  '/_next',
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route))) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
