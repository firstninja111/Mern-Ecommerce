import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from "body-scroll-lock";
import { useSelector, useDispatch } from "react-redux";
import { Spring } from "react-spring/renderprops";
import SplashScreen from "./SplashScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import ACTION_BODY_SCROLL_ALLOW from "../../actions/Body_Scroll/ACTION_BODY_SCROLL_ALLOW";
import ACTION_USER_SCROLLED from "../../actions/Scroll/ACTION_USER_SCROLLED";
import ACTION_USER_SCROLLED_RESET from "../../actions/Scroll/ACTION_USER_SCROLLED_RESET";
import ACTION_NAVBAR_IS_VISIBLE from "../../actions/NavbarIsVisible/ACTION_NAVBAR_IS_VISIBLE";
import ACTION_SPLASH_SCREEN_COMPLETE from "../../actions/SplashScreenComplete/ACTION_SPLASH_SCREEN_COMPLETE";
import ACTION_SPLASH_SCREEN_HALFWAY from "../../actions/SplashScreenHalfway/ACTION_SPLASH_SCREEN_HALFWAY";
import ACTION_TOUCH_SCALING_ACTIVE from "../../actions/FingerTouchScaling/ACTION_TOUCH_SCALING_ACTIVE";
import ACTION_TOUCH_SCALING_RESET from "../../actions/FingerTouchScaling/ACTION_TOUCH_SCALING_RESET";
import ACTION_LOGIN_IS_NOT_ACTIVE from "../../actions/Login/ACTION_LOGIN_IS_NOT_ACTIVE";
import { useLocation } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = React.forwardRef((props, ref) => {
  const { LandingPageRef } = ref;
  const {
    currentScreenSize,
    initialScreenSize,
    scrollValue,
    treatmentsPageInView,
    name,
    handleClickToScrollToTreatments,
    initialScreenHeight,
    currentScreenHeight,
  } = props;

  const [lineRenderScroll, setLineRenderScroll] = useState(false);
  const [twoFingerTouch, changeTwoFingerTouch] = useState(false);

  const location = useLocation();

  const navbarToggle = useSelector((state) => state.navbarToggle.toggle);
  const bodyScrollToggle = useSelector(
    (state) => state.bodyScrollToggle.overflow
  );
  const scroll = useSelector((state) => state.scrollToggle.scroll);
  const cartIsActive = useSelector((state) => state.cartIsActive.cartIsActive);
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );
  const splashScreenHalfway = useSelector(
    (state) => state.splashScreenHalfway.splashScreenHalfway
  );
  const touchScaling = useSelector(
    (state) => state.fingerTouchScaling.touch_scaling
  );
  const finalBookingModal = useSelector(
    (state) => state.finalBookingModal.final_booking_modal
  );

  // For comparison after splash screen halfway point
  const [
    currentOrientationSnapshot,
    changeCurrentOrientationSnapshot,
  ] = useState(null);

  const dispatch = useDispatch();

  const handleSplashScreenHalfway = (el) => {
    if (
      Number(el.top.substr(0, 3)) === 100 ||
      Number(el.right.substr(0, 3)) === 100
    ) {
      changeCurrentOrientationSnapshot(currentScreenSize);
    } else {
      if (!splashScreenHalfway) {
        dispatch(ACTION_SPLASH_SCREEN_HALFWAY());
      } else {
        if (currentOrientationSnapshot !== currentScreenSize) {
          dispatch(ACTION_SPLASH_SCREEN_COMPLETE());
          dispatch(ACTION_BODY_SCROLL_ALLOW());
        }
      }
    }
  };

  useEffect(() => {
    dispatch(ACTION_LOGIN_IS_NOT_ACTIVE());
  }, [dispatch]);

  useMemo(() => {
    if (location.pathname === "/") {
      dispatch(ACTION_NAVBAR_IS_VISIBLE());
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (splashScreenHalfway) {
      if (initialScreenSize >= 600) {
        if (currentOrientationSnapshot !== currentScreenSize) {
          dispatch(ACTION_SPLASH_SCREEN_COMPLETE());
          dispatch(ACTION_BODY_SCROLL_ALLOW());
        }
      }
    }
  }, [
    currentOrientationSnapshot,
    currentScreenSize,
    initialScreenSize,
    splashScreenHalfway,
    dispatch,
  ]);

  const changeScroll = useCallback(() => {
    const userScroll = !currentScreenSize
      ? initialScreenSize >= 600
        ? scrollValue < 50
        : scrollValue < 345
      : currentScreenSize >= 600
      ? scrollValue < 50
      : scrollValue < 345;

    if (!userScroll) {
      dispatch(ACTION_USER_SCROLLED());
    } else {
      dispatch(ACTION_USER_SCROLLED_RESET());
    }

    if (treatmentsPageInView) {
      setLineRenderScroll(true);
    } else {
      setLineRenderScroll(false);
    }
  }, [
    dispatch,
    treatmentsPageInView,
    currentScreenSize,
    initialScreenSize,
    scrollValue,
  ]);

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();

    if (bodyScrollToggle === "visible") {
      document.body.classList.remove("no_scroll");
      if (!navbarToggle) {
        document.body.classList.remove("no_scroll_no_fixed");
      }
      if (splashScreenComplete) {
        document.body.classList.add("scroll_reset");
      } else {
        document.body.classList.remove("scroll_reset");
        document.body.classList.add("no_scroll");
      }
    } else if (bodyScrollToggle === "hidden") {
      document.body.classList.remove("scroll_reset");
      if (!navbarToggle) {
        document.body.classList.add("no_scroll_no_fixed");
      } else {
        document.body.classList.add("no_scroll");
      }

      // Required for iOS Landscape Scroll Disabling During Splash Screen
      if (!splashScreenComplete) {
        if (LandingPageRef) {
          LandingPageRef.current.addEventListener(
            "touchmove",
            preventScroll,
            false
          );
          setTimeout(
            () =>
              LandingPageRef.current.removeEventListener(
                "touchmove",
                preventScroll,
                false
              ),
            initialScreenSize >= 600 ? 3800 : 2400
          );
        }
      }
    }
  }, [
    bodyScrollToggle,
    LandingPageRef,
    splashScreenComplete,
    initialScreenSize,
    currentScreenSize,
    navbarToggle,
    cartIsActive,
  ]);

  useEffect(() => {
    document.addEventListener("scroll", changeScroll);
    return () => {
      document.removeEventListener("scroll", changeScroll);
    };
  }, [scroll, changeScroll]);

  useEffect(() => {
    const LandingPageRefTargetElement = LandingPageRef.current;

    if (!splashScreenComplete) {
      const handleDisableScroll = (el) => {
        disableBodyScroll({ targetElement: el });
      };

      handleDisableScroll(LandingPageRefTargetElement);
    } else {
      if (!cartIsActive) {
        const handleEnableScroll = (el) => {
          if (splashScreenComplete && !cartIsActive) {
            enableBodyScroll({ targetElement: el });
          }
        };

        handleEnableScroll(LandingPageRefTargetElement);
      }
    }

    if (!splashScreenComplete) {
      let bodyScrollTimer = setTimeout(
        () => {
          dispatch(ACTION_BODY_SCROLL_ALLOW());
          dispatch(ACTION_SPLASH_SCREEN_COMPLETE());
        },
        !currentScreenSize
          ? initialScreenSize >= 600
            ? 3800
            : 2400
          : initialScreenSize >= 600
          ? currentScreenSize >= 600
            ? 3800
            : 2400
          : currentScreenSize >= 600
          ? 3800
          : 2400
      );

      return () => {
        clearAllBodyScrollLocks();
        clearTimeout(bodyScrollTimer);
      };
    } else {
      clearAllBodyScrollLocks();
    }
  }, [
    dispatch,
    initialScreenSize,
    currentScreenSize,
    LandingPageRef,
    splashScreenComplete,
    cartIsActive,
  ]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      if (!twoFingerTouch) {
        changeTwoFingerTouch(true);
      }
    }
  };

  const handleTouchMove = () => {
    if (twoFingerTouch) {
      if (!touchScaling) {
        dispatch(ACTION_TOUCH_SCALING_ACTIVE());
      }
    }
  };

  const handleTouchEnd = () => {
    if (twoFingerTouch) {
      changeTwoFingerTouch(false);
      if (touchScaling) {
        dispatch(ACTION_TOUCH_SCALING_RESET());
      }
    }
  };

  return (
    <div
      className="landing_page_container"
      ref={LandingPageRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        background: splashScreenHalfway
          ? "rgb(224, 224, 232)"
          : "rgb(245, 245, 245)",
        // transition: "background 2s ease-out",
        zIndex: finalBookingModal ? -1 : "auto",
        height: splashScreenComplete
              ? "0" : "100vh",
      }}
      id={name}
    >
      <section className="main_content">
        <Spring
          from={{
            top: !currentScreenSize
              ? "100%"
              : // Detect portrait mode or landscape
              initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "0%"
                : "100%"
              : currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? "0%"
              : "0%",
            right: !currentScreenSize
              ? "100%"
              : initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "100%"
                : "0%"
              : currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? "100%"
              : "0%",
          }}
          to={{
            top: !currentScreenSize
              ? initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "0%"
                : "50%"
              : initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "0%"
                : "50%"
              : currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? "0%"
              : "50%",
            right: !currentScreenSize
              ? initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "50%"
                : "0%"
              : initialScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
                ? "50%"
                : "0%"
              : currentScreenSize >= 550 &&
                window.matchMedia("(orientation: landscape)").matches
              ? "50%"
              : "0%",
          }}
          onFrame={(el) => handleSplashScreenHalfway(el)}
          config={{
            delay: !currentScreenSize
              ? initialScreenSize >= 550
                ? 1200
                : 500
              : currentScreenSize >= 550
              ? 1200
              : 500,
            duration: 1800,
          }}
        >
          {(styles) => (
            <div
              className="bottom_content"
              style={{
                top: splashScreenComplete
                  ? !currentScreenSize
                    ? initialScreenSize >= 550 &&
                      window.matchMedia("(orientation: landscape)").matches
                      ? "0%"
                      : "50%"
                    : currentScreenSize >= 550 &&
                      window.matchMedia("(orientation: landscape)").matches
                    ? "0%"
                    : "50%"
                  : !currentScreenSize
                  ? initialScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                    ? "0%"
                    : `${styles.top}`
                  : initialScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                  ? currentScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                    ? "0%"
                    : `${styles.top}`
                  : currentScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                  ? "0%"
                  : `${styles.top}`,
                right: splashScreenComplete
                  ? !currentScreenSize
                    ? initialScreenSize >= 550 &&
                      window.matchMedia("(orientation: landscape)").matches
                      ? "50%"
                      : "0%"
                    : currentScreenSize >= 550 &&
                      window.matchMedia("(orientation: landscape)").matches
                    ? "50%"
                    : "0%"
                  : !currentScreenSize
                  ? initialScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                    ? `${styles.right}`
                    : "0%"
                  : initialScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                  ? currentScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                    ? `${styles.right}`
                    : "0%"
                  : currentScreenSize >= 550 &&
                    window.matchMedia("(orientation: landscape)").matches
                  ? `${styles.right}`
                  : "0%",
              }}
            >
              {/* <Spring
                from={{ opacity: 0 }}
                to={{ opacity: 1 }}
                config={{
                  delay: !currentScreenSize
                    ? initialScreenSize >= 550
                      ? 3000
                      : 2350
                    : initialScreenSize >= 550
                    ? currentScreenSize >= 550
                      ? 3000
                      : 2350
                    : 2350,
                  duration: 500,
                }}
              >
                {(styleopacity) => (
                  <div
                    className="landing_page_text_block"
                    style={{
                      zIndex:
                        currentScreenSize === ""
                          ? initialScreenSize <= 1000 &&
                            initialScreenSize >= 550
                            ? scrollValue <= 2
                              ? navbarToggle
                                ? "1"
                                : "500"
                              : "1"
                            : "1"
                          : currentScreenSize <= 1000 &&
                            currentScreenSize >= 550
                          ? scrollValue <= 2
                            ? navbarToggle
                              ? "1"
                              : "500"
                            : "1"
                          : "1",
                    }}
                  >
                    <h1
                      style={{
                        opacity: splashScreenComplete
                          ? "1"
                          : `${styleopacity.opacity}`,
                      }}
                    >
                      Customized skin care,
                      <br /> down to a science.
                    </h1>
                    <p
                      className="landing_page_description"
                      style={{
                        opacity: splashScreenComplete
                          ? "1"
                          : `${styleopacity.opacity}`,
                      }}
                    >
                      We've reimagined the traditional idea of a facial so that
                      we can do the thinking for you. Lay back, relax, and
                      listen to that Peruvian pan flute music. <br />
                      We'll figure out the rest.
                    </p>
                    <div
                      className="call_to_action_buttons_container"
                      style={{
                        opacity: splashScreenComplete
                          ? "1"
                          : `${styleopacity.opacity}`,
                      }}
                    >
                      <div
                        className="call_to_action_button"
                        style={{
                          opacity: splashScreenComplete
                            ? "1"
                            : `${styleopacity.opacity}`,
                        }}
                      >
                        <p
                          onClick={() => handleClickToScrollToTreatments("cta")}
                        >
                          GET STARTED NOW
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        opacity: splashScreenComplete
                          ? "1"
                          : `${styleopacity.opacity}`,
                      }}
                      className="landing_page_cta"
                      onClick={() => handleClickToScrollToTreatments("cta")}
                    >
                      <FontAwesomeIcon
                        className="landing_page_bottom_icon"
                        icon={faChevronDown}
                        style={{ opacity: lineRenderScroll ? 0 : 1 }}
                      />
                    </div>
                  </div>
                )}
              </Spring> */}
            </div>
          )}
        </Spring>
        <div 
          className="splash_screen"
          style={{
            display: splashScreenComplete
              ? "none"
              : "flex",
          }}
        >
          <SplashScreen
            currentScreenHeight={currentScreenHeight}
            initialScreenHeight={initialScreenHeight}
          />
          {/* Need for Lighthouse Not to Throw NO_LCP Error */}
          <h1 style={{ position: "absolute", zIndex: -1 }}>CHOIREDEX</h1>
        </div>
      </section>
    </div>
  );
});

export default LandingPage;
