import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.scss";

const ErrorPage: React.FC = () => {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="home-link">
        Go back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
