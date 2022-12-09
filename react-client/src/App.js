import logo from './logo.svg';
import './App.css';
import { audiotest } from './audio/AudioHandler';
import { useEffect } from 'react';
import AudioHandler from './audio/AudioHandler';
import ambient from './audio/ambient1.mp3';
import ambient2 from './audio/ambient2.mp3';

function App() {
  let audio = new AudioHandler([ambient, ambient2])
  const button = document.getElementById('start-button')
  document.addEventListener('click', () => {
    audio.playRandom()
    console.log('button clicked')
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
