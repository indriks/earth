import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CountryDetail } from '@/types/country'

const BOOKMARKS_STORAGE_KEY = 'bookmarks'

// Custom storage adapter for AsyncStorage
const asyncStorage = createJSONStorage<CountryDetail[]>(() => AsyncStorage)

// Create a persisted atom using atomWithStorage
export const bookmarksAtom = atomWithStorage<CountryDetail[]>(
  BOOKMARKS_STORAGE_KEY,
  [],
  asyncStorage
)

// Atom to get the bookmark count
export const bookmarkCountAtom = atom(
  (get) => get(bookmarksAtom).length
)

// Function to load bookmarks from AsyncStorage
export const loadBookmarks = async () => {
  try {
    const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY)
    return storedBookmarks ? JSON.parse(storedBookmarks) : []
  } catch (error) {
    console.error('Error loading bookmarks:', error)
    return []
  }
}

// Function to save bookmarks to AsyncStorage
export const saveBookmarks = async (bookmarks: CountryDetail[]) => {
  try {
    await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks))
  } catch (error) {
    console.error('Error saving bookmarks:', error)
  }
}

// Atom for updating bookmarks
export const updateBookmarksAtom = atom(
  null,
  (get, set, updatedBookmarks: CountryDetail[]) => {
    set(bookmarksAtom, updatedBookmarks)
  }
)
