import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CharacterDetail from './pages/CharacterDetail'
import { NormalizeCharacter } from './utils/characterUtils'
import './App.css'

const characterApiUrl = 'https://rickandmortyapi.com/api/character?page=1'

function App() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [minEpisodeCount, setMinEpisodeCount] = useState('')
  const [maxEpisodeCount, setMaxEpisodeCount] = useState('')

  useEffect(() => {
    let isMounted = true

    const FetchCharacters = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(characterApiUrl)

        if (!response.ok) {
          throw new Error('Failed to fetch characters from the Rick and Morty API')
        }

        const data = await response.json()
        const nextCharacters = Array.isArray(data.results) ? data.results : []

        if (isMounted) {
          setCharacters(nextCharacters)
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while loading characters'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    FetchCharacters()

    return () => {
      isMounted = false
    }
  }, [])

  const normalizedCharacters = useMemo(
    () => characters.map((character) => NormalizeCharacter(character)),
    [characters]
  )

  const statusOptions = useMemo(() => {
    const uniqueStatuses = new Set(
      normalizedCharacters.map((character) => character.status)
    )

    return Array.from(uniqueStatuses).sort((firstStatus, secondStatus) =>
      firstStatus.localeCompare(secondStatus)
    )
  }, [normalizedCharacters])

  const episodeBounds = useMemo(() => {
    if (!normalizedCharacters.length) {
      return {
        minEpisodeCount: 0,
        maxEpisodeCount: 0,
      }
    }

    return normalizedCharacters.reduce(
      (bounds, character) => ({
        minEpisodeCount: Math.min(bounds.minEpisodeCount, character.episodeCount),
        maxEpisodeCount: Math.max(bounds.maxEpisodeCount, character.episodeCount),
      }),
      {
        minEpisodeCount: normalizedCharacters[0].episodeCount,
        maxEpisodeCount: normalizedCharacters[0].episodeCount,
      }
    )
  }, [normalizedCharacters])

  const parsedMinEpisodeInput = Number(minEpisodeCount)
  const parsedMaxEpisodeInput = Number(maxEpisodeCount)
  const hasCustomMinEpisodeCount =
    minEpisodeCount !== '' && Number.isFinite(parsedMinEpisodeInput)
  const hasCustomMaxEpisodeCount =
    maxEpisodeCount !== '' && Number.isFinite(parsedMaxEpisodeInput)
  const boundedMinEpisodeCount = hasCustomMinEpisodeCount
    ? Math.min(
        episodeBounds.maxEpisodeCount,
        Math.max(episodeBounds.minEpisodeCount, parsedMinEpisodeInput)
      )
    : episodeBounds.minEpisodeCount
  const boundedMaxEpisodeCount = hasCustomMaxEpisodeCount
    ? Math.min(
        episodeBounds.maxEpisodeCount,
        Math.max(episodeBounds.minEpisodeCount, parsedMaxEpisodeInput)
      )
    : episodeBounds.maxEpisodeCount
  const activeMinEpisodeCount = Math.min(
    boundedMinEpisodeCount,
    boundedMaxEpisodeCount
  )
  const activeMaxEpisodeCount = Math.max(
    boundedMinEpisodeCount,
    boundedMaxEpisodeCount
  )

  const filteredCharacters = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return normalizedCharacters.filter((character) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        character.name.toLowerCase().includes(normalizedSearch)

      const matchesStatus =
        statusFilter === 'all' || character.status === statusFilter

      const matchesGender =
        genderFilter === 'all' || character.gender.toLowerCase() === genderFilter

      const matchesEpisodeBounds =
        character.episodeCount >= activeMinEpisodeCount &&
        character.episodeCount <= activeMaxEpisodeCount

      return matchesSearch && matchesStatus && matchesGender && matchesEpisodeBounds
    })
  }, [
    activeMaxEpisodeCount,
    activeMinEpisodeCount,
    genderFilter,
    normalizedCharacters,
    searchTerm,
    statusFilter,
  ])

  const totalCharacters = normalizedCharacters.length
  const aliveCharacters = useMemo(
    () =>
      normalizedCharacters.filter((character) => character.status === 'Alive').length,
    [normalizedCharacters]
  )
  const averageEpisodeCount = useMemo(() => {
    if (!normalizedCharacters.length) {
      return 0
    }

    const totalEpisodes = normalizedCharacters.reduce(
      (sum, character) => sum + character.episodeCount,
      0
    )

    return totalEpisodes / normalizedCharacters.length
  }, [normalizedCharacters])
  const shownCharacters = filteredCharacters.length

  const outletContext = {
    loading,
    error,
    filteredCharacters,
    normalizedCharacters,
    totalCharacters,
    aliveCharacters,
    averageEpisodeCount,
    shownCharacters,
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              statusOptions={statusOptions}
              genderFilter={genderFilter}
              onGenderFilterChange={setGenderFilter}
              minEpisodeCount={minEpisodeCount}
              onMinEpisodeCountChange={setMinEpisodeCount}
              maxEpisodeCount={maxEpisodeCount}
              onMaxEpisodeCountChange={setMaxEpisodeCount}
              episodeBounds={episodeBounds}
              activeMinEpisodeCount={activeMinEpisodeCount}
              activeMaxEpisodeCount={activeMaxEpisodeCount}
              totalCharacters={totalCharacters}
              outletContext={outletContext}
            />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="character/:id" element={<CharacterDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
