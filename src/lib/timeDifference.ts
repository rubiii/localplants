const msPerMinute = 60 * 1000
const msPerHour = msPerMinute * 60
const msPerDay = msPerHour * 24
const msPerMonth = msPerDay * 30
const msPerYear = msPerDay * 365

export default function timeDifference(current: Date, previous: Date) {
  const elapsed = current.valueOf() - previous.valueOf()

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000)
    return `${seconds} ${pluralize(seconds, "second")} ago`
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute)
    return `${minutes} ${pluralize(minutes, "minute")} ago`
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour)
    return `${hours} ${pluralize(hours, "hour")} ago`
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay)
    return `${days} ${pluralize(days, "day")} ago`
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth)
    return `${months} ${pluralize(months, "month")} ago`
  } else {
    const years = Math.round(elapsed / msPerYear)
    return `${years} ${pluralize(years, "year")} ago`
  }
}

function pluralize(count: number, word: string) {
  return count === 1 ? word : `${word}s`
}
