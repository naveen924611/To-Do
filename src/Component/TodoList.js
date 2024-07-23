import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import useSound from 'use-sound';
import addSound from './S3.mp3';
import completeSound from './S4.mp3';
import editSound from './S2.mp3';
import undoSound from './S1.mp3';
import deleteSound from './S1.mp3';
// import Meteor from './Meteor';

export default function TodoList(props) {
  const [elements, setElements] = useState([]);
  const [completedElements, setCompletedElements] = useState([]);
  const [showInputBar, setShowInputBar] = useState(false);
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const controls = useAnimation();
  const inputBarControls = useAnimation();

  const [playAddSound] = useSound(addSound);
  const [playCompleteSound] = useSound(completeSound);
  const [playEditSound] = useSound(editSound);
  const [playUndoSound] = useSound(undoSound);
  const [playDeletesound] = useSound(deleteSound);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  const handleClick = () => {
    setShowInputBar(true);
    inputBarControls.start({
      opacity: 1,
      y: 0,
      transform:' translateX(-50%)',
      transition: { duration: 0.8, ease: "easeOut" }
    });
    setErrorMessage("");
  };

  const addTask = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (task.trim() === "") {
      setErrorMessage("Task is required.");
      clearErrorMessageAfterDelay();
      return;
    }
    if (date === "" || date < currentDate) {
      setErrorMessage("Valid date is required.");
      clearErrorMessageAfterDelay();
      return;
    }
    if (time === "" || (date === currentDate && time < currentTime)) {
      setErrorMessage("Valid time is required.");
      clearErrorMessageAfterDelay();
      return;
    }

    const newTask = {
      task,
      date,
      time,
      additionalInfo,
      color
    };

    if (editIndex !== null) {
      const updatedElements = [...elements];
      updatedElements[editIndex] = newTask;
      setElements(updatedElements);
      setEditIndex(null);
    } else {
      setElements([...elements, newTask]);
    }

    playAddSound();
    resetInputs();
  };

  const clearErrorMessageAfterDelay = () => {
    setTimeout(() => {
      setErrorMessage("");
    }, 3000);
  };

  const deleteTask = (index) => {
    const updatedElements = elements.filter((_, i) => i !== index);
    setElements(updatedElements);
    playDeletesound();
  };

  const editTask = (index) => {
    const taskToEdit = elements[index];
    setTask(taskToEdit.task);
    setDate(taskToEdit.date);
    setTime(taskToEdit.time);
    setAdditionalInfo(taskToEdit.additionalInfo);
    setColor(taskToEdit.color);
    setEditIndex(index);
    setShowInputBar(true);
    inputBarControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });

    playEditSound();
  };

  const handleHoverStart = (index) => {
    setExpandedIndex(index);
  };

  const handleHoverEnd = () => {
    setExpandedIndex(null);
  };

  const cancel = () => {
    resetInputs();
  };

  const resetInputs = () => {
    setShowInputBar(false);
    setTask("");
    setDate("");
    setTime("");
    setAdditionalInfo("");
    setColor("#ffffff");
    setEditIndex(null);
    setErrorMessage("");
  };

  const markTaskAsDone = (index) => {
    const doneTask = elements[index];
    const updatedElements = elements.filter((_, i) => i !== index);
    setElements(updatedElements);
    setCompletedElements([...completedElements, doneTask]);

    playCompleteSound();
  };

  const undoTask = (index) => {
    const taskToUndo = completedElements[index];
    const updatedCompletedElements = completedElements.filter((_, i) => i !== index);
    setCompletedElements(updatedCompletedElements);
    setElements([...elements, taskToUndo]);

    playUndoSound();
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container">
      <motion.div
        className="sidebar"
        initial={{ opacity: 0, y: 4 }}
        animate={controls}
      >
        {/* <Meteor/> */}
        {elements.map((element, index) => (
          <motion.div
            key={index}
            className="expandable-container"
            onHoverStart={() => handleHoverStart(index)}
            onHoverEnd={handleHoverEnd}
            initial={{ height: "50px" }}
            animate={{ height: expandedIndex === index ? "auto" : "50px" }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: element.color }}
          >
            <p className="expandable-header" style={{color:'black'}}>Task {index + 1}</p>
            {expandedIndex === index && (
              <div className="expandable-content">
                <p>Todo: {element.task}</p>
                <p>Date: {element.date}</p>
                <p>Time: {element.time}</p>
                {element.additionalInfo && (
                  <a href={element.additionalInfo} rel="noopener noreferrer" target="_blank">
                    Info
                  </a>
                )}
                <div className="button-container">
                  <motion.svg
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    stroke="currentColor"
                    onClick={() => deleteTask(index)}
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    height="1em"
                    width="1em"
                    className="del-icon icon"
                  >
                    <path d="M292.7 840h438.6l24.2-512h-487z" />
                    <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z" />
                  </motion.svg>
                  <motion.svg
                    whileHover={{ scale: 1.5 }}
                    whileTap={{ scale: 0.9 }}
                    stroke="currentColor"
                    onClick={() => editTask(index)}
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    className='edit-icon icon'
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </motion.svg>
                  <motion.svg
                    className="done-icon icon"
                    stroke="currentColor"
                    whileHover={{ scale: 1.5 }}
                    onClick={() => markTaskAsDone(index)}
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em" {...props}
                  >
                    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </motion.svg>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="completed-tasks"
        initial={{ opacity: 0, y: 6 }}
        animate={controls}
      >
        <h3>Completed Tasks</h3>
        {completedElements.map((element, index) => (
          <motion.div
            key={index}
            className="expandable-container"
            initial={{ height: "50px" }}
            animate={{ height: expandedIndex === `completed-${index}` ? "auto" : "50px" }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setExpandedIndex(`completed-${index}`)}
            onMouseLeave={() => setExpandedIndex(null)}
            style={{ backgroundColor: element.color }}
          >
            <p className="expandable-header">Completed Task {index + 1}</p>
            {expandedIndex === `completed-${index}` && (
              <div className="expandable-content">
                <p>Todo: {element.task}</p>
                <p>Date: {element.date}</p>
                <p>Time: {element.time}</p>
                {element.additionalInfo && (
                  <a href={element.additionalInfo} rel="noopener noreferrer" target="_blank">
                    Info
                  </a>
                )}
                <div className="button-container">
                  <button onClick={() => undoTask(index)}>Undo</button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
      {showInputBar && (
        <motion.div
          className="input-bar"
          style={{color: 'black'}}
          // initial={{ opacity: 0,y:0 }}
          // animate={inputBarControls}
        >
          <input
            className="input"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task"
          />
          <input
            className="input"
            type="date"
            value={date}
            min={getCurrentDate()}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="input"
            type="time"
            value={time}
            min={getCurrentTime()}
            onChange={(e) => setTime(e.target.value)}
          />
          <input
            className="input"
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Links you want to add"
          />
          <br />
          {/* <label htmlFor="input">
            <span>Choose the color: </span>
          <input
            className="input color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Choose a color "
          /></label> */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="btns">
            <button className="btn btn-add" onClick={addTask}>
              {editIndex !== null ? "Update Task" : "Add Task"}
            </button>
            <button className="btn btn-cancel" onClick={cancel}>Cancel</button>
          </div>
        </motion.div>
      )}
      
      <motion.div
        className="todo-list"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        // onMouseEnter={}
        onClick={handleClick}
        initial={{ opacity: 0, y: 5 }}
        animate={controls}
      >
        <p style={{color:'black'}}>+</p>
      </motion.div>
    </div>
  );
}
