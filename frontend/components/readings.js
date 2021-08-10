import React from "react"
import Card from "./card"

const Readings = ({ readings }) => {
  // console.log("Readings()")
  const leftReadingsCount = Math.ceil(readings.length / 5)
  const leftReadings = readings.slice(0, leftReadingsCount)
  const rightReadings = readings.slice(leftReadingsCount, readings.length)
  return (
    <div>
      <div className="uk-child-width-1-2@s" data-uk-grid="true">
        <div>
          {leftReadings.map((reading, i) => {
            return (
              <Card reading={reading} key={`reading__left__${reading.slug}`} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Readings
