import { useState } from 'react'

// How long the browser may look for the location, and how old a known one may be.
const OPTIONS = { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }

// The customer's location, only when they press "use my location" and allow it in the browser.
// It stays in this page's memory until it is closed: never saved and never sent anywhere, except
// as a link in the WhatsApp message the customer sends themselves.
// place is null or { latitude, longitude }; status is 'idle', 'locating' or 'failed'.
export function useCustomerLocation() {
  const [place, setPlace] = useState(null)
  const [status, setStatus] = useState('idle')

  function locate() {
    if (!navigator.geolocation) {
      setStatus('failed')
      return
    }
    setStatus('locating')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPlace({ latitude: coords.latitude, longitude: coords.longitude })
        setStatus('idle')
      },
      () => setStatus('failed'),
      OPTIONS,
    )
  }

  function forget() {
    setPlace(null)
    setStatus('idle')
  }

  return { place, status, locate, forget }
}
