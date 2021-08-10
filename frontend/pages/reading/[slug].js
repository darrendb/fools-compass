import ReactMarkdown from "react-markdown"
import Moment from "react-moment"
import { fetchAPI } from "../../lib/api"
import Layout from "../../components/layout"
import NextImage from "../../components/image"
import Seo from "../../components/seo"
import { getStrapiMedia } from "../../lib/media"

const Reading = ({ reading }) => {
  const imageUrl = getStrapiMedia(reading.image)

  const seo = {
    metaTitle: reading.title,
    metaDescription: reading.comment,
    shareImage: reading.image,
    reading: true,
  }

  return (
    <Layout>
      <Seo seo={seo} />
      <div
        id="banner"
        className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
        data-src={imageUrl}
        data-srcset={imageUrl}
        data-uk-img
      >
        <h1>Reading.Title: {reading.title}</h1>
      </div>
      <div className="uk-section">
        <div className="uk-container uk-container-small">
          <ReactMarkdown source={reading.comment} escapeHtml={false} />
          <ReactMarkdown source={reading.spread.comment} escapeHtml={false} />
          <hr className="uk-divider-small" />
          <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
            <div>
              {reading.author.image && (
                <NextImage image={reading.author.image} />
              )}
            </div>
            <div className="uk-width-expand">
              <p className="uk-margin-remove-bottom">
                By {reading.author.username}
              </p>
              <p className="uk-text-meta uk-margin-remove-top">
                <Moment format="MMM Do YYYY">{reading.date}</Moment>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getStaticPaths() {
  const readings = await fetchAPI("/readings")

  return {
    paths: readings.map((reading) => ({
      params: {
        slug: reading.slug,
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const readings = await fetchAPI(`/readings?slug=${params.slug}`)

  return {
    props: { reading: readings[0] },
    revalidate: 1,
  }
}

export default Reading
