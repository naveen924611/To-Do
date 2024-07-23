import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './Component/TodoList';
import { motion ,useAnimation } from 'framer-motion';


function App() {
  const [characters, setCharacters] = useState(['>', '-']);
  const [currentCharacter, setCurrentCharacter] = useState(characters[0]);
  const [dateTime, setDateTime] = useState(new Date());
  const [backgroundClass, setBackgroundClass] = useState('am-background');
  const [show,setshow] = useState(true);
  const [fly, setFly] = useState(false);
  const [fontc, setfontc] = useState(true);
  const control = useAnimation();
  
  useEffect(() => {
    control.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [control]);

  useEffect(() => {
    const charInterval = setInterval(() => {
      setCharacters((prevCharacters) => {
        const rotated = [...prevCharacters.slice(1), prevCharacters[0]];
        return rotated;
      });
    }, 500);

    return () => clearInterval(charInterval);
  }, []);

  useEffect(() => {
    setCurrentCharacter(characters[0]);
  }, [characters]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function updateFlyDistance() {
      const root = document.documentElement;
      const flyDistance = window.innerWidth - 10 + 'px';
      root.style.setProperty('--fly-distance', flyDistance);
    }

    window.addEventListener('resize', updateFlyDistance);
    updateFlyDistance(); // Initial call

    return () => window.removeEventListener('resize', updateFlyDistance);
  }, []);

  useEffect(() => {
    const hour = dateTime.getHours();
    if (hour >= 18) {
      setshow(false);
      setFly(true);
      setfontc(true);
      setBackgroundClass('pm');
    
    } else {
      setshow(true);
      setFly(false);
      setfontc(false);
      setBackgroundClass('am');
    }
  }, [dateTime]);
  const f = {
    // fontSize: fontc? '2em' : '1.5em',
    // fontWeight: fontc? 'bold' : 'normal',
    color: fontc? 'white' : 'black',
    // textShadow: fontc? '2px 2px 4px rgba(0,0,0,0.5)' : 'none',
  }

  return (
    <div className={`App ${backgroundClass}`}>
      {show && <div className="birds">
        {[...Array(14).keys()].map((i) => (
          <p key={i} className={`p b${i + 1}`}>{currentCharacter} </p>
        ))}
      </div>}
      { fly &&
      <div>
      <div className="meteor"></div>
      <div className="meteor2"></div>
      </div>}
      <motion.div className="Time"
         initial={{ opacity: 0, y: 10 }}
         animate={control}>
        <p className="T" style={f}>{dateTime.toLocaleTimeString()}</p>
        <p className="D" style={f}>{dateTime.toLocaleDateString()}</p>
      </motion.div>
      <TodoList time={dateTime.toLocaleTimeString()}  date={dateTime.toLocaleDateString()} />
    </div>
  );
}

export default App;
