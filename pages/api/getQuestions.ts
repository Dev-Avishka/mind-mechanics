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
  if (req.method === 'GET') {
    try {
      if (!fs.existsSync(questionsFilePath)) {
        res.status(404).json({ error: 'Questions file not found' });
        return;
      }

      const data = fs.readFileSync(questionsFilePath, 'utf-8');
      const questions: Question[] = JSON.parse(data);

      if (!Array.isArray(questions)) {
        throw new Error('Data is not in array format');
      }

      // Filter for active questions
      const activeQuestions = questions.filter((q) => q.active);
      if (activeQuestions.length === 0) {
        res.status(200).json({ message: 'No active questions at the moment. Please wait for more questions.' });
      } else {
        res.status(200).json(activeQuestions);
      }
    } catch (error) {
      console.error('Error reading or parsing questions file:', error);
      res.status(500).json({ error: 'Failed to load questions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
