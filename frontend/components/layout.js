import Nav from "./nav"

const Layout = ({ children, readings, seo }) => {
  return (
    <>
      {/*<Nav readings={readings} />*/}
      {children}
    </>
  )
}

export default Layout
