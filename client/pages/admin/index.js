import styles from '../../styles/Home.module.css';
import withAdmin from '../withAdmin'
import Link from 'next/link'

import Layout from '../../components/Layout';

const Admin = ({user}) => {
  return <Layout>
    <br/>
    <div className="row">
      <div className="col-md-4">
    <h1>Admin Dashboard</h1>
        <div className="col-md-8">
          <ul className="nav flex-column pt-3 ">
            <li className="nav-item">
              {/* potentially make Link an a tag if there are issues with css */}
              <Link href="/admin/category/create">
                <a className="nav-link" href="">Create Post</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/category/read">
                <a className="nav-link" href="">All Posts</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/link/read">
                <a className="nav-link" href="">All Meal Requests</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link" href="">Profile Update</a>
              </Link> 
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link" href="">Export CSV(not working yet)</a>
              </Link> 
            </li>
            <div className="pt-2">

            <div className="p-2">
              <h3>Display order numbers</h3> 
            </div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
};

export default withAdmin(Admin);
