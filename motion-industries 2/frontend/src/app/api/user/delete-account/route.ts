const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';

export async function DELETE(request: Request) {
  const authHeader = request.headers.get('authorization') ?? '';

  const res = await fetch(`${BACKEND_URL}/api/user/delete-account`, {
    method: 'DELETE',
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  });
}
