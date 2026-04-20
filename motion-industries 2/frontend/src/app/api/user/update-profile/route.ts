const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function PUT(request: Request) {
  const body = await request.json();
  const authHeader = request.headers.get('authorization') ?? '';

  const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
    },
    body: JSON.stringify(body),
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  });
}
