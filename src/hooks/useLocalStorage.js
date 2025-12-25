import { useState, useEffect } from 'react'

/**
 * Custom hook for syncing state with localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if nothing in localStorage
 * @returns {[*, Function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return saved
      }
    }
    return initialValue
  })

  useEffect(() => {
    if (value !== null && value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue]
}

/**
 * Custom hook for simple string state with localStorage
 * @param {string} key - localStorage key
 * @param {string} initialValue - Initial value if nothing in localStorage
 * @returns {[string, Function]} - [value, setValue]
 */
export function useLocalStorageString(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved || initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
