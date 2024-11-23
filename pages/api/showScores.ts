// pages/api/showScores.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const scoresFilePath = path.join(process.cwd(), 'data', 'scores.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const scoresData = fs.existsSync(scoresFilePath)
      ? JSON.parse(fs.readFileSync(scoresFilePath, 'utf8'))
      : [];
    res.status(200).json(scoresData);
  } catch (error) {
    console.error("Error reading scores file:", error);
    res.status(500).json({ message: 'Failed to load scores' });
  }
}
