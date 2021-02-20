import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import withAdmin from '../withAdmin';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';

import Layout from '../../components/Layout';

const Admin = ({ user, initialRequests }) => {
  const [state, setState] = useState({
    requests: initialRequests,
    meals: [],
  });

  const { requests, meals } = state;

  // const loadRequests = async () => {
  //   const response = await axios.get(`${API}/links/all`);
  //   setState({ ...state, requests: response.data });
  // };

  useEffect(() => {
    // loadRequests();
    allMealsChange();
    setState({
      ...state,
      meals: allMealsArray
    })
  }, []);

  let allMealsArray = [];
  const allMealsChange = (meal) => {
    requests.map((r, i) =>
      r.mealRequest.map((meal) => allMealsArray.push(meal.meal))
    );
  };
  // setState({...state, meals: [...allMealsArray]})
  // console.log(allMealsChange.length);

  // console.log(allMealsArray);
  console.log(state.meals);

  const mealCounter = (meal) => (
    // state.meals.length
    state.meals.filter((m) =>
      m == meal).length
  )
  const allMealCounter = (meal) => (
    state.meals.length
    // state.meals.filter((m) =>
    //   m == meal).length
  )

  // const allStandardMeals = (meal) =>
  //   requests.map((r, i) =>
  //     r.mealRequest.filter((meal) => {
  //     meal.standard === 'Standard'
  //     })
  //   );

  // const allMealsArray = (mr, i) =>
  //   requests.map((r, i) =>
  //     r.mealRequest.forEach((mr, i) => {
  //       let veg = 0
  //       let stn = 0
  //       if (mr.meal === 'Vegetarian') {
  //         veg ++;
  //         console.log(veg)
  //       }
  //       if (mr.meal === 'Standard') {
  //         stn ++
  //         console.log(stn)
  //       }
  //       if (mr.meal === 'Vegan') {
  //         return <h1>vegan</h1>;
  //       }
  //     })
  //   );

  return (
    <Layout>
      <br />
      <div className="row">
        <div className="col-md-4">
          <h1>Admin Dashboard</h1>
          <hr />
          <div className="col-md-8">
            <ul className="nav flex-column pt-1 ">
              <li className="nav-item">
                {/* potentially make Link an a tag if there are issues with css */}
                <Link href="/admin/category/create">
                  <a className="nav-link" href="">
                    Create Post
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                {/* potentially make Link an a tag if there are issues with css */}
                <Link href="/admin/group/create">
                  <a className="nav-link" href="">
                    Create Group
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/category/read">
                  <a className="nav-link" href="">
                    All Posts
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/group/read">
                  <a className="nav-link" href="">
                    All Groups
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/link/read">
                  <a className="nav-link" href="">
                    All Meal Requests
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user/profile/update">
                  <a className="nav-link" href="">
                    Profile Update
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user/profile/update">
                  <a className="nav-link" href="">
                    Export CSV(not working yet)
                  </a>
                </Link>
              </li>
              <div className="pt-2">
                <hr />
                <div className="">
                  <h3>Order Data</h3>
                </div>
                <hr/>
                <h3>
                <b>{requests.length}</b> - Family Orders {' '}
                <p/>
                <b>{allMealCounter()}</b> - total meals
                <hr/>
                </h3>
                <div className="p-2"  >
    <h5>

                {mealCounter('Standard')} - Standard meal requests
                <hr/>
                {mealCounter('Vegetarian')} - Vegetarian meal requests
                <hr/>
                {mealCounter('Vegan')} - Vegan meal requests
                <hr/>
                {mealCounter('GlutenFree')} - Gluten Free meal requests
                <hr/>
    </h5>
                </div>
                
                {/* {allMealsArray()} */}
                {/* {
                requests.map((r,i)=>(
                  r.mealRequest.map((mr, i) => (
                    allMealsArray(mr, i)
                ))
                ))
                } */}
                {/* {allMealsChange()} */}
                {/* {allVeganMeals().length}
                {allStandardMeals().length} */}
                {/* {requests.map((i) => (
                  <h4>graph</h4>
                ))} */}
                <br />
                {/* {requests[0].mealRequest[0].meal} */}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

Admin.getInitialProps = async () => {
  const response = await axios.get(`${API}/links/all`);
  return {
    initialRequests: response.data,
  };
};

export default withAdmin(Admin);
