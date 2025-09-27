import pluralize from "./pluralize"

const msPerMinute = 60 * 1000
const msPerHour = msPerMinute * 60
const msPerDay = msPerHour * 24
const msPerMonth = msPerDay * 30
const msPerYear = msPerDay * 365

export default function timeAgo(soonest: Date, latest: Date) {
  const elapsed = soonest.valueOf() - latest.valueOf()

  if (elapsed < msPerMinute) {
    const seconds = Math.round(elapsed / 1000)
    return `${seconds} ${pluralize(seconds, "second")}`
  } else if (elapsed < msPerHour) {
    const minutes = Math.round(elapsed / msPerMinute)
    return `${minutes} ${pluralize(minutes, "minute")}`
  } else if (elapsed < msPerDay) {
    const hours = Math.round(elapsed / msPerHour)
    return `${hours} ${pluralize(hours, "hour")}`
  } else if (elapsed < msPerMonth) {
    const days = Math.round(elapsed / msPerDay)
    return `${days} ${pluralize(days, "day")}`
  } else if (elapsed < msPerYear) {
    const months = Math.round(elapsed / msPerMonth)
    return `${months} ${pluralize(months, "month")}`
  } else {
    const years = Math.round(elapsed / msPerYear)
    return `${years} ${pluralize(years, "year")}`
  }
}
