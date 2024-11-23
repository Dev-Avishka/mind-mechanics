// pages/admin/question/index.tsx
import { useEffect, useState } from 'react';

interface Question {
  id: number;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
  active: boolean;
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all questions for the admin
    fetch('/api/getAdminQuestions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.error("Data is not an array:", data);
        }
      })
      .catch((error) => console.error("Failed to load questions:", error))
      .finally(() => setLoading(false));
  }, []);

  const toggleQuestionStatus = async (id: number, isActive: boolean) => {
    const endpoint = isActive ? '/api/setQuestionInactive' : '/api/setQuestionActive';
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId: id }),
    });
    // Refresh the questions list to reflect the change
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, active: !isActive } : q))
    );
  };

  const finalizeQuestions = async () => {
    alert("Questions finalized successfully.");
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="admin-container">
      <h1>Admin - Manage Questions</h1>
      <button 
        onClick={finalizeQuestions} 
        className="finalize-button"
      >
        Finalize
      </button>
      <ul className="question-list">
        {questions.map((question) => (
          <li key={question.id} className="question-item">
            <p className="question-text">Question: {question.question}</p>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={question.active}
                onChange={() => toggleQuestionStatus(question.id, question.active)}
              />
              Active
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
