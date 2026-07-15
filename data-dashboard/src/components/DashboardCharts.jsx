import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CountByField } from '../utils/characterUtils'

const statusColors = ['#22c55e', '#ef4444', '#94a3b8']
const barColors = ['#aa3bff', '#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#64748b']

function DashboardCharts({ characters }) {
  const [secondaryChart, setSecondaryChart] = useState('species')

  const statusData = useMemo(
    () => CountByField(characters, 'status'),
    [characters]
  )

  const speciesData = useMemo(
    () => CountByField(characters, 'species'),
    [characters]
  )

  const genderData = useMemo(
    () => CountByField(characters, 'gender'),
    [characters]
  )

  const secondaryData = secondaryChart === 'species' ? speciesData : genderData
  const secondaryTitle =
    secondaryChart === 'species' ? 'Characters by species' : 'Characters by gender'

  return (
    <section className="charts-section" aria-label="Data visualizations">
      <div className="charts-header">
        <div>
          <h2 className="section-title">Data insights</h2>
          <p className="charts-intro">
            Most loaded characters are human or alien, and alive status dominates
            the first page of results. Toggle the second chart to compare species
            versus gender breakdowns.
          </p>
        </div>
      </div>

      <div className="charts-grid">
        <article className="chart-card">
          <h3 className="chart-title">Characters by status</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, count }) => `${name}: ${count}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={statusColors[index % statusColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">{secondaryTitle}</h3>
            <div className="chart-toggle" role="group" aria-label="Chart type">
              <button
                type="button"
                className={
                  secondaryChart === 'species'
                    ? 'chart-toggle-button chart-toggle-button-active'
                    : 'chart-toggle-button'
                }
                onClick={() => setSecondaryChart('species')}
              >
                Species
              </button>
              <button
                type="button"
                className={
                  secondaryChart === 'gender'
                    ? 'chart-toggle-button chart-toggle-button-active'
                    : 'chart-toggle-button'
                }
                onClick={() => setSecondaryChart('gender')}
              >
                Gender
              </button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={secondaryData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {secondaryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}

export default DashboardCharts
