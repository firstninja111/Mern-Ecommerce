import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link, useLocation, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { animateScroll } from "react-scroll";
import AllServices from "./AllServices/AllServices"
import StoreSelect from "../store_select/StoreSelect";
import ACTION_CART_IS_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_ACTIVE";
import ACTION_CART_PAGE_RESET from "../../actions/InCart/CartPageOpened/ACTION_CART_PAGE_RESET";
import ACTION_AVAILABILITY_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_AVAILABILITY_PAGE_OPENED";
import ACTION_CART_IS_NOT_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_NOT_ACTIVE";
import ACTION_AVAILABILITY_CLICKED from "../../actions/AvailabilityClicked/ACTION_AVAILABILITY_CLICKED";

import "./ShoppingCart.css";

const ShoppingCart = (props) => {
  const dispatch = useDispatch();
  let location = useLocation();

  const {
    currentScreenSize,
    initialScreenSize,
    resetAllCartStates,
    getAllServicesData,
    getAllServicesRefetch,
    getAllServicesLoading,
    getAllServicesError,
    selectedServiceName,
    changeSelectedServiceName,
    selectedStore,
    changeSelectedStore,
    getAllStoresData,
    getAllStoresRefetch,
    getAllStoresLoading,
    getAllStoresError,
  } = props;

  const shoppingCartRef = useRef(null);

  const availabilityClicked = useSelector(
    (state) => state.availabilityClicked.availabilityClicked
  );
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );

  const [isStoreSelectPage, changeIsStoreSelectPage] = useState(false);

  useEffect(() => {
    if (getAllServicesError) {
      getAllServicesRefetch();
    }
  }, [getAllServicesError, getAllServicesRefetch]);

  useEffect(() => {
    if (getAllStoresError) {
      getAllStoresRefetch();
    }
  }, [getAllStoresError, getAllStoresRefetch]);

  useEffect(() => {
    if(selectedServiceName) changeIsStoreSelectPage(true)
  }, [])

  const redirectToHome = () => {
    if (!splashScreenComplete) {
      return <Redirect to="/" />;
    } else if (!props.currentScreenSize) {
      if (props.initialScreenSize >= 1200) {
        if (location.pathname !== "/") {
          return <Redirect to="/" />;
        }
      }
    } else if (props.currentScreenSize >= 1200) {
      if (location.pathname !== "/") {
        return <Redirect to="/" />;
      }
    }
  };

  const backToHome = () => {
    if(isStoreSelectPage) {
      changeIsStoreSelectPage(false);
    } else {
      dispatch(ACTION_CART_IS_NOT_ACTIVE());
      dispatch(ACTION_CART_PAGE_RESET());
    }
    
  };

  const clickNext = () => {
    if(isStoreSelectPage) {
      dispatch(ACTION_AVAILABILITY_PAGE_OPENED());
      availabilityHasBeenClicked();
    } else {
      changeIsStoreSelectPage(true);
    }
  }

  const availabilityHasBeenClicked = () => {
    dispatch(ACTION_AVAILABILITY_PAGE_OPENED());
    if (!availabilityClicked) {
      dispatch(ACTION_AVAILABILITY_CLICKED());
      document.body.style.setProperty("background", "rgb(255, 255, 255)");
    }
  };

  useEffect(() => {
    if (location.pathname.includes("cart")) {
      animateScroll.scrollToTop({ containerId: "shopping_cart", offset: -500 });
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch(ACTION_CART_IS_ACTIVE());
    return () => {
      if (!props.currentScreenSize) {
        if (props.initialScreenSize < 1200) {
          dispatch(ACTION_CART_IS_NOT_ACTIVE());
        }
      } else if (props.currentScreenSize < 1200) {
        dispatch(ACTION_CART_IS_NOT_ACTIVE());
      }
    };
  }, [dispatch, props.currentScreenSize, props.initialScreenSize]);

  useEffect(() => {
    window.addEventListener("popstate", () => {
      if (document.location.href.includes("availability")) {
        dispatch(ACTION_AVAILABILITY_PAGE_OPENED());
      }
    });
  }, [dispatch]);

  return (
    <div
      className="shopping_cart_container"
      id="shopping_cart"
      ref={shoppingCartRef}
    >
      {redirectToHome()}
      <div
        className="shopping_cart_header"
        style={{
          borderBottom: "1px solid rgb(44, 44, 52)",
        }}
      >
        <Link
          to={location.pathname.includes("account") ? location.pathname : "/"}
          onClick={backToHome}
        >
          <FontAwesomeIcon
            className="shopping_cart_back_arrow"
            icon={faChevronLeft}
          />
        </Link>
        <h1>{!isStoreSelectPage ? "SELECT THE SERVICE" : "SELECT THE STORE" }</h1>
        <Link
          to={
            isStoreSelectPage
            ? !props.currentScreenSize
              ? props.initialScreenSize >= 1200
                ? "/"
                : "/availability"
              : props.currentScreenSize >= 1200
              ? "/"
              : "/availability"
            : ""
          }
          onClick={clickNext}
        >
          <FontAwesomeIcon
            className="shopping_cart_forward_arrow"
            style={{ 
              display: isStoreSelectPage
              ? selectedStore ? "block" : "none"
              : selectedServiceName ? "block" : "none" 
            }}
            icon={faChevronRight}
          />
        </Link>
      </div>
      <div className="cart_select_service_container">
        {!isStoreSelectPage 
          ? <AllServices
            name="services"
            currentScreenSize={currentScreenSize}
            initialScreenSize={initialScreenSize}
            resetAllCartStates={resetAllCartStates}
            getAllServicesData={getAllServicesData}
            getAllServicesRefetch={getAllServicesRefetch}
            getAllServicesLoading={getAllServicesLoading}
            getAllServicesError={getAllServicesError}
            selectedServiceName={selectedServiceName}
            changeSelectedServiceName={changeSelectedServiceName}
          />
        : <StoreSelect
            getAllServicesData={getAllServicesData}
            getAllServicesRefetch={getAllServicesRefetch}
            getAllServicesLoading={getAllServicesLoading}
            getAllServicesError={getAllServicesError}
            selectedServiceName={selectedServiceName}
            selectedStore={selectedStore}
            changeSelectedStore={changeSelectedStore}
            resetAllCartStates={resetAllCartStates}
            getAllStoresData={getAllStoresData}
            getAllStoresRefetch={getAllStoresRefetch}
            getAllStoresLoading={getAllStoresLoading}
            getAllStoresError={getAllStoresError}
          />
        }
      </div>
    </div>
  );
};

export default ShoppingCart;
