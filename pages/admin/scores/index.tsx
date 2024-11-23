// pages/admin/scores/index.tsx
import { useEffect, useState } from 'react';

interface Score {
  name: string;
  score: number;
}

export default function AdminScores() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    // Fetch scores from API
    fetch('/api/showScores')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {

          const sortedScores = data.sort((a: Score, b: Score) => b.score - a.score);
          setScores(sortedScores);
        } else {
          console.error("Data is not in array format:", data);
        }
      })
      .catch((error) => console.error("Failed to load scores:", error));
  }, []);

  return (
    <div>
      <h1>Scores of Participants</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.name}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
