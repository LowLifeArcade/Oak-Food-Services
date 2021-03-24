import { useState, useEffect, Fragment } from 'react';
import { isAuth } from '../../helpers/auth';
import Layout from '../../components/Layout';
import styles from '../../styles/Home.module.css';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import { API, APP_NAME } from '../../config';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';

// this gets rid of extra characters in head
const stripHTML = (data) => data.replace(/<\/?[^>]+(>|$)/g, '');

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  const head = () => (
    <Head></Head>
    // <Head>
    //   <title>
    //     {category.name} | {APP_NAME}{' '}
    //   </title>
    //   {/* substring helps limit the amount of content in the head for SEO */}
    //   <meta name="description" content={stripHTML(category.content.substring(0,160))} />
    //   <meta property="og:title" content={category.name} />
    //   <meta property="og:description" content={stripHTML(category.content.substring(0,160))} />
    //   <meta property="og:image" content={!category.image ==='' && category.image.url} />
    //   <meta property="og:image:secure_url" content={category.image && category.image.url} />
    // </Head>
  );

  useEffect(() => {
    loadPopular();
  }, []);

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const response = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('CATEGORY DELETE SUCCESS', response);
      // loadCatergories();
    } catch (error) {
      console.log('ERROR DELETING CATEGORY', error);
    }
  };

  const loadPopular = async () => {
    const response = await axios.get(`${API}/link/popular/${category.slug}`);
    setPopular(response.data);
  };

  const handleClick = async (linkId) => {
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadUpdatedLinks();
  };

  const loadUpdatedLinks = async () => {
    const response = await axios.post(`${API}/category/${query.slug}`);
    setAllLinks(response.data.links);
  };

  const handlePopularClick = async (linkId) => {
    // e.preventDefault();
    const response = await axios.put(`${API}/click-count`, { linkId });
    loadPopular();
  };

  const listOfPopularLinks = () =>
    popular.map((l, i) => (
      <div key={i} className="row alert alert-secondary p2">
        {/* {console.log(l)} */}
        <div className="col-md-8" onClick={() => handlePopularClick(l._id)}>
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

  const listOfLinks = (l) =>
    allLinks.map((l, i) => (
      <div key={i} className="row alert alert-primary p-2">
        <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
          <a href={l.url} target="_blank">
            <h5 className="pt-2">{l.title} </h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
              {l.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(l.createdAt).fromNow()} by {l.postedBy.name}
          </span>
          <span className="badge text-secondary pull-right">
            {l.clicks} clicks
          </span>
        </div>
        <div className="col-md-12">
          <span className="badge text-dark">
            {l.type} / {l.medium}{' '}
          </span>
          {l.categories.map((c, i) => (
            <span key={i} className="badge text-success">
              {c.name}{' '}
            </span>
          ))}
        </div>
      </div>
    ));

  const loadMore = async () => {
    let toSkip = skip + limit;
    const response = await axios.post(`${API}/category/${query.slug}`, {
      skip: toSkip,
      limit,
    });
    setAllLinks([...allLinks, ...response.data.links]);
    console.log('allLinks', allLinks);
    console.log('response.data.links.length', response.data.links.length);
    setSize(response.data.links.length);
    setSkip(toSkip);
  };

  // const loadMoreButton = () => {
  //   return (
  //     size > 0 &&
  //     size >= limit && (
  //       <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
  //         Load more
  //       </button>
  //     )
  //   );
  // };
  return (
    <>
      {head()}
      <Layout>
        <div className="row ">
          
          <div className="col-md-12 pt-2">
          
            <h1 className=" font-weight-bold pt-3 pb-2">{category.name}</h1>
            
            <hr />
            <div className="alert-seconary pt-2">
              {renderHTML(category.content || '')}
            </div>
            
            <div className="alert-seconary pt-2">
               <table className="table table-striped">
                {category.menu.length > 0 && <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">Breakfast</th>
                    <th scope="col">Lunch</th>
                    <th scope="col">Vegetarian Lunch</th>
                  </tr>
                </thead>}
                <tbody>
                  {category.menu.map((l, i) => (
                    <>
                      <tr key={i}>
                        <td>{l.row1}</td>
                        <td>{l.row2}</td>
                        <td>{l.row3}</td>
                        <td>{l.row4}</td>
                      </tr>
                    </>
                  )) || ''}
                </tbody>
              </table> 


            </div>
          </div>
          <div className="col-md">
            {category.image && (
              <img
                src={category.image && category.image.url}
                alt={category.name}
                style={{ width: '350px', maxHeight: '' }}
              />
            )}
            <div className="pt-5"></div>
            Posted: {moment(category.createdAt).format('MMMM Do YYYY')}
            <Link href="/user/link/create">
              <button className={'btn float-right ' + styles.button}>
                <i class="fas fa-pencil-alt"></i>
                &nbsp;&nbsp; Request
              </button>
            </Link>
          </div>
        </div>
        <br />
          {process.browser && isAuth().role === 'admin' && (
            <div className="">
              <Link href={`/admin/category/${category.slug}`}>
                <button className="badge btn btn-sm btn-outline-warning  mb-1">
                  Update
                </button>
              </Link>
              &nbsp;
              <button
                onClick={(e) => confirmDelete(e, category.slug)}
                className="badge btn btn-sm btn-outline-danger "
              >
                Delete
              </button>
            </div>
          )}
        {/* formated link area */}
        {/* <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most Popular in the {category.name} </h2>
          <p>show popular links</p>
        </div>
      </div> */}
        {/* <div className="text-center pt-4 pb-5">{loadMoreButton()}</div> */}
        {/* t-center"> */}
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={size > 0 && size >= limit}
          loader={
            <div className="loader" key={0}>
              <img src="/static/images/loading.gif" alt="loading..." />
            </div>
          }
        >
          {/* <div className="col-md-8">{listOfLinks()}</div> */}
          <div className="row">
            <div className="col-md-8">{listOfLinks()}</div>
            <div className="col-md-4">
              {/* <h2 className="lead">Most Popular in the {category.name} </h2> */}
              <div className="p-3">
                {/* <p>show popular links</p>
                {listOfPopularLinks()} */}
              </div>
            </div>
          </div>
        </InfiniteScroll>
      </Layout>
    </>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 2;

  const response = await axios.post(`${API}/category/${query.slug}`, {
    skip,
    limit,
  });
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
