import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import withAdmin from '../withAdmin';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';
import ChartsEmbedSDK from '@mongodb-js/charts-embed-dom';

const sdk = new ChartsEmbedSDK({
  baseUrl: 'https://charts.mongodb.com/charts-charts-fixture-tenant-zdvkh',
});
const chart = sdk.createChart({
  chartId: '48043c78-f1d9-42ab-a2e1-f2d3c088f864',
});

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
      meals: allMealsArray,
    });
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

  const mealCounter = (meal) =>
    // state.meals.length
    state.meals.filter((m) => m == meal).length;
  const allMealCounter = (meal) => state.meals.length;
  // state.meals.filter((m) =>
  //   m == meal).length

  // const allStandardMeals = (meal) =>
  //   requests.map((r, i) =>
  //     r.mealRequest.filter((meal) => {
  //     meal.standard === 'Standard'
  //     })
  //   );
  const ref = useRef('chart')
  const renderChart = () => {
    // render the chart into a container
    chart
      .render(ref)
      .catch(() => window.alert('Chart failed to initialise'));
  };

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
          <div className="">
            <ul className="nav flex-column pt-1 ">
              <li className="nav-item">
              <li className="nav-item">
                <Link href="/admin/link/read">
                  <a className="nav-link" href="">
                    Meal Requests Page
                  </a>
                </Link>
              </li>
                <Link href="/admin/category/create">
                  <a className="nav-link" href="">
                    Create Blog Post
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/admin/category/read">
                  <a className="nav-link" href="">
                    Edit Blog Posts
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                {/* potentially make Link an a tag if there are issues with css */}
                <Link href="/admin/group/create">
                  <a className="nav-link" href="">
                    Create Student Group
                  </a>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link href="/admin/group/read">
                  <a className="nav-link" href="">
                    Edit Student Groups
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/user/link/create">
                  <a className="nav-link" href="">
                    Create Mock Order
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
              
              <div className="pt-2">
                <hr />

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
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className="">
        <h3>Order Data</h3>
      </div>
      <hr />
      <h3>
        <b>{requests.length}</b> - Family Orders <p />
        <b>{allMealCounter()}</b> - total meals
        <hr />
      </h3>
      <div className="p-2">
        <h5>
          {mealCounter('Standard')} - Standard meal requests
          <hr />
          {mealCounter('Vegetarian')} - Vegetarian meal requests
          <hr />
          {mealCounter('Vegan')} - Vegan meal requests
          <hr />
          {mealCounter('GlutenFree')} - Gluten Free meal requests
          <hr />
        </h5>
      </div>
        {/* {chart.render(ref)} */}
        {/* {renderChart()} */}
      {/* <div className="p-2 chart" ref={ref} id="chart"> */}
        {/* {chart.render().catch(() => window.alert('Chart failed to initialise'))} */}
      {/* </div> */}
    </Layout>
  );
};

// https://charts.mongodb.com/charts-oakfood-apdce
// 7e5526b4-2296-4299-9c21-9dc11ed4817a

Admin.getInitialProps = async () => {
  const response = await axios.get(`${API}/links/all`);
  return {
    initialRequests: response.data,
  };
};

export default withAdmin(Admin);
