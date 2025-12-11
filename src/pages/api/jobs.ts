import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

    try {
        const response = await fetch(`${API_BASE_URL}/api/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const responseText = await response.text();
        
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: responseText || 'Failed to create job' 
            });
        }

        const data = responseText ? JSON.parse(responseText) : {};
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Error proxying job creation:', error);
        return res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Internal server error' 
        });
    }
}
