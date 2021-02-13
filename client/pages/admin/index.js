import styles from '../../styles/Home.module.css';
import withAdmin from '../withAdmin'
import Link from 'next/link'

import Layout from '../../components/Layout';

const Admin = ({user}) => {
  return <Layout>
    <h1>Admin Dashboard</h1>
    <br/>
    <div className="row">
      <div className="col-md-4">
        <div className="col-md-8">
          <ul className="nav flex-column">
            <li className="nav-item">
              {/* potentially make Link an a tag if there are issues with css */}
              <Link href="/admin/category/create">
                <a className="nav-link" href="">Create Category</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/category/read">
                <a className="nav-link" href="">All Categories</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/link/read">
                <a className="nav-link" href="">All Requests</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link" href="">Profile Update</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </Layout>
};

export default withAdmin(Admin);
