/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef } from "react";
import "./style.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signout } from "../../services/login/signout";
import { getEmployeeDetails } from "../../services/employees/employee-details";
import { mapNavbarData } from "../../data/navbarData";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../services/notifications";
import { useDispatch, useSelector } from "react-redux";
import { navbarActions } from "../../redux/reducers/other";
import { isHeaderHidden } from "../../utils/isHeaderHidden";
import { employeeActions } from "../../redux/reducers/employee";
import { BsDatabaseAdd } from "react-icons/bs";
import { BsDatabaseDown } from "react-icons/bs";

const navicons = {
  home_icon: () => <ion-icon name="home-outline"></ion-icon>,
  employees_icon: () => <ion-icon name="people-outline"></ion-icon>,
  departments_icon: () => <ion-icon name="cellular-outline"></ion-icon>,
  balance_icon: () => <ion-icon name="cash-outline"></ion-icon>,
  projects_icon: () => <ion-icon name="albums-outline"></ion-icon>,
  tasks_icon: () => <ion-icon name="checkbox-outline"></ion-icon>,
  profile_icon: () => <ion-icon name="person-outline"></ion-icon>,
  logout_icon: () => <ion-icon name="log-out-outline"></ion-icon>,
  cdata_icon: () => (
    <BsDatabaseAdd
      size={35}
      color="white"
      onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
      onMouseOut={(e) => (e.currentTarget.style.color = "white")}
    />
  ),
  gdata_icon: () => (
    <BsDatabaseDown
      size={35}
      color="white"
      onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
      onMouseOut={(e) => (e.currentTarget.style.color = "white")}
    />
  ),
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;
  const [headerData, setHeaderData] = useState(mapNavbarData({}));
  const navRef = useRef(null);
  const { isActive: isNavActive, isHidden } = useSelector(
    (state) => state.navbar
  );
  const dispatch = useDispatch();

  const handleLogout = () => {
    signout();
    navigate("/login");
    sendSuccessNotification("Logout successfully");
  };

  const handleItemClick = (item) => {
    item.className = "hovered";
    const list = headerData.navbarItems.map((navItem) => {
      if (item.id === navItem.id) {
        return item;
      }
      navItem.className = "";
      return navItem;
    });
    setHeaderData((prev) => ({
      ...prev,
      navbarItems: list,
    }));
  };

  const syncEmployeeDetails = async () => {
    const response = await getEmployeeDetails();
    if (response.status === "unauthorized") {
      signout();
      navigate("/login");
      sendErrorNotification("Session expired login again!");
    }
    dispatch(employeeActions.setLoggedInEmployee(response?.body?.employee));
    setHeaderData(mapNavbarData(response?.body?.employee));
  };

  // useEffect(()=>{
  //     if(!isHidden){
  //         syncEmployeeDetails();
  //     }
  // },[isHidden])

  useEffect(() => {
    dispatch(navbarActions.setHeaderHidden(isHeaderHidden(pathName)));
  }, [pathName]);

  const closeOpenMenus = (e) => {
    if (navRef.current && isNavActive && !navRef.current.contains(e.target)) {
      dispatch(navbarActions.setIsActive(!isNavActive));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeOpenMenus);
  });

  return !isHidden ? (
    <div className={`navigation ${!isNavActive ? "active" : ""}`} ref={navRef}>
      <ul>
        <li>
          <Link to={"/"}>
            <span className="icon"></span>
            <span className="title brand">Advertrone</span>
          </Link>
        </li>

        {headerData.navbarItems.map((item) => (
          <li
            key={item.id}
            className={
              item.paths.includes(pathName.split("/")[1]) ? "hovered" : ""
            }
            onClick={() => handleItemClick(item)}
          >
            <Link to={item.to}>
              <span className="icon">{navicons[item.icon]()}</span>
              <span className="title">{item.title}</span>
            </Link>
          </li>
        ))}

        <li onClick={handleLogout}>
          <Link to={"/"}>
            <span className="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </span>
            <span className="title">Sign out</span>
          </Link>
        </li>
      </ul>
    </div>
  ) : null;
};

export default Navbar;
