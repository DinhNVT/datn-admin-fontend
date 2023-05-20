import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function AuthenticatedRoutes(props) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.auth?.login);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  return <>{props.children}</>;
}

export default AuthenticatedRoutes;
