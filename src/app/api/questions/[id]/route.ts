import { promisePool } from '@/app/lib/connectDB';
import { RowDataPacket } from 'mysql2'; // Import RowDataPacket

interface Question {
    id: number;
    question_text: string;
    correct_answer: string;
    options: string; // Keep as string if stored as JSON string
    // other fields
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        // Correctly type the result of the query
        const [rows] = await promisePool.query<RowDataPacket[]>(
            'SELECT * FROM questions WHERE id = ?',
            [id]
        );

        // Type guard to ensure rows is not undefined or null
        if (!rows || rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Question not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Type assertion to tell TS we are sure it matches the Question interface
        const question: Question = {
          id: rows[0].id,
          question_text: rows[0].question_text,
          correct_answer: rows[0].correct_answer,
          options: rows[0].options,
         };

        return new Response(JSON.stringify(question), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve question' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}