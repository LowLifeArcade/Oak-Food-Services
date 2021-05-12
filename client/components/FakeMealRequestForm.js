import styles from '../styles/Home.module.css';

const FakeMealRequestForm = () => {
  return (
    <div className="col-md-6 offset-md-3 pt-4">
      <div className={styles.subcard}>
        <div className="row">
          <div className="col-md-12">
            <h3 className="text-dark"></h3>
            &nbsp;
            <div className={'p-5 ' + styles.animatedBg}></div>
            <div className={'p-3 ' + styles.animatedBg}></div>
            <div className={'p-3 ' + styles.animatedBg}></div>
            <div className={'p-3 ' + styles.animatedBg}></div>
            <div className={'p-5 ' + styles.animatedBg}></div>
            <div className={'p-3 ' + styles.animatedBg}></div>
            <div className={'p-3 ' + styles.animatedBg}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FakeMealRequestForm;
