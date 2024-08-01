import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopSection from "./top-section";
import MetaTags from "../../components/meta-tags";
import FormSection from "./form-section";
import Loader from '../../components/loader';
import './styles.scss';

const Login = (props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      if(localStorage.getItem('authToken'))
      {
        navigate("/");
      }
  }, []);


  return ( isLoading ? <Loader/> :
  <div className="login-page">
    <div className="login-container">
      <MetaTags {...props.metaData} />
      <TopSection {...props.topSection} />
      <FormSection {...props.formSection} setIsLoading={setIsLoading} />
    </div>
  </div>)
};

export default Login;