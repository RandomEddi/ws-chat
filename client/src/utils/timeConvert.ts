export const timeConvert = (date: string | number | Date) => {
  let newDate = new Date(date)

  const day = newDate.getDate()
  const month = newDate.getMonth() + 1
  const hours = newDate.getHours()
  const minutes = newDate.getMinutes()

  return `${hours.toString().length === 1 ? `0${hours}` : hours}:${
    minutes.toString().length === 1 ? `0${minutes}` : minutes
  } - ${day.toString().length === 1 ? `0${day}` : day}.${
    month.toString().length === 1 ? `0${month}` : month
  }.${newDate.getFullYear()}`
}
