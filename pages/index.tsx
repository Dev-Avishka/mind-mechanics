import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Home.module.css';

const Home = () => {
  const router = useRouter();
  const [name, setName] = useState('');

  const message = "Start Quiz >"
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
    <div className={styles.container}>
      <h1 className={styles.heading}>Welcome to the Quiz!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={styles.input}
      />
      <button
        onClick={handleStart}
        className={styles.button}
        disabled={!name.trim()} 
      >
       {message}
      </button>
    </div>
  );
};

export default Home;
