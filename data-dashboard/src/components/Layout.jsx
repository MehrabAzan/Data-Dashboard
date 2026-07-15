import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'

function Layout({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  genderFilter,
  onGenderFilterChange,
  minEpisodeCount,
  onMinEpisodeCountChange,
  maxEpisodeCount,
  onMaxEpisodeCountChange,
  episodeBounds,
  activeMinEpisodeCount,
  activeMaxEpisodeCount,
  totalCharacters,
  outletContext,
}) {
  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Rick and Morty Character Dashboard</h1>
          <p className="dashboard-subtitle">
            Explore Rick and Morty characters with live search, combined filters,
            data visualizations, and per-character detail pages.
          </p>
        </div>
      </header>

      <section className="dashboard-content">
        <DashboardSidebar
          searchTerm={searchTerm}
          onSearchTermChange={onSearchTermChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          statusOptions={statusOptions}
          genderFilter={genderFilter}
          onGenderFilterChange={onGenderFilterChange}
          minEpisodeCount={minEpisodeCount}
          onMinEpisodeCountChange={onMinEpisodeCountChange}
          maxEpisodeCount={maxEpisodeCount}
          onMaxEpisodeCountChange={onMaxEpisodeCountChange}
          episodeBounds={episodeBounds}
          activeMinEpisodeCount={activeMinEpisodeCount}
          activeMaxEpisodeCount={activeMaxEpisodeCount}
          totalCharacters={totalCharacters}
        />

        <main className="dashboard-main">
          <Outlet context={outletContext} />
        </main>
      </section>
    </div>
  )
}

export default Layout
