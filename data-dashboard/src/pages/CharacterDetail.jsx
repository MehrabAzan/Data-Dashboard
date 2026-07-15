import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function FormatCreatedDate(createdValue) {
  const createdDate = new Date(createdValue)

  if (Number.isNaN(createdDate.getTime())) {
    return createdValue
  }

  return createdDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function GetEpisodeNumbers(episodeUrls) {
  if (!Array.isArray(episodeUrls)) {
    return []
  }

  return episodeUrls
    .map((episodeUrl) => {
      const episodeMatch = episodeUrl.match(/\/episode\/(\d+)$/)
      return episodeMatch ? Number(episodeMatch[1]) : null
    })
    .filter((episodeNumber) => episodeNumber !== null)
    .sort((firstEpisode, secondEpisode) => firstEpisode - secondEpisode)
}

function CharacterDetail() {
  const { id } = useParams()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const FetchCharacter = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch character details')
        }

        const data = await response.json()

        if (isMounted) {
          setCharacter(data)
        }
      } catch (err) {
        if (isMounted) {
          setCharacter(null)
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong while loading this character'
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    FetchCharacter()

    return () => {
      isMounted = false
    }
  }, [id])

  const genderLabel =
    character?.gender === 'Genderless'
      ? 'Unknown'
      : character?.gender || 'Unknown'
  const typeLabel = character?.type?.trim() ? character.type : 'None'
  const episodeNumbers = GetEpisodeNumbers(character?.episode)

  return (
    <section className="detail-section">
      <Link to="/" className="back-link">
        Back to dashboard
      </Link>

      {loading && (
        <div className="state-card" aria-live="polite">
          <p>Loading character details...</p>
        </div>
      )}

      {!loading && error && (
        <div className="state-card state-error" aria-live="polite">
          <p className="error-text">{error}</p>
          <p className="error-subtext">
            Return to the dashboard or try another character link.
          </p>
        </div>
      )}

      {!loading && !error && character && (
        <article className="detail-card">
          <div className="detail-hero">
            <img
              src={character.image}
              alt={character.name}
              className="detail-image"
            />
            <div className="detail-heading">
              <h2 className="detail-name">{character.name}</h2>
              <p className="detail-subtitle">
                {character.status} {character.species} · {genderLabel}
              </p>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-field">
              <h3 className="detail-label">Type</h3>
              <p>{typeLabel}</p>
            </div>
            <div className="detail-field">
              <h3 className="detail-label">Created</h3>
              <p>{FormatCreatedDate(character.created)}</p>
            </div>
            <div className="detail-field">
              <h3 className="detail-label">Origin</h3>
              <p>{character.origin?.name || 'Unknown'}</p>
            </div>
            <div className="detail-field">
              <h3 className="detail-label">Last known location</h3>
              <p>{character.location?.name || 'Unknown'}</p>
            </div>
            <div className="detail-field">
              <h3 className="detail-label">Episode appearances</h3>
              <p>{episodeNumbers.length}</p>
            </div>
          </div>

          <div className="detail-episodes">
            <h3 className="detail-label">Episode list</h3>
            {episodeNumbers.length > 0 ? (
              <p className="episode-list">
                {episodeNumbers.map((episodeNumber) => (
                  <span key={episodeNumber} className="episode-pill">
                    S{episodeNumber}
                  </span>
                ))}
              </p>
            ) : (
              <p>No episode data available.</p>
            )}
          </div>
        </article>
      )}
    </section>
  )
}

export default CharacterDetail
