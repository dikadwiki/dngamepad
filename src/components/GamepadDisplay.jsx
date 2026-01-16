import './GamepadDisplay.css'

function GamepadDisplay({ gamepad }) {
  return (
    <div className="gamepad-display">
      <div className="gamepad-info-card">
        <h3>Gamepad Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <label>ID:</label>
            <span>{gamepad.id || 'Unknown'}</span>
          </div>
          <div className="info-item">
            <label>Index:</label>
            <span>{gamepad.index}</span>
          </div>
          <div className="info-item">
            <label>Connected:</label>
            <span className={gamepad.connected ? 'connected' : 'disconnected'}>
              {gamepad.connected ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="info-item">
            <label>Mapping:</label>
            <span>{gamepad.mapping || 'Standard'}</span>
          </div>
          <div className="info-item">
            <label>Buttons:</label>
            <span>{gamepad.buttons.length}</span>
          </div>
          <div className="info-item">
            <label>Axes:</label>
            <span>{gamepad.axes.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GamepadDisplay

