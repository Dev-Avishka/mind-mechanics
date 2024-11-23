import { useEffect, useState } from 'react';
import styles from './QuizPage.module.css';

interface Question {
  id: string;
  question: string;
  incorrect_answers: string[];
  correct_answer: string;
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [userName, setUserName] = useState<string>('Guest');

  useEffect(() => {
    loadQuizData();
  }, []);

  const loadQuizData = () => {
    const storedAnswers = JSON.parse(localStorage.getItem('answeredQuestions') || '[]');
    const storedUserName = localStorage.getItem('userName') || 'Guest';
    setAnsweredQuestions(storedAnswers);
    setUserName(storedUserName);

    fetch('/api/getQuestions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const unansweredQuestions = data.filter((q) => !storedAnswers.includes(q.id));
          setQuestions(unansweredQuestions);
          if (unansweredQuestions.length > 0) {
            setCurrentQuestion(unansweredQuestions[0]);
          } else {
            setMessage('Wait till we add a new question');
          }
        }
      })
      .catch((error) => console.error("Failed to load questions:", error));
  };

  const handleRefresh = () => {
``

    setMessage('');
    setCurrentQuestion(null);
    loadQuizData();
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || answeredQuestions.includes(currentQuestion.id)) return;

    const isCorrect = answer === currentQuestion.correct_answer;
    const updatedAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
    localStorage.setItem('answeredQuestions', JSON.stringify(updatedAnsweredQuestions));
    setAnsweredQuestions(updatedAnsweredQuestions);

    setMessage(isCorrect ? 'You are right!' : 'You are wrong!');

    if (isCorrect) {
      fetch('/api/addScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, score: 1 }),
      }).catch((error) => console.error("Failed to update score:", error));
    }

    const nextQuestion = questions.find((q) => !updatedAnsweredQuestions.includes(q.id));
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      setMessage('');
    } else {
      setCurrentQuestion(null);
      setMessage('Wait till we add a new question');
    }
  };

  const isAnswered = currentQuestion ? answeredQuestions.includes(currentQuestion.id) : false;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Quiz</h1>
      <button onClick={handleRefresh} className={styles.refreshButton}>Refresh Quiz</button>
      {currentQuestion ? (
        <div>
          <h2 className={styles.question}>{currentQuestion.question}</h2>
          <div className={styles.buttons}>
            {[...currentQuestion.incorrect_answers, currentQuestion.correct_answer]
              .sort()
              .map((answer, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswer(answer)} 
                  disabled={isAnswered} 
                  className={styles.button}
                >
                  {answer}
                </button>
              ))}
          </div>
          {message && <div className={styles.message}>{message}</div>}
          {isAnswered && <div className={styles.answeredMessage}>You have already answered this question.</div>}
        </div>
      ) : (
        <div className={styles.message}>{message}</div>
      )}
    </div>
  );
}
