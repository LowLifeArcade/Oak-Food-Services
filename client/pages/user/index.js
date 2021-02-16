import styles from '../../styles/Home.module.css';
import axios from 'axios';
import { API } from '../../config';
import { getCookie } from '../../helpers/auth';
import withUser from '../withUser';
import Link from 'next/link';
import moment from 'moment';
import Router from 'next/router';

import Layout from '../../components/Layout';

const User = ({ user, token, l, userLinks }) => {
  const confirmDelete = (e, id) => {
    e.preventDefault();
    // console.log('delete >', slug);
    let answer = window.confirm('WARNING! Confirm delete.');
    if (answer) {
      handleDelete(id);
    }
  };

  const handleDelete = async (id) => {
    // console.log('delete link', id)
    try {
      const response = await axios.delete(`${API}/link/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('LINK DELETE SUCCESS', response);
      Router.replace('/user');
    } catch (error) {
      console.log('ERROR DELETING LINK', error);
    }
  };
  {
    console.log(userLinks.mealRequest);
  }
  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div key={i} className={' p-4 alert alert-warning ' + styles.subcard}>
        <h3>Your request for Feburary 15th</h3>
        <p></p>
        <div className="p-3">
          {/* <a href={l.url} target="_blank"> */}
          <h3 className="p-2">
            {l.mealRequest.length} weekly meals:
            <p></p>
            {l.mealRequest.map((l, i) => (
              <h4 className="">{l.meal}</h4>
            ))}{' '}
          </h3>
          {console.log(l.mealRequest)}
          <h2 className="pt-2 " style={{ fontSize: '20px' }}>
            Pickup for your order is <br/>
            between {l.pickupTime}{' '} {l.pickupDate}
          </h2>
          {/* </a> */}
        </div>
        <div className="pt-2 p-3">
          <span className="">
            {' '}
            {moment(l.createdAt).fromNow()}
            {/* // + ' by ' + l.postedBy.name */}{' '}
          </span>


        </div>

        <div className="col-md-12 ">
          
          <Link href={`/user/link/${l._id}`}>
            <button className="badge btn btn-outline-warning text">
              Edit Request
            </button>
          </Link>

          <button
            onClick={(e) => confirmDelete(e, l._id)}
            className="badge text-danger btn btn-outline-warning float-right"
          >
            Delete
          </button>
        </div>
      </div>
    ));

  return (
    <Layout>
      <div className="">

      <h2 className="" >
        {user.name}'s dashboard{' '}
        {/* <span className="text-danger"> /{user.role}</span>{' '} */}
      </h2>
      </div>
<br/>
      <hr />
      <div className="row p-2">
        <div className="cor-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-item">Update profile</a>
              </Link>
            </li>
            <li className="nav-item p-4">
              <Link href="/user/link/create">
                <button className="btn btn-warning">Submit a Request</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    <div className="col-md-8 flex-column justify-content-center ">

      <h2>Your Meal Requests</h2>
      {/* <div className="col-md-5 p-3  alert alert-warning flex-column align-items-center rounded"> */}
      <div className="p-3">
        <br />
        {listOfLinks()}
    </div>
      </div>
    </Layout>
  );
};

export default withUser(User);
