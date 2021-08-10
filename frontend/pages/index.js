import React from "react"
import Articles from "../components/articles"
import Readings from "../components/readings"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { fetchAPI } from "../lib/api"

const Home = ({ homepage, readings, articles, categories }) => {
  return (
    <Layout readings={readings} categories={categories}>
      <Seo seo={homepage.seo} />
      <div className="uk-section">
        <div className="uk-container uk-container-large">
          <h1>{homepage.hero.title}</h1>
          <Readings readings={readings} />
          {/*<Articles articles={articles} />*/}
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // Run API calls in parallel
  const [homepage, readings, articles, categories] = await Promise.all([
    fetchAPI("/homepage"),
    fetchAPI("/readings"),
    fetchAPI("/articles"),
    fetchAPI("/categories"),
  ])

  return {
    props: { homepage, readings, articles, categories },
    revalidate: 1,
  }
}

export default Home
