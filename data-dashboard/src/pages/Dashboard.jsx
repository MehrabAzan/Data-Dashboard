import { Link, useOutletContext } from 'react-router-dom'
import DashboardCharts from '../components/DashboardCharts'

function Dashboard() {
  const {
    loading,
    error,
    filteredCharacters,
    normalizedCharacters,
    totalCharacters,
    aliveCharacters,
    averageEpisodeCount,
    shownCharacters,
  } = useOutletContext()

  return (
    <>
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

      {!loading && !error && normalizedCharacters.length > 0 && (
        <DashboardCharts characters={normalizedCharacters} />
      )}

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
                  <tr key={character.id} className="character-row">
                    <td>
                      <Link
                        to={`/character/${character.id}`}
                        className="name-cell character-link"
                      >
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
                      </Link>
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
    </>
  )
}

export default Dashboard
