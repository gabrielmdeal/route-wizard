import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React from 'react';
import { StaticQuery, graphql } from 'gatsby';

import Header from './header';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <StaticQuery
      query={graphql`
        query SiteTitleQuery {
          site {
            siteMetadata {
              title
              lang
            }
          }
        }
      `}
      render={(data) => (
        <>
          <Helmet
            htmlAttributes={{ lang: data.site.siteMetadata.lang }}
            title={data.site.siteMetadata.title}
            meta={[
              {
                name: 'description',
                content: 'Build route spreadsheets from GeoJSON files',
              },
              {
                name: 'keywords',
                content: 'geojson, track, mountain, hike, long-distance',
              },
            ]}
          />
          <Header siteTitle={data.site.siteMetadata.title} />
          <div
            style={{
              margin: '0 auto',
              padding: '1rem 1.0875rem 1.45rem',
            }}
          >
            {children}
          </div>
        </>
      )}
    />
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  whatIsThis: PropTypes.element,
};

export default Layout;
