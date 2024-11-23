import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface Question {
  id: number;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
  active: boolean;
}

const questionsFilePath = path.resolve(process.cwd(), 'data', 'questions.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { questions } = req.body;

      if (!Array.isArray(questions)) {
        throw new Error("Data is not in array format");
      }

      fs.writeFileSync(questionsFilePath, JSON.stringify(questions, null, 2));
      res.status(200).json({ message: "Questions updated successfully" });
    } catch (error) {
      console.error("Error updating questions:", error);
      res.status(500).json({ error: "Failed to update questions" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
