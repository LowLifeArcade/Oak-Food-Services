import axios from 'axios';
import { API } from '../config';
import { getCookie } from '../helpers/auth';

const withAdmin = (Page) => {
  const WithAdminUser = (props) => <Page {...props} />;
  WithAdminUser.getInitialProps = async (context) => {
    const token = getCookie('token', context.req);
    let user = null;
    let username = null;
    let userLinks = [];

    if (token) {
      try {
        const response = await axios.get(`${API}/admin`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: 'application/json',
          },
        });
        username = response.data.name
        user = response.data.user;
        userLinks = response.data.links;
      } catch (error) {
        if (error.response.status === 401) {
          user = null;
          // console.log('with Admin get error', response.data)
        }
      }
    }

    if (user === null) {
      // redirect
      console.log(context.res)
      context.res.writeHead(302, {
        Location: '/',
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        username,
        token,
        userLinks,
      };
    }
  };

  return WithAdminUser;
};

export default withAdmin;
