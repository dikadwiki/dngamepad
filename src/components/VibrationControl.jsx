import { useState, useEffect } from 'react'
import './VibrationControl.css'

function VibrationControl({ gamepad }) {
  const [isSupported, setIsSupported] = useState(false)
  const [intensity, setIntensity] = useState(0.5)
  const [duration, setDuration] = useState(100)

  useEffect(() => {
    if (gamepad && 'vibrationActuator' in gamepad) {
      setIsSupported(true)
    } else {
      setIsSupported(false)
    }
  }, [gamepad])

  const testVibration = async () => {
    if (!gamepad || !isSupported) return

    // Get fresh gamepad reference to avoid stale state
    const gamepads = navigator.getGamepads()
    const currentGamepad = gamepads[gamepad.index]

    if (!currentGamepad) return

    const actuator = currentGamepad.vibrationActuator
    if (actuator && actuator.playEffect) {
      try {
        // Stop any existing vibration first
        await actuator.reset()

        // Start new vibration
        await actuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration: duration,
          weakMagnitude: intensity,
          strongMagnitude: intensity
        })
      } catch (error) {
        console.error('Vibration error:', error)
      }
    } else if ('vibrate' in currentGamepad) {
      // Fallback for older API
      currentGamepad.vibrate([intensity * 100, duration])
    }
  }

  if (!isSupported) {
    return (
      <div className="vibration-control unsupported">
        <p>Vibration tidak didukung oleh gamepad ini</p>
      </div>
    )
  }

  return (
    <div className="vibration-control">
      <div className="vibration-controls">
        <div className="control-group">
          <label htmlFor="intensity">Intensity: {(intensity * 100).toFixed(0)}%</label>
          <input
            id="intensity"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
          />
        </div>
        <div className="control-group">
          <label htmlFor="duration">Duration: {duration}ms</label>
          <input
            id="duration"
            type="range"
            min="0"
            max="1000"
            step="10"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
          />
        </div>
        <button onClick={testVibration} className="vibrate-button">
          Test Vibration
        </button>
      </div>
    </div>
  )
}

export default VibrationControl

