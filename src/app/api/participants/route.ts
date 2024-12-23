/* eslint-disable @typescript-eslint/no-unused-vars */
import { promisePool } from '@/app/lib/connectDB';

export async function GET(request : Request) {
  try {
    const [rows] = await promisePool.query('SELECT * FROM participants');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve participants' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    // Validate input
    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and Email are required.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert the participant into the database
    const [result] = await promisePool.query(
      'INSERT INTO participants (name, email) VALUES (?, ?)',
      [name, email]
    );

    // Access the insertId correctly
    const insertId = (result as { insertId: number }).insertId;

    return new Response(
      JSON.stringify({ message: 'Participant added successfully.', id: insertId }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to add participant.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


export async function PUT(request: Request) {
    const { id, name, email } = await request.json();
    try {
        await promisePool.query('UPDATE participants SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        return new Response(JSON.stringify({ message: 'Participant updated successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to update participant' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function DELETE(request : Request) {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');
  
      if (!id) {
        return new Response(
          JSON.stringify({ error: 'ID is required to delete a participant.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      await promisePool.query('DELETE FROM participants WHERE id = ?', [id]);
  
      return new Response(JSON.stringify({ message: 'Participant deleted successfully.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete participant.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
