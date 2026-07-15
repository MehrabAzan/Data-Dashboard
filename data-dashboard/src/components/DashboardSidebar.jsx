function DashboardSidebar({
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
}) {
  const maxEpisodeLabel =
    maxEpisodeCount === '' ? episodeBounds.maxEpisodeCount : activeMaxEpisodeCount

  return (
    <aside className="dashboard-filters">
      <h2 className="section-title">Filters</h2>

      <label className="filter-group">
        <span className="filter-label">Search by character name</span>
        <input
          type="text"
          className="filter-input"
          placeholder="Start typing a character name..."
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </label>

      <label className="filter-group">
        <span className="filter-label">Status</span>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
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
            onChange={(event) => onGenderFilterChange(event.target.value)}
          />
          <span>All genders</span>
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="genderFilter"
            value="male"
            checked={genderFilter === 'male'}
            onChange={(event) => onGenderFilterChange(event.target.value)}
          />
          <span>Male</span>
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="genderFilter"
            value="female"
            checked={genderFilter === 'female'}
            onChange={(event) => onGenderFilterChange(event.target.value)}
          />
          <span>Female</span>
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="genderFilter"
            value="unknown"
            checked={genderFilter === 'unknown'}
            onChange={(event) => onGenderFilterChange(event.target.value)}
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
          onChange={(event) => onMaxEpisodeCountChange(event.target.value)}
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
              onChange={(event) => onMinEpisodeCountChange(event.target.value)}
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
              onChange={(event) => onMaxEpisodeCountChange(event.target.value)}
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
  )
}

export default DashboardSidebar
