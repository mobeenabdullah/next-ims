import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import Router from 'next/router';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addUser } from "../features/user/userSlice";
import { RootState } from "../store/store";
import { getData } from "../features/thunks/thunks";
import Loading from "./Loading";

const Protected = (props) => {
  const [isProtected, setIsProtected] = useState(false);
  const [cookies, removeCookie] = useCookies(["authToken"]);
  const userState = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const authentication = async (token) => {
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        const dateNow = new Date();
  
        if (!(decodedToken.exp * 1000 > dateNow.getTime())) {
            removeCookie("authToken", {path:'/'});
            Router.push("/login");
        } else {
          const response = await getData('me', token, {});
          if (response.status === 200) {
            if(!response.data.companyDetails) {
              Router.push('/company-detail');
            }
            setIsProtected(true);
            const user = response.data;
            dispatch(
              addUser({
                ...userState,
                user_id: user.id,
                name: user.name,
                email: user.email,
                companyDetails: user.companyDetails,
              })
            );
          } else {
            removeCookie("authToken", {path:'/'});
            Router.push('/login');
          }
        }
      } catch (error) {
        removeCookie("authToken", {path:'/'});
        Router.push("/login");
      }
    } else {
      removeCookie("authToken", {path:'/'});
      Router.replace("/login");
    }
  }


  useEffect(() => {
    authentication(cookies.authToken);
  }, []);

  if(isProtected) {
    return props.children
  } else {
    return <><Loading /></>
  }
};

export default Protected;
