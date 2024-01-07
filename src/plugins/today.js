let today = new Date()

const todayObject = {
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  date: today.getDate(),
  day: today.getDay(),
}

const getWeek = getDate => {
  const date = new Date(getDate)
  // const week = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  return week[date.getDay()]
}

const getCurrentDateTime = () => {
  const currentDate = new Date()

  const year = currentDate.getFullYear()
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
  const day = currentDate.getDate().toString().padStart(2, "0")

  const hours = currentDate.getHours().toString().padStart(2, "0")
  const minutes = currentDate.getMinutes().toString().padStart(2, "0")
  const seconds = currentDate.getSeconds().toString().padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const monthToEngFunc = monthCount => {
  const monthEngList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]
  return monthEngList[monthCount]
}

const formatDate = (date, type) => {
  if (type === "object") {
    return `${date.year}-${("00" + date.month.toString()).slice(-2)}-${(
      "00" + date.date.toString()
    ).slice(-2)}`
  }

  return `${date.getFullYear()}-${(
    "00" + (date.getMonth() + 1).toString()
  ).slice(-2)}-${("00" + date.getDate().toString()).slice(-2)}`
}

export default {
  install(app) {
    const format = {
      today: formatDate(todayObject, "object"),
      propsToFormat(propsDate) {
        propsDate = new Date(propsDate)
        return `${monthToEngFunc(propsDate.getMonth())} ${propsDate.getDate()}, ${
          propsDate.getFullYear()
        }`
      },
      week(propsWeek) {
        return getWeek(propsWeek)
      },
      getCurrentDateTime: getCurrentDateTime()
    }
    const calcDate = {
      prevDay: propsDate => {
        const beforeDate = new Date(propsDate)
        beforeDate.setDate(beforeDate.getDate() - 1)
        return formatDate(beforeDate, "date")
      },
      nextDay: propsDate => {
        const beforeDate = new Date(propsDate)
        beforeDate.setDate(beforeDate.getDate() + 1)
        return formatDate(beforeDate, "date")
      },
    }
    // app.config.globalProperties.$today = format;
    app.provide("todayDate", { format, calcDate })
  },
}
