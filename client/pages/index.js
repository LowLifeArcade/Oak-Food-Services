import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { API } from '../config';
import Layout from '../components/Layout';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';

// refactor this into the admin only view
const Home = ({ categories }) => {
  // move all of this CODE to admin page
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular`);
    setPopular(response.data);
  };
  // console.log(popular);

  const handleClick = async (linkId) => {
    // e.preventDefault();
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const listOfLinks = () =>
    popular.map((l, i) => (
      <div key={i} className="row alert alert-secondary p2">
        {/* {console.log(l)} */}
        <div className="col-md-8" onClick={() => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title}</h5>
            <h6 className="pt-2 text-dnger" style={{ fontSize: '12px' }}>
              {l.url}
            </h6>
          </a>
          <div className="col-md-4 pt-2">
            <span className="pull-right">
              {moment(l.createdAt).fromNow()} by
              {l.postedBy.name}
              {/* {console.log('trying to find name', l)} */}
            </span>
          </div>
          <div className="col-md-12">
            <span className="badge text-dark">
              {l.type} {l.medium}{' '}
            </span>
            {l.categories.map((c, i) => (
              <span key={i} className="badge text-success">
                {c.name}{' '}
              </span>
            ))}
            <span className="badge text-secondary pull-right">
              {l.clicks} clicks{' '}
            </span>
          </div>
        </div>
      </div>
    ));
  // CODE for admin /

  const listCategories = () =>
    categories.slice(0).reverse().map((c, i) => (
      <>
        <div
        className=""
          style={{
            color: 'grey',
            border: '1px solid grey',
            // padding: '10px',
            // boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
            // borderRadius: '8px',
            // borderBlock: '5px',
          }}
        >
          <Link key={i} href={`/links/${c.slug}`}>
            <a
              style={{
                color: 'grey',
                // border: '1px solid grey',
                // padding: '10px',
                // boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
                // borderRadius: '8px',
                // borderBlock: '5px',
              }}
              className="bg-light "
            >
              <div className="row p-4">
                {/* <div className="col-md-4 p-3">
              <img
              src={c.image && c.image.url}
              alt={c.name}
              style={{ width: '100px', height: 'auto' }}
              />
            </div> */}

                <div className="row">
                  <div className="col-md-8">
                    <h2 className="font-weight-bold p-2">{c.name}</h2>
                    <hr />
                    <div className="lead alert alert-seconary pt-4">
                      {renderHTML(c.content || '')}
                    </div>
                    <div className="col-md-4">
                      {c.image && (
                        <img
                          src={c.image.url}
                          alt={c.name}
                          style={{ width: '280px', maxHeight: 'auto' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </Link>
          <div className="col-md-4 mb-5 pt-4">
            {/* <h3>{c.name}</h3> {c.createdAt} */}
            {moment(c.createdAt).fromNow()} 
            {/* {popular.map((l, i) => l.postedBy.name)} */}
            {c.username}
          </div>
        </div>
        <div className="p-2"></div>
      </>
    ));
  return (
    <Layout>
      <div className="pt-4">
        <div className="">
          {/* <h3 className="font-weight-bold">Your Food Feed</h3> */}
        </div>
      </div>

      <div className="row flex-column justify-content-center  p-3">
        {listCategories()}
      </div>

      {/* <div className="row pt-5">
        <h2 className="font-weight-bold pb-3">Trending</h2>
        <div className="col-md-12 overflow-hidden">{listOfLinks()}</div>
      </div> */}
    </Layout>
  );
};
// all above for admin only view OR this will be the available food orders and people click request

Home.getInitialProps = async () => {
  const response = await axios.get(`${API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
