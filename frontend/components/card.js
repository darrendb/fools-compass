import React from "react"
import Link from "next/link"
import NextImage from "./image"

const Card = ({ reading }) => {
  return (
    <Link as={`/reading/${reading.slug}`} href="/reading/[id]">
      <a className="uk-link-reset">
        <div className="uk-card uk-card-muted">
          <div className="uk-card-media-top">
            <NextImage image={reading.image} />
          </div>
          <div className="uk-card-body">
            <p id="category" className="uk-text-uppercase">
              Spread Type: {reading.spread.type}
            </p>
            <p id="title" className="uk-text-large">
              Reading Title: {reading.title}
            </p>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Card
