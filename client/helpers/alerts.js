export const showSuccessMessage = (success) => (
  <div className="alert alert-success">{success}</div>
);
export const showErrorMessage = (error) => (
  <div className="alert alert-danger">{error}</div>
);
export const showMessageMessage = (message) => (
  <div className="alert alert-warning">{message}</div>
);