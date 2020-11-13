import React, { useEffect, useState } from "react"
import dayjs, { unix } from 'dayjs'

type Props = {
  timeLeft: number
  endTime: string
}

export default function TimeLeft(props: Props) {
  const endTime = props.endTime.replace(/\+00\:00/, '')
  const [timeLeft, setTimeLeft] = useState(
    // Math.round((new Date('2020-10-28 17:27:30+00:00').getTime() - Date.now()) / 1000)
    Math.round((dayjs(endTime).unix()+120*60 - (Date.now()/1000)))
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timeLeft <= 0) {
        window.location.reload()
        clearTimeout(timeout)
        return
      }

      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => {
      clearTimeout(timeout)
    }
  })

  return (
    <span>[{unix(timeLeft).format("mm:ss")}]</span>
  )
}
