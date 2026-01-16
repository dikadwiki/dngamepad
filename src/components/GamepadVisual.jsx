import { useState, useEffect } from 'react'
import './GamepadVisual.css'

function GamepadVisual({ gamepad }) {
    const [buttons, setButtons] = useState([])
    const [axes, setAxes] = useState([])

    useEffect(() => {
        if (!gamepad) return

        const updateState = () => {
            const updatedButtons = Array.from(gamepad.buttons).map((button) => ({
                pressed: button.pressed,
                value: button.value
            }))
            setButtons(updatedButtons)
            setAxes([...gamepad.axes])
        }

        const interval = setInterval(updateState, 16) // ~60fps
        updateState()

        return () => clearInterval(interval)
    }, [gamepad])

    // Calculate stick positions
    const getStickPosition = (xAxis, yAxis) => {
        const x = xAxis ?? 0
        const y = yAxis ?? 0
        const deadzone = 0.1

        const normalizeValue = (val) => {
            if (Math.abs(val) < deadzone) return 0
            return Math.max(-1, Math.min(1, val))
        }

        return {
            x: normalizeValue(x) * 15, // 15px max movement
            y: normalizeValue(y) * 15
        }
    }

    const leftStick = getStickPosition(axes[0], axes[1])
    const rightStick = getStickPosition(axes[2], axes[3])

    const isPressed = (index) => buttons[index]?.pressed || false
    const getPressure = (index) => buttons[index]?.value || 0

    return (
        <div className="gamepad-visual">
            <svg viewBox="0 0 800 400" className="gamepad-svg">
                {/* Main Controller Body */}
                <path
                    d="M 250 100 Q 200 80 150 120 L 120 200 Q 110 250 150 280 L 250 300 L 300 320 L 500 320 L 550 300 L 650 280 Q 690 250 680 200 L 650 120 Q 600 80 550 100 L 400 80 Z"
                    fill="#2a2a3e"
                    stroke="#444"
                    strokeWidth="3"
                />

                {/* Grips Shadow */}
                <ellipse cx="200" cy="280" rx="60" ry="40" fill="#1a1a2e" opacity="0.5" />
                <ellipse cx="600" cy="280" rx="60" ry="40" fill="#1a1a2e" opacity="0.5" />

                {/* Left Shoulder Button (LB) */}
                <rect
                    x="180"
                    y="85"
                    width="80"
                    height="25"
                    rx="12"
                    fill={isPressed(4) ? '#4CAF50' : '#3a3a4e'}
                    stroke={isPressed(4) ? '#66BB6A' : '#555'}
                    strokeWidth="2"
                />
                <text x="220" y="102" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">LB</text>

                {/* Left Trigger (LT) */}
                <rect
                    x="180"
                    y="60"
                    width="80"
                    height="20"
                    rx="10"
                    fill={isPressed(6) ? '#4CAF50' : '#2a2a3e'}
                    stroke={isPressed(6) ? '#66BB6A' : '#444'}
                    strokeWidth="2"
                    opacity={0.3 + getPressure(6) * 0.7}
                />
                <text x="220" y="74" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">LT</text>

                {/* Right Shoulder Button (RB) */}
                <rect
                    x="540"
                    y="85"
                    width="80"
                    height="25"
                    rx="12"
                    fill={isPressed(5) ? '#4CAF50' : '#3a3a4e'}
                    stroke={isPressed(5) ? '#66BB6A' : '#555'}
                    strokeWidth="2"
                />
                <text x="580" y="102" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">RB</text>

                {/* Right Trigger (RT) */}
                <rect
                    x="540"
                    y="60"
                    width="80"
                    height="20"
                    rx="10"
                    fill={isPressed(7) ? '#4CAF50' : '#2a2a3e'}
                    stroke={isPressed(7) ? '#66BB6A' : '#444'}
                    strokeWidth="2"
                    opacity={0.3 + getPressure(7) * 0.7}
                />
                <text x="580" y="74" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">RT</text>

                {/* D-Pad */}
                <g transform="translate(220, 180)">
                    {/* D-Pad Background */}
                    <circle cx="0" cy="0" r="45" fill="#1a1a2e" />

                    {/* D-Up */}
                    <path
                        d="M -15 -20 L -15 -40 L 15 -40 L 15 -20 Z"
                        fill={isPressed(12) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(12) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />

                    {/* D-Down */}
                    <path
                        d="M -15 20 L -15 40 L 15 40 L 15 20 Z"
                        fill={isPressed(13) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(13) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />

                    {/* D-Left */}
                    <path
                        d="M -20 -15 L -40 -15 L -40 15 L -20 15 Z"
                        fill={isPressed(14) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(14) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />

                    {/* D-Right */}
                    <path
                        d="M 20 -15 L 40 -15 L 40 15 L 20 15 Z"
                        fill={isPressed(15) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(15) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />

                    {/* D-Pad Center */}
                    <circle cx="0" cy="0" r="12" fill="#2a2a3e" />
                </g>

                {/* Face Buttons (ABXY) */}
                <g transform="translate(580, 180)">
                    {/* Y (Top) - Yellow */}
                    <circle
                        cx="0"
                        cy="-35"
                        r="18"
                        fill={isPressed(3) ? '#FDD835' : '#3a3a4e'}
                        stroke={isPressed(3) ? '#FBC02D' : '#555'}
                        strokeWidth="2"
                    />
                    <text x="0" y="-30" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">Y</text>

                    {/* B (Right) - Red */}
                    <circle
                        cx="35"
                        cy="0"
                        r="18"
                        fill={isPressed(1) ? '#E53935' : '#3a3a4e'}
                        stroke={isPressed(1) ? '#C62828' : '#555'}
                        strokeWidth="2"
                    />
                    <text x="35" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">B</text>

                    {/* A (Bottom) - Green */}
                    <circle
                        cx="0"
                        cy="35"
                        r="18"
                        fill={isPressed(0) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(0) ? '#388E3C' : '#555'}
                        strokeWidth="2"
                    />
                    <text x="0" y="40" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">A</text>

                    {/* X (Left) - Blue */}
                    <circle
                        cx="-35"
                        cy="0"
                        r="18"
                        fill={isPressed(2) ? '#42A5F5' : '#3a3a4e'}
                        stroke={isPressed(2) ? '#1976D2' : '#555'}
                        strokeWidth="2"
                    />
                    <text x="-35" y="5" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">X</text>
                </g>

                {/* Center Buttons */}
                {/* Back/Select */}
                <circle
                    cx="340"
                    cy="150"
                    r="12"
                    fill={isPressed(8) ? '#4CAF50' : '#3a3a4e'}
                    stroke={isPressed(8) ? '#66BB6A' : '#555'}
                    strokeWidth="2"
                />
                <text x="340" y="155" textAnchor="middle" fill="#fff" fontSize="10">⊟</text>

                {/* Home/Guide */}
                <circle
                    cx="400"
                    cy="140"
                    r="15"
                    fill={isPressed(16) ? '#4CAF50' : '#2a2a3e'}
                    stroke={isPressed(16) ? '#66BB6A' : '#444'}
                    strokeWidth="2"
                />
                <text x="400" y="146" textAnchor="middle" fill="#fff" fontSize="12">⌂</text>

                {/* Start */}
                <circle
                    cx="460"
                    cy="150"
                    r="12"
                    fill={isPressed(9) ? '#4CAF50' : '#3a3a4e'}
                    stroke={isPressed(9) ? '#66BB6A' : '#555'}
                    strokeWidth="2"
                />
                <text x="460" y="155" textAnchor="middle" fill="#fff" fontSize="10">☰</text>

                {/* Left Analog Stick */}
                <g transform="translate(280, 240)">
                    <circle cx="0" cy="0" r="40" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
                    <line x1="-40" y1="0" x2="40" y2="0" stroke="#444" strokeWidth="1" />
                    <line x1="0" y1="-40" x2="0" y2="40" stroke="#444" strokeWidth="1" />
                    <circle
                        cx={leftStick.x}
                        cy={leftStick.y}
                        r="20"
                        fill={isPressed(10) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(10) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />
                    <text x={leftStick.x} y={leftStick.y + 5} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">L</text>
                </g>

                {/* Right Analog Stick */}
                <g transform="translate(480, 240)">
                    <circle cx="0" cy="0" r="40" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
                    <line x1="-40" y1="0" x2="40" y2="0" stroke="#444" strokeWidth="1" />
                    <line x1="0" y1="-40" x2="0" y2="40" stroke="#444" strokeWidth="1" />
                    <circle
                        cx={rightStick.x}
                        cy={rightStick.y}
                        r="20"
                        fill={isPressed(11) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(11) ? '#66BB6A' : '#555'}
                        strokeWidth="2"
                    />
                    <text x={rightStick.x} y={rightStick.y + 5} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">R</text>
                </g>

                {/* Share Button (if exists) */}
                {buttons.length > 17 && (
                    <circle
                        cx="320"
                        cy="120"
                        r="8"
                        fill={isPressed(17) ? '#4CAF50' : '#3a3a4e'}
                        stroke={isPressed(17) ? '#66BB6A' : '#555'}
                        strokeWidth="1"
                    />
                )}
            </svg>

            {/* Axis Values Display */}
            <div className="axis-info">
                <div className="axis-group">
                    <strong>Left Stick:</strong> X: {(axes[0] ?? 0).toFixed(2)}, Y: {(axes[1] ?? 0).toFixed(2)}
                </div>
                <div className="axis-group">
                    <strong>Right Stick:</strong> X: {(axes[2] ?? 0).toFixed(2)}, Y: {(axes[3] ?? 0).toFixed(2)}
                </div>
            </div>
        </div>
    )
}

export default GamepadVisual
