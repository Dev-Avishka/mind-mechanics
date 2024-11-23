import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Home = () => {
  const router = useRouter();
  const [name, setName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      router.push('/quiz');
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem('userName', name);
    router.push('/quiz');
  };

  return (
    <div>
      <h1>Welcome to the Quiz!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleStart}>Start Quiz</button>
    </div>
  );
};

export default Home;
