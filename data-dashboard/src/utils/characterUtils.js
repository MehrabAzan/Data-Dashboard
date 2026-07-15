export function NormalizeCharacter(character) {
  return {
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
  }
}

export function CountByField(characters, field) {
  const counts = {}

  characters.forEach((character) => {
    const value = character[field]
    counts[value] = (counts[value] || 0) + 1
  })

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((firstEntry, secondEntry) => secondEntry.count - firstEntry.count)
}
