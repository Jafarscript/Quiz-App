import { promisePool } from '@/app/lib/connectDB';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request : Request) {
  try {
    const [rows] = await promisePool.query('SELECT * FROM questions');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve questions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}