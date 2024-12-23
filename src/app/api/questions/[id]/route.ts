import { promisePool } from '@/app/lib/connectDB';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const [rows] = await promisePool.query(`SELECT * FROM questions WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Question not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve question' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
