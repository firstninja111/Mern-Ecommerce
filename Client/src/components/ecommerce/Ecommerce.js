import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/css";
import {
  Link,
} from "@mui/material";
import EcommerceSamplePage from "../../images/ecommerce_sample_page.png";
import StaffAvatar from "../../images/staff_avatar.png";

import ACTION_IS_ECOMMERCEPAGE_NOT_ACTIVE from "../../actions/Ecommerce/ACTION_IS_ECOMMERCEPAGE_NOT_ACTIVE";
import ACTION_IS_ECOMMERCE_MEETNOW_ACTIVE from "../../actions/Ecommerce/ACTION_IS_ECOMMERCE_MEETNOW_ACTIVE";
import ACTION_CART_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_CART_PAGE_OPENED";
import ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED";
import ACTION_CART_IS_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_ACTIVE";
import ACTION_CART_IS_NOT_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_NOT_ACTIVE";
import ACTION_SELECTED_ESTHETICIAN from "../../actions/SelectedEsthetician/ACTION_SELECTED_ESTHETICIAN";

import "./Ecommerce.css";
const Ecommerce = React.forwardRef((props, ref) => {
  const {
    currentScreenSize,
    initialScreenSize,
    selectedStore,
    getAllStoresData,
    getAllStoresRefetch,
    getAllStoresLoading,
    getAllStoresError,
    changeSelectedStore, // will be deleted
    getEmployeesData,
    getEmployeesError,
    getEmployeesRefetch,
    getEmployeesLoading,
    getClientsData,
    getClientsRefetch,
    getClientsLoading,
    getClientsError,
  } = props;
  const dispatch = useDispatch();
  const [widgetActive, changeWidgetActive] = useState(false);

  const cartIsActive = useSelector((state) => state.cartIsActive.cartIsActive);
  const cartPageOpened = useSelector(
    (state) => state.cartPageOpened.cart_page_opened
  );

  const [myLocation, changeMyLocation] = useState({lat: 0, lng: 0});

  useEffect(() => {
    if (getAllStoresError) {
      getAllStoresRefetch();
    }
  }, [getAllStoresError, getAllStoresRefetch]);

  useEffect(() => {
    if (getEmployeesError) {
      getEmployeesRefetch();
    }
  }, [getEmployeesError, getEmployeesRefetch]);

  useEffect(() => {
    if (getClientsError) {
      getClientsRefetch();
    }
  }, [getClientsError, getClientsRefetch]);


  useEffect(() => {
    setTimeout(() => {
      getPosition();
    }, 1500)
  }, []);

  // If browser supports navigator.geolocation, generate Lat/Long else let user know there is an error
  const getPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, posError); // Passing in a success callback and an error callback fn
    } else {
      alert("Sorry, Geolocation is not supported by this browser."); // Alert is browser does not support geolocation
    }
  }
  // Geolocation error callback fn. Query permissions to check if the error occured due to user not allowing location to be shared
  const posError = () => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then(res => {
        if (res.state === "denied") {
          alert("Enable location permissions for this website in your browser settings.")
        }
      })
    } else {
    alert("Unable to access your location. You can continue by submitting location manually.") // Obtaining Lat/long from address necessary
    }
  }
  // Geolocation success callback fn
  const showPosition = (position) => {
    let lat = position.coords.latitude // You have obtained latitude coordinate!
    let long = position.coords.longitude // You have obtained longitude coordinate!
    getAddress(lat, long, process.env.REACT_APP_GOOGLE_MAPS_API_KEY) // Will convert lat/long to City, State, & Zip code
  }
  // Converting lat/long from browser geolocation into city, state, and zip code using Google Geocoding API
  const getAddress = (lat, long, googleKey) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${googleKey}`)
    .then(res => res.json())
    .then(address => setMyCurrentLocation(address))
  }

  const setMyCurrentLocation = (address) => {
    changeMyLocation({
      lat: address.results[2].geometry.location.lat,
      lng: address.results[2].geometry.location.lng,
    })
  }

  const purchaseInStore = () => {
    changeWidgetActive(false);
    if (currentScreenSize === "") {
      if (initialScreenSize >= 1200) {
        if (cartIsActive) {
          cartDeactivated();
        } else {
          cartActivated();
          if (!cartPageOpened) {
            dispatch(ACTION_CART_PAGE_OPENED());
          }
        }
      } else {
        cartActivated();
        if (!cartPageOpened) {
          dispatch(ACTION_CART_PAGE_OPENED());
        }
      }
    } else {
      if (currentScreenSize >= 1200) {
        if (cartIsActive) {
          cartDeactivated();
        } else {
          cartActivated();
          if (!cartPageOpened) {
            dispatch(ACTION_CART_PAGE_OPENED());
          }
        }
      } else {
        cartActivated();
        if (!cartPageOpened) {
          dispatch(ACTION_CART_PAGE_OPENED());
        }
      }
    }
  }

  const calculateRelationDistance = (position, store) => {
    var R = 10000000; //3958.8;
    var rlat1 = position.lat * (Math.PI/180);
    var rlat2 = store.coordinateLat * (Math.PI/180);
    var difflat = rlat2-rlat1;
    var difflon = (store.coordinateLng-position.lng) * (Math.PI/180);
    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2))).toFixed(4);
    return d;
  };

  

  const meetNow = () => {
    changeWidgetActive(false);

    let shortestDistance = 0;
    let nearestStore = getAllStoresData.all_stores.length > 1 ? getAllStoresData.all_stores[0] : null;

    if(getAllStoresData.all_stores.length > 1){
      getAllStoresData.all_stores.forEach( e => {
        const distance = calculateRelationDistance(myLocation, e);
        if(shortestDistance > distance){
          shortestDistance = distance;
          nearestStore = e;
        }
      })
    }

    changeSelectedStore(nearestStore);

    dispatch(
      ACTION_SELECTED_ESTHETICIAN(
        ""
      )
    )

    setTimeout(() => {
      dispatch(ACTION_IS_ECOMMERCE_MEETNOW_ACTIVE());

      if (currentScreenSize === "") {
        if (initialScreenSize >= 1200) {
          if (cartIsActive) {
            cartDeactivated();
          } else {
            cartActivated();
            if (!cartPageOpened) {
              dispatch(ACTION_CART_PAGE_OPENED());
            }
          }
        } else {
          cartActivated();
          if (!cartPageOpened) {
            dispatch(ACTION_CART_PAGE_OPENED());
          }
        }
      } else {
        if (currentScreenSize >= 1200) {
          if (cartIsActive) {
            cartDeactivated();
          } else {
            cartActivated();
            if (!cartPageOpened) {
              dispatch(ACTION_CART_PAGE_OPENED());
            }
          }
        } else {
          cartActivated();
          if (!cartPageOpened) {
            dispatch(ACTION_CART_PAGE_OPENED());
          }
        }
      }
      dispatch(ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED());
    }, 1000);
  };

  const cartActivated = () => {
    dispatch(ACTION_CART_IS_ACTIVE());
    document.body.style.setProperty("background", "rgb(255, 255, 255)");
  };
  
  const cartDeactivated = () => {
      dispatch(ACTION_CART_IS_NOT_ACTIVE());
  };

  return (
    <div className="ecommerce_page_container">
      <div onClick={(e) => changeWidgetActive(true)}>
        <img
          className="ecommerce_background_image"
          src={EcommerceSamplePage}
          alt="ecommerce page"
        />
      </div>

      <div
        className={`widget_background ${
          widgetActive ? "widget_background_active" : ""
        }`}
        onClick={(e) => changeWidgetActive(false)}
      ></div>

      <div
        className={`widget_container gradient-block ${
          widgetActive ? "widget_container_active" : ""
        }`}
      >
        <div className="widget_body">
          <div className="staff_avatar">
            <img className="" src={StaffAvatar} alt="staff avatar" />
          </div>
          <div className="widget_main_content">
            <p className="widget_title">An agent, iPhone Specialist at Shop Ixelles is available to assist you.</p>
            <div className="widget_button_group">
              <Link
                to={
                    cartIsActive
                    ? location.pathname
                    : cartPageOpened === "Cart"
                    ? "/availability" // remove cart page
                    : cartPageOpened === "Availability"
                    ? "/availability"
                    : cartPageOpened === "TimePreference"
                    ? "/availability/timepreference"
                    : cartPageOpened === "GuestCheckout"
                    ? "/checkout"
                    : cartPageOpened === "PaymentInfo"
                    ? "/paymentinfo"
                    : cartPageOpened === "ConfirmationPage"
                    ? "/checkout/confirmation"
                    : "/availability"
                }
                aria-label="Shopping Cart"
                onClick={meetNow}
                style={{textDecoration: "none"}}
              >
                <div className="widget_button">
                  Meet an agent now!
                </div>
              </Link>
              <div 
                className="widget_button widget_second_button"
                onClick={purchaseInStore}
              >
                Purchase and obtain advice in a store
              </div>
            </div>
          </div>
          <div>
            <FontAwesomeIcon
              className="close_widget"
              icon={faTimesCircle}
              onClick={(e) => changeWidgetActive(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Ecommerce;
