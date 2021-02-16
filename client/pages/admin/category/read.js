import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API } from '../../../config';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/alerts';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';

const Read = ({ user, token }) => {
  const [state, setState] = useState({
    error: '',
    success: '',
    categories: [],
  });

  const { categories, error, success } = state;

  useEffect(() => {
    loadCatergories();
  }, []);

  const loadCatergories = async () => {
    const response = await axios.get(`${API}/categories`);
    setState({ ...state, categories: response.data });
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault()
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Confirm delete.')
    if (answer) {
      handleDelete(slug)
    }
  };

  const handleDelete = async (slug) => {
      try {
        const response = await axios.delete(`${API}/category/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('CATEGORY DELETE SUCCESS', response)
        loadCatergories()
      } catch (error) {
        console.log('ERROR DELETING CATEGORY', error)
      }
  }

  const listCategories = () =>
    categories.map((c, i) => (
      <Link key={i} href={`/links/${c.slug}`}>
        <a
          href=""
          style={{
            color: 'grey',
            // border: '1px solid grey',
            padding: '10px',
            boxShadow: '10px 2px 10px 4px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            borderBlock: '5px',
          }}
          className="bg-light p-3 col-md-6"
        >
          <div className="row">
            <div className="col-md-3">
              <img
                src={c.image && c.image.url}
                alt={c.name}
                style={{ width: '1000px', height: 'auto' }}
              />
            </div>
            <div className="col-md-6">
              <h3>{c.name}</h3>
            </div>
            <div className="col-md-3">
              <Link href={`/admin/category/${c.slug}`}>
                <button className="btn btn-sm btn-outline-success btn-block mb-1">
                  Update
                </button>
              </Link>
              <button
                onClick={(e) => confirmDelete(e, c.slug)}
                className="btn btn-sm btn-outline-danger btn-block"
              >
                Delete
              </button>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <Layout>
      <div className="row">
        <div className="col-md-12">
          <h1>List of categories</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories()} </div>
    </Layout>
  );
};

export default withAdmin(Read);
