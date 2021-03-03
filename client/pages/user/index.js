import styles from '../../styles/Home.module.css';
import {useEffect} from 'react'
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

  useEffect(() => {
    console.log('students!',user.students)
    user.students.length === 0
    ? Router.push('/user/profile/add')
    : console.log("it's fine")
  }, [])

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
    console.log('pages user index', userLinks.mealRequest);
  }
  const listOfLinks = () =>
    userLinks.map((l, i) => (
      <div key={i} className={' p-4 alert alert-warning ' + styles.subcard}>
        <h4>

                    {l.orderStatus && <b className="text-danger" >picked up on {moment(l.updatedAt).format('MMM Do')}</b>}
        </h4>

          <h4 className="pt-1 pb-1">
            Request for <b>{moment(l.pickupDate).format('MMM Do')}</b>
          </h4>
          <h4>
            <b>Code: {l.pickupCode}</b>
          </h4>
          <p></p>
          <div className="p-2">
            {/* <a href={l.url} target="_blank"> */}
            <h5 className="pb-1">
              {l.mealRequest.length} weekly meal
              {l.mealRequest.length > 1 && 's'}:<p></p>
              <div className="p-3">
                {l.mealRequest.map((l, i) => (
                  <h6 className="">
                    Meal {`${i + 1} `} - {l.meal}{' '} x 5
                  </h6>
                ))}
              </div>
            </h5>
            {console.log(l.mealRequest)}
            <h2 className=" " style={{ fontSize: '16px' }}>
              Pickup for your order is between <b>{l.pickupTime} </b> on Friday
            </h2>
            {/* </a> */}
          </div>
          <div className="pt-1 ">
            <span className="">
              {' '}
              {moment(l.createdAt).fromNow()} by{' '}
              {l.postedBy == null ? 'user deleted' : l.postedBy.name}{' '}
            </span>
          </div>

        <div className=" pb-3 pt-3">
          <Link href={`/user/link/${l._id}`}>
            <button className="badge btn btn-outline-warning text float-left">
              Edit Request
            </button>
          </Link>
          <Link href="">
            <button
              onClick={(e) => confirmDelete(e, l._id)}
              className="badge text-danger btn btn-outline-warning float-right"
            >
              Delete
            </button>
          </Link>
        </div>
      </div>
    ));

  return (
    <div 
    // className={styles.background}  
    >

    <Layout>
      {/* <div className=""> */}

      <h2 className="pt-3">
        {user.name}'s dashboard{' '}
        {/* <span className="text-danger"> /{user.role}</span>{' '} */}
      </h2>
      {/* </div> */}
      <hr />
      <div className="p-1">
        <div className="">
          {/* <ul className="nav flex-column"> */}
          {/* <li className="nav-item"> */}
          <Link href="/user/profile/update">
            <a className="nav-item">Update profile</a>
          </Link>
          {/* <br/>
          <Link href="/user/profile/add">
            <a className="nav-item">Add students</a>
          </Link> */}
          {/* </li> */}
          {/* <li className="nav-item p-4"> */}
          <Link href="/user/link/create">
            <button className="btn btn-warning float-right">
              Submit a Request
            </button>
          </Link>
          {/* </li> */}
          {/* </ul> */}
        </div>
      </div>

      <div className="col-md flex-column justify-content-center ">
        <br />
        {/* <h2>Your Meal Requests</h2> */}
        {/* <div className="col-md-5 p-3  alert alert-warning flex-column align-items-center rounded"> */}
        <div className="pb-3">
          <br />
          {listOfLinks()}
        </div>
      </div>
    </Layout>
    </div>

  );
};

export default withUser(User);
