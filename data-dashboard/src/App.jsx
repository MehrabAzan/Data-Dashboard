import { useEffect, useMemo, useState } from 'react'
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
    () =>
      characters.map((character) => ({
        id: character.id,
        name: character.name,
        image: character.image,
        status: character.status || 'unknown',
        species: character.species || 'Unknown',
        gender:
          character.gender === 'Genderless'
            ? 'Unknown'
            : character.gender || 'unknown',
        typeLabel: character.type?.trim() ? character.type : 'None',
        originName: character.origin?.name || 'Unknown',
        locationName: character.location?.name || 'Unknown',
        episodeCount: Array.isArray(character.episode) ? character.episode.length : 0,
      })),
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
  const maxEpisodeLabel =
    maxEpisodeCount === '' ? episodeBounds.maxEpisodeCount : activeMaxEpisodeCount

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Rick and Morty Character Dashboard</h1>
          <p className="dashboard-subtitle">
            Explore Rick and Morty characters with live search plus combined
            status, gender, and episode appearance range filters.
          </p>
        </div>
      </header>

      <section className="dashboard-content">
        <aside className="dashboard-filters">
          <h2 className="section-title">Filters</h2>

          <label className="filter-group">
            <span className="filter-label">Search by character name</span>
            <input
              type="text"
              className="filter-input"
              placeholder="Start typing a character name..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>

          <label className="filter-group">
            <span className="filter-label">Status</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="filter-group radio-group">
            <legend className="filter-label">Gender</legend>
            <label className="radio-option">
              <input
                type="radio"
                name="genderFilter"
                value="all"
                checked={genderFilter === 'all'}
                onChange={(event) => setGenderFilter(event.target.value)}
              />
              <span>All genders</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="genderFilter"
                value="male"
                checked={genderFilter === 'male'}
                onChange={(event) => setGenderFilter(event.target.value)}
              />
              <span>Male</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="genderFilter"
                value="female"
                checked={genderFilter === 'female'}
                onChange={(event) => setGenderFilter(event.target.value)}
              />
              <span>Female</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="genderFilter"
                value="unknown"
                checked={genderFilter === 'unknown'}
                onChange={(event) => setGenderFilter(event.target.value)}
              />
              <span>Unknown</span>
            </label>
          </fieldset>

          <div className="filter-group">
            <span className="filter-label">
              Max episode appearances: {maxEpisodeLabel}
            </span>
            <input
              type="range"
              className="filter-range"
              min={String(episodeBounds.minEpisodeCount)}
              max={String(episodeBounds.maxEpisodeCount || 1)}
              step="1"
              value={
                maxEpisodeCount === '' ? episodeBounds.maxEpisodeCount : maxEpisodeCount
              }
              onChange={(event) => setMaxEpisodeCount(event.target.value)}
              disabled={!totalCharacters}
            />
          </div>

          <div className="filter-group">
            <span className="filter-label">Episode appearance range</span>
            <span className="filter-supporting-text">
              Enter a minimum and maximum number of episode appearances. Current
              applied range: {activeMinEpisodeCount} to {activeMaxEpisodeCount}.
            </span>
            <div className="bound-inputs">
              <label className="bound-field">
                <span className="bound-label">Min</span>
                <input
                  type="number"
                  className="filter-input"
                  min={episodeBounds.minEpisodeCount}
                  max={episodeBounds.maxEpisodeCount}
                  value={minEpisodeCount}
                  placeholder={String(episodeBounds.minEpisodeCount)}
                  onChange={(event) => setMinEpisodeCount(event.target.value)}
                />
              </label>
              <label className="bound-field">
                <span className="bound-label">Max</span>
                <input
                  type="number"
                  className="filter-input"
                  min={episodeBounds.minEpisodeCount}
                  max={episodeBounds.maxEpisodeCount}
                  value={maxEpisodeCount}
                  placeholder={String(episodeBounds.maxEpisodeCount)}
                  onChange={(event) => setMaxEpisodeCount(event.target.value)}
                />
              </label>
            </div>
          </div>

          <p className="filter-hint">
            All filters combine together on the loaded characters. Leave the
            episode fields blank to use the full available range of{' '}
            {episodeBounds.minEpisodeCount} to {episodeBounds.maxEpisodeCount}.
          </p>
        </aside>

        <main className="dashboard-main">
          <section className="summary-grid" aria-label="Summary statistics">
            <article className="summary-card">
              <h2 className="summary-label">Characters loaded</h2>
              <p className="summary-value">{totalCharacters}</p>
              <p className="summary-caption">
                Number of characters fetched from the API.
              </p>
            </article>

            <article className="summary-card">
              <h2 className="summary-label">Alive characters</h2>
              <p className="summary-value">{aliveCharacters}</p>
              <p className="summary-caption">
                Count of loaded characters whose current status is Alive.
              </p>
            </article>

            <article className="summary-card">
              <h2 className="summary-label">Avg. episode count</h2>
              <p className="summary-value">{averageEpisodeCount.toFixed(1)}</p>
              <p className="summary-caption">
                Average number of episode appearances per character.
              </p>
            </article>

            <article className="summary-card summary-card-accent">
              <h2 className="summary-label">Characters shown</h2>
              <p className="summary-value">{shownCharacters}</p>
              <p className="summary-caption">
                Characters currently matching the active filter combination.
              </p>
            </article>
          </section>

          <section className="table-section">
            <div className="table-header">
              <h2 className="section-title">Characters</h2>
              <p className="table-meta">
                Showing {shownCharacters} of {totalCharacters} characters
              </p>
            </div>

            {loading && (
              <div className="state-card" aria-live="polite">
                <p>Loading characters from the Rick and Morty API...</p>
              </div>
            )}

            {!loading && error && (
              <div className="state-card state-error" aria-live="polite">
                <p className="error-text">{error}</p>
                <p className="error-subtext">
                  Refresh the page to try the request again.
                </p>
              </div>
            )}

            {!loading && !error && !filteredCharacters.length && (
              <div className="state-card" aria-live="polite">
                <p>No characters match the current filters.</p>
                <p className="error-subtext">
                  Try widening the episode range or changing the status filter.
                </p>
              </div>
            )}

            {!loading && !error && filteredCharacters.length > 0 && (
              <div className="table-wrapper">
                <table className="recipe-table">
                  <thead>
                    <tr>
                      <th scope="col">Character</th>
                      <th scope="col">Status</th>
                      <th scope="col">Species</th>
                      <th scope="col">Gender</th>
                      <th scope="col">Origin</th>
                      <th scope="col">Episodes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharacters.map((character) => (
                      <tr key={character.id}>
                        <td>
                          <div className="name-cell">
                            <img
                              src={character.image}
                              alt={character.name}
                              className="avatar"
                            />
                            <div>
                              <div className="name-text">{character.name}</div>
                              <div className="subtext">
                                Type: {character.typeLabel} | Last known location:{' '}
                                {character.locationName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="status-pill">{character.status}</span>
                        </td>
                        <td>{character.species}</td>
                        <td>{character.gender}</td>
                        <td>{character.originName}</td>
                        <td>{character.episodeCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </section>
    </div>
  )
}

export default App
