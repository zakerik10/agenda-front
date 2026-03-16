import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'

const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'

/**
 * Authenticate with Google and request Calendar scope.
 */
export const authenticateWithCalendarScope = async () => {
    const provider = new GoogleAuthProvider()
    provider.addScope(SCOPES)

    try {
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        return credential.accessToken
    } catch (error) {
        console.error('Error during authentication:', error)
        throw error
    }
}

/**
 * List events (for testing purposes).
 */
export const listUpcomingEvents = async (accessToken) => {
    if (!accessToken) return

    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events')
    url.searchParams.append('timeMin', (new Date()).toISOString())
    url.searchParams.append('maxResults', 10)
    url.searchParams.append('singleEvents', true)
    url.searchParams.append('orderBy', 'startTime')

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const data = await response.json()
        console.log('Google events:', data.items)
        return data.items
    } catch (error) {
        console.error('Error fetching events:', error)
    }
}
