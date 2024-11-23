// pages/api/addScore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, score } = req.body;

  if (!name || typeof score !== 'number') {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }

  try {
    const filePath = path.join(process.cwd(), 'data', 'scores.json');
    const scoresData = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : '[]';
    const scores = JSON.parse(scoresData);

    // Check if user exists in scores array
    const userIndex = scores.findIndex((entry: { name: string }) => entry.name === name);
    if (userIndex > -1) {
      // Update existing user's score
      scores[userIndex].score += score;
    } else {
      // Add new user score
      scores.push({ name, score });
    }

    // Save the updated scores array back to the file
    fs.writeFileSync(filePath, JSON.stringify(scores, null, 2));
    res.status(200).json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Failed to update score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
}
