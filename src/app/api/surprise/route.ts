/* eslint-disable @typescript-eslint/no-unused-vars */
import { promisePool } from '@/app/lib/connectDB';


export async function GET(request : Request) {
  try {
    const [rows] = await promisePool.query('SELECT * FROM surprises ORDER BY RAND() LIMIT 1');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve surprises' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


