import { useState, useEffect } from 'react'
import './ButtonGrid.css'

function ButtonGrid({ gamepad }) {
  const [buttons, setButtons] = useState([])

  useEffect(() => {
    if (!gamepad) return

    const updateButtons = () => {
      const updatedButtons = Array.from(gamepad.buttons).map((button, index) => ({
        index,
        pressed: button.pressed,
        touched: button.touched,
        value: button.value
      }))
      setButtons(updatedButtons)
    }

    const interval = setInterval(updateButtons, 16) // ~60fps
    updateButtons()

    return () => clearInterval(interval)
  }, [gamepad])

  // Button labels for standard gamepad
  const buttonLabels = [
    'A', 'B', 'X', 'Y',
    'LB', 'RB', 'LT', 'RT',
    'Back', 'Start',
    'LS', 'RS',
    'D-Up', 'D-Down', 'D-Left', 'D-Right',
    'Home', 'Share'
  ]

  // Button mapping for gamepad layout
  const buttonLayout = {
    // Face buttons (right side - diamond formation)
    faceButtons: [0, 1, 2, 3], // A, B, X, Y
    // D-pad (left side)
    dpad: [12, 13, 14, 15], // Up, Down, Left, Right
    // Shoulder buttons (top)
    shoulders: [4, 5, 6, 7], // LB, RB, LT, RT
    // Center buttons
    center: [8, 9, 16, 17], // Back, Start, Home, Share
    // Stick buttons
    sticks: [10, 11] // LS, RS
  }

  const renderButton = (index) => {
    const button = buttons[index]
    if (!button) return null

    return (
      <div
        key={index}
        className={`gamepad-button ${button.pressed ? 'pressed' : ''} ${button.touched && !button.pressed ? 'touched' : ''}`}
        style={{
          '--pressure': button.value
        }}
      >
        <div className="button-inner">
          <div className="button-label">{buttonLabels[index] || `${index}`}</div>
          <div className="button-pressure">{(button.value * 100).toFixed(0)}%</div>
        </div>
      </div>
    )
  }

  return (
    <div className="button-grid">
      <div className="gamepad-layout">
        {/* Shoulder Buttons */}
        <div className="shoulder-section">
          <div className="shoulder-left">
            {renderButton(6)} {/* LT */}
            {renderButton(4)} {/* LB */}
          </div>
          <div className="shoulder-right">
            {renderButton(7)} {/* RT */}
            {renderButton(5)} {/* RB */}
          </div>
        </div>

        {/* Main Body */}
        <div className="gamepad-body">
          {/* Left Side - D-Pad */}
          <div className="left-section">
            <div className="dpad">
              <div className="dpad-up">{renderButton(12)}</div>
              <div className="dpad-middle">
                <div className="dpad-left">{renderButton(14)}</div>
                <div className="dpad-center"></div>
                <div className="dpad-right">{renderButton(15)}</div>
              </div>
              <div className="dpad-down">{renderButton(13)}</div>
            </div>
            <div className="stick-button">{renderButton(10)}</div>
          </div>

          {/* Center - Logo/Menu Buttons */}
          <div className="center-section">
            {renderButton(8)} {/* Back */}
            {renderButton(16)} {/* Home */}
            {renderButton(9)} {/* Start */}
          </div>

          {/* Right Side - Face Buttons */}
          <div className="right-section">
            <div className="face-buttons">
              <div className="face-up">{renderButton(3)}</div> {/* Y */}
              <div className="face-middle">
                <div className="face-left">{renderButton(2)}</div> {/* X */}
                <div className="face-center"></div>
                <div className="face-right">{renderButton(1)}</div> {/* B */}
              </div>
              <div className="face-down">{renderButton(0)}</div> {/* A */}
            </div>
            <div className="stick-button">{renderButton(11)}</div>
          </div>
        </div>

        {/* Extra Buttons */}
        {buttons.length > 18 && (
          <div className="extra-buttons">
            {buttons.slice(18).map((button, idx) => renderButton(18 + idx))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ButtonGrid

