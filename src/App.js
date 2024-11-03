import React, { useState, useEffect } from 'react';
import './styles/global.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';

const sillyTasks = [
  "Stare out the window for 3 minutes! 👀",
  "Do 5 jumping jacks! 🏃",
  "Do a boyfriend prank on your best friend 🎶",
  "Dance like nobody's watching! 💃🕺",
  "Pretend to be Vicky and do the tauba tauba trend 🦸",
  "Draw a quick doodle of your pet! 🐶🐱",
  "Try speaking in a British accent for a minute! 😂",
  "Count backwards from 20 to 1 out loud! 🔢",
  "Stand on one leg for 10 seconds! 🦶",
  "Tell yourself a joke and laugh! 🤣",
  "Look out of the window and describe what you see! 👀"
];

function App() {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTaskRunning, setIsTaskRunning] = useState(false);
  const [isSillyTaskActive, setIsSillyTaskActive] = useState(false);
  const [currentSillyTask, setCurrentSillyTask] = useState('');
  const [colors, setColors] = useState({
    primary: '#007acc',
    secondary: '#4CAF50',
    danger: '#ff6666',
    accent: '#007BFF',
    background: '#f0f8ff'
  });
  const [isFormAnimating, setIsFormAnimating] = useState(false);

  const SILLY_TASK_DURATION = 10;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value); // Fixed the template string
    });
  }, [colors]);

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskDescription && taskTime) {
      setIsFormAnimating(true);
      setTasks([...tasks, { description: taskDescription, time: taskTime }]);
      setTaskDescription('');
      setTaskTime('');
      
      setTimeout(() => setIsFormAnimating(false), 500);

      toast.success("Task added successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: 'toast-success-custom'
      });
    }
  };

  const startInfiniteTask = () => {
    if (tasks.length === 0 || isTaskRunning) return;
    
    const button = document.querySelector('.infinite-task-button');
    button.classList.add('button-pressed');
    setTimeout(() => button.classList.remove('button-pressed'), 200);

    setIsTaskRunning(true);
    setCurrentTaskIndex(0);
    startProductiveTaskTimer(tasks[0].time);

    toast.info("Starting your productive journey! 🚀", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  const startProductiveTaskTimer = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalTimeInSeconds = hours * 3600 + minutes * 60;
    setTimeRemaining(totalTimeInSeconds);
    setIsSillyTaskActive(false);
  };

  const startSillyTaskTimer = () => {
    const randomSillyTask = sillyTasks[Math.floor(Math.random() * sillyTasks.length)];
    setCurrentSillyTask(randomSillyTask);
    setTimeRemaining(SILLY_TASK_DURATION);
    setIsSillyTaskActive(true);

    const timerDisplay = document.querySelector('.timer-display');
    timerDisplay.classList.add('silly-task-active');
    setTimeout(() => timerDisplay.classList.remove('silly-task-active'), 500);
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          handleTimerEnd();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeRemaining]);

  const handleTimerEnd = () => {
    if (isSillyTaskActive) {
      const nextTaskIndex = (currentTaskIndex + 1) % tasks.length;
      setCurrentTaskIndex(nextTaskIndex);
      startProductiveTaskTimer(tasks[nextTaskIndex].time);
    } else {
      toast("🎉 Task completed successfully!", {
        position: 'top-center',
        autoClose: 3000,
        className: 'toast-silly-custom'
      });
      startSillyTaskTimer();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`; // Fixed the template string
  };

  const handleDeleteTask = (index) => {
    const taskRow = document.querySelector(`tr[data-index="${index}"]`);
    taskRow.classList.add('delete-animation');
    
    setTimeout(() => {
      const updatedTasks = tasks.filter((_, i) => i !== index);
      setTasks(updatedTasks);
      if (currentTaskIndex === index) {
        setCurrentTaskIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 1)); // Adjust index if needed
      }
    }, 300);

    toast.error("Task deleted!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="App">
      <Header />
      <h2 className="centered-text">Your productive/useless journey starts here!</h2>
      
      <form 
        onSubmit={handleTaskSubmit} 
        className={`task-form ${isFormAnimating ? 'form-submit-animation' : ''}`}
      >
        <input
          type="text"
          placeholder="Enter productive task"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
          className="input-3d"
        />
        <input
          type="time"
          value={taskTime}
          onChange={(e) => setTaskTime(e.target.value)}
          required
          className="input-3d"
        />
        <button type="submit" className="button-3d">Add Task</button>
      </form>

      <div className="task-section">
        <h3>Your Tasks:</h3>
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Description</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr 
                key={index} 
                data-index={index}
                className={`task-row ${index === currentTaskIndex && !isSillyTaskActive ? 'highlighted-task' : ''}`}
              >
                <td>{task.description}</td>
                <td>{task.time}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteTask(index)}
                    className="delete-button button-3d"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="center-button">
        <button 
          onClick={startInfiniteTask} 
          className="infinite-task-button button-3d"
          disabled={tasks.length === 0 || isTaskRunning}
        >
          Start Infinite Task
        </button>
      </div>

      {isTaskRunning && (
        <div className={`timer-display ${isSillyTaskActive ? 'silly-mode' : ''}`}>
          <h3>Time Remaining:</h3>
          <p className="time-text">{formatTime(timeRemaining)}</p>
          <p className="task-text">
            Current Task: {isSillyTaskActive ? currentSillyTask : tasks[currentTaskIndex]?.description}
          </p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default App;
