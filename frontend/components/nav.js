import React from "react"
import Link from "next/link"

const Nav = ({ readings }) => {
  console.log("Nav()")
  console.log(readings)
  return (
    <div>
      <nav className="uk-navbar-container" data-uk-navbar>
        <div className="uk-navbar-left">
          <ul className="uk-navbar-nav">
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="uk-navbar-right">
          <ul className="uk-navbar-nav">
            {readings.map((reading) => {
              return (
                <li key={reading.id}>
                  <Link as={`/reading/${reading.slug}`} href="/reading/[id]">
                    <a className="uk-link-reset">{reading.title}</a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default Nav
