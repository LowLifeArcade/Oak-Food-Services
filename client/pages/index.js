import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { API } from '../config';
import Layout from '../components/Layout';
import Link from 'next/link';
import moment from 'moment';

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
    categories.map((c, i) => (
      <Link key={i} href={`/links/${c.slug}`}>
        <a
          href=""
          style={{
            color: 'grey',
            // border: '1px solid grey',
            // padding: '10px',
            boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            // borderBlock: '5px',
          }}
          className="bg-light p-3 "
        >
          <div className="row p-3">
            {/* <div className="col-md-4 p-3">
              <img
                src={c.image && c.image.url}
                alt={c.name}
                style={{ width: '100px', height: 'auto' }}
              />
            </div> */}
            <div className="col-md-4 mb-5 p-2">
              <h3>{c.name}</h3>
            </div>
          </div>
        </a>
      </Link>
    ));
  return (
    <Layout>
      <div className="p-3">
        <div className="">
          <h2 className="font-weight-bold">Here is where you'll see the weekly menu appear</h2>
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
