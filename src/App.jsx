import { useState, useEffect } from 'react'
import GamepadTester from './components/GamepadTester'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>DN GAMEPAD TESTER</h1>
        <p>Test dan debug controller Anda dengan DN GAMEPAD TESTER</p>
      </header>
      <main className="main">
        <GamepadTester />
      </main>
      <footer className="footer">
        <p>© 2026 DN Gamepad Tester - Versi 1.0.0</p>
      </footer>
    </div>
  )
}

export default App

