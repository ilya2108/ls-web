import React, { useEffect, useState } from "react"
import { unix } from 'dayjs'

type Props = {
  timeLeft: number
}

export default function TimeLeft(props: Props) {
  const [timeLeft, setTimeLeft] = useState(props.timeLeft)

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
