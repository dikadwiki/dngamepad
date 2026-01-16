import { useState, useEffect, useCallback } from 'react'
import GamepadDisplay from './GamepadDisplay'
import GamepadVisual from './GamepadVisual'
import JoystickDisplay from './JoystickDisplay'
import VibrationControl from './VibrationControl'
import './GamepadTester.css'

function GamepadTester() {
  const [gamepads, setGamepads] = useState([])
  const [selectedGamepad, setSelectedGamepad] = useState(null)

  const updateGamepads = useCallback(() => {
    const gamepadList = navigator.getGamepads()
    const connected = Array.from(gamepadList).filter(g => g !== null)
    setGamepads(connected)

    // Auto-select first gamepad if available
    if (connected.length > 0 && !selectedGamepad) {
      setSelectedGamepad(0)
    }
  }, [selectedGamepad])

  useEffect(() => {
    // Check for initial gamepads
    updateGamepads()

    // Listen for gamepad connected/disconnected
    const handleGamepadConnected = (e) => {
      console.log('Gamepad connected:', e.gamepad)
      updateGamepads()
    }

    const handleGamepadDisconnected = (e) => {
      console.log('Gamepad disconnected:', e.gamepad)
      updateGamepads()
      if (selectedGamepad !== null) {
        setSelectedGamepad(null)
      }
    }

    window.addEventListener('gamepadconnected', handleGamepadConnected)
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected)

    // Poll for gamepad updates
    let animationFrame
    const pollGamepads = () => {
      updateGamepads()
      animationFrame = requestAnimationFrame(pollGamepads)
    }
    animationFrame = requestAnimationFrame(pollGamepads)

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected)
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected)
      cancelAnimationFrame(animationFrame)
    }
  }, [updateGamepads, selectedGamepad])

  const currentGamepad = selectedGamepad !== null && gamepads[selectedGamepad]
    ? gamepads[selectedGamepad]
    : null

  return (
    <div className="gamepad-tester">
      {gamepads.length === 0 ? (
        <div className="no-gamepad">
          <div className="no-gamepad-icon">🎮</div>
          <h2>Hubungkan Gamepad Anda</h2>
          <p>Hubungkan gamepad dan tekan tombol untuk memulai...</p>
          <div className="info-box">
            <h3>Tentang Gamepad Tester</h3>
            <p>
              Tool ini menampilkan status gamepad Anda, input button, joystick,
              dan fitur lainnya yang dapat dilaporkan oleh HTML5 Gamepad API.
              Tool ini juga menyediakan kontrol vibration dan berguna untuk
              debugging drifting joycon, controller rusak, hardware eksperimental, dan lainnya.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="gamepad-selector">
            <h3>Gamepad Terhubung:</h3>
            {gamepads.map((gamepad, index) => (
              <button
                key={gamepad.index}
                className={`gamepad-button ${selectedGamepad === index ? 'active' : ''}`}
                onClick={() => setSelectedGamepad(index)}
              >
                {gamepad.id || `Gamepad ${index + 1}`}
              </button>
            ))}
          </div>

          {currentGamepad && (
            <div className="gamepad-info">
              <GamepadDisplay gamepad={currentGamepad} />
              <GamepadVisual gamepad={currentGamepad} />
              <div className="joysticks-section">
                <h3>Joystick Analysis</h3>
                <JoystickDisplay gamepad={currentGamepad} />
              </div>
              <div className="vibration-section">
                <h3>Vibration</h3>
                <VibrationControl gamepad={currentGamepad} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default GamepadTester

