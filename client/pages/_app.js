// import '../styles/globals.css'
// import ContextWrapper from '../components/ContextWrapper';

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* <ContextWrapper.Provider
        value={{
          user: state.user,
          signIn: signIn,
          signOut: signOut,
        }}
      > */}
        <Component {...pageProps} />
      {/* </ContextWrapper.Provider> */}
    </>
  );
}

export default MyApp;
