import { useState, useEffect } from 'react'
import './JoystickDisplay.css'

function JoystickDisplay({ gamepad }) {
  const [axes, setAxes] = useState([])
  const [leftStickError, setLeftStickError] = useState({ avg: 0, samples: 0 })
  const [rightStickError, setRightStickError] = useState({ avg: 0, samples: 0 })

  useEffect(() => {
    if (!gamepad) return

    let animationFrameId

    const updateAxes = () => {
      // Read gamepad data directly from navigator for real-time updates
      const gamepads = navigator.getGamepads()
      const currentGamepad = gamepads[gamepad.index]
      
      if (currentGamepad) {
        setAxes([...currentGamepad.axes])
      }
      
      // Schedule next update synchronized with browser refresh rate
      animationFrameId = requestAnimationFrame(updateAxes)
    }

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateAxes)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [gamepad])

  // Calculate circularity error
  const calculateCircularityError = (x, y) => {
    const deadzone = 0.1

    // Ignore values in deadzone
    if (Math.abs(x) < deadzone && Math.abs(y) < deadzone) {
      return null
    }

    // Calculate actual distance from center
    const actualDistance = Math.sqrt(x * x + y * y)

    // Only measure circularity when stick is pushed beyond 80% to avoid false errors
    // When stick is partially pushed, we don't expect it to be at radius 1.0
    if (actualDistance < 0.8) {
      return null
    }

    // For a perfect circle, when moving the stick at full extension,
    // the distance should be consistent and close to 1.0
    // Error is the deviation from the expected radius
    const expectedDistance = 1.0
    const error = Math.abs(actualDistance - expectedDistance)

    return error
  }

  // Update circularity stats
  useEffect(() => {
    if (axes.length < 2) return

    // Left stick (axes 0, 1)
    const leftError = calculateCircularityError(axes[0], axes[1])
    if (leftError !== null) {
      setLeftStickError(prev => {
        const newSamples = prev.samples + 1
        const newAvg = (prev.avg * prev.samples + leftError) / newSamples
        return { avg: newAvg, samples: Math.min(newSamples, 1000) } // Cap at 1000 samples
      })
    }

    // Right stick (axes 2, 3)
    if (axes.length >= 4) {
      const rightError = calculateCircularityError(axes[2], axes[3])
      if (rightError !== null) {
        setRightStickError(prev => {
          const newSamples = prev.samples + 1
          const newAvg = (prev.avg * prev.samples + rightError) / newSamples
          return { avg: newAvg, samples: Math.min(newSamples, 1000) }
        })
      }
    }
  }, [axes])

  const resetCircularityTest = (stick) => {
    if (stick === 'left') {
      setLeftStickError({ avg: 0, samples: 0 })
    } else {
      setRightStickError({ avg: 0, samples: 0 })
    }
  }

  const getCircularityQuality = (avgError) => {
    if (avgError < 0.05) return { text: 'Excellent', color: '#4CAF50' }
    if (avgError < 0.10) return { text: 'Good', color: '#8BC34A' }
    if (avgError < 0.15) return { text: 'Fair', color: '#FFC107' }
    if (avgError < 0.20) return { text: 'Poor', color: '#FF9800' }
    return { text: 'Very Poor', color: '#F44336' }
  }

  const renderJoystick = (xValue, yValue, index, label) => {
    const stickSize = 200
    const stickRadius = 15
    const activeThreshold = 0.05 // Small threshold for "active" visual state

    // Handle undefined/null values
    const xVal = xValue ?? 0
    const yVal = yValue ?? 0

    // No deadzone for visual display - show raw movement
    const clamp = (value) => {
      if (value === undefined || value === null) return 0
      return Math.max(-1, Math.min(1, value))
    }

    const nX = clamp(xVal)
    const nY = clamp(yVal)

    const centerX = stickSize / 2
    const centerY = stickSize / 2
    const maxDistance = stickSize / 2 - stickRadius - 5

    const x = centerX + (nX * maxDistance)
    const y = centerY + (nY * maxDistance) // Direct mapping - positive Y is down, negative Y is up

    const isActive = Math.abs(nX) > activeThreshold || Math.abs(nY) > activeThreshold

    // Get circularity stats for this stick
    const stickError = index === 0 ? leftStickError : rightStickError
    const quality = getCircularityQuality(stickError.avg)

    return (
      <div key={index} className="joystick-container">
        <h4>{label}</h4>
        <div className="joystick-visualization" style={{ width: stickSize, height: stickSize }}>
          <svg width={stickSize} height={stickSize} className="joystick-svg">
            <circle
              cx={centerX}
              cy={centerY}
              r={stickSize / 2 - 2}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            <line
              x1={centerX}
              y1={0}
              x2={centerX}
              y2={stickSize}
              stroke="#444"
              strokeWidth="1"
            />
            <line
              x1={0}
              y1={centerY}
              x2={stickSize}
              y2={centerY}
              stroke="#444"
              strokeWidth="1"
            />
            <circle
              cx={x}
              cy={y}
              r={stickRadius}
              fill={isActive ? '#4CAF50' : '#888'}
              className="joystick-stick"
            />
          </svg>
        </div>
        <div className="joystick-values">
          <div className="axis-value">
            <span>X: {xVal.toFixed(3)}</span>
          </div>
          <div className="axis-value">
            <span>Y: {yVal.toFixed(3)}</span>
          </div>
        </div>

        {/* Circularity Test Display */}
        <div className="circularity-test">
          <h5>Circularity Test</h5>
          <div className="circularity-stats">
            <div className="stat-item">
              <label>Avg Error:</label>
              <span className="error-value">{(stickError.avg * 100).toFixed(2)}%</span>
            </div>
            <div className="stat-item">
              <label>Quality:</label>
              <span className="quality-badge" style={{ backgroundColor: quality.color }}>
                {quality.text}
              </span>
            </div>
            <div className="stat-item">
              <label>Samples:</label>
              <span>{stickError.samples}</span>
            </div>
          </div>
          <button
            className="reset-button"
            onClick={() => resetCircularityTest(index === 0 ? 'left' : 'right')}
          >
            Reset Test
          </button>
          <p className="test-instruction">
            Rotate the stick in a full circle to test circularity
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="joystick-display">
      {axes.length >= 2 && renderJoystick(axes[0], axes[1], 0, 'Left Stick')}
      {axes.length >= 4 && renderJoystick(axes[2], axes[3], 1, 'Right Stick')}
      {axes.length < 2 && (
        <div className="no-joysticks">No joysticks detected</div>
      )}
    </div>
  )
}

export default JoystickDisplay

