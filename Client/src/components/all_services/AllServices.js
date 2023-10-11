import React, { useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Suspense } from "react";
import { Spring } from "react-spring/renderprops";
import { useInView } from "react-intersection-observer";
import { css } from "@emotion/css";
import ACTION_LOADING_SPINNER_RESET from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_LOADING_SPINNER_ACTIVE from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import "./AllServices.css";

const AllServices = React.forwardRef((props, ref) => {
  const {
    currentScreenSize,
    initialScreenSize,
    resetAllCartStates,
    name,
    getAllServicesData,
    getAllServicesRefetch,
    getAllServicesLoading,
    getAllServicesError,
    selectedServiceName,
    changeSelectedServiceName,
  } = props;

  const dispatch = useDispatch();

  const servicesHeaderRef = useRef(null);

  // Lazy-loaded Treatments
  const ServiceCard = useMemo(
    () => React.lazy(() => import("./ServiceCard")),
    []
  );

  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );
  const imageLoading = useSelector((state) => state.imageLoading.image_loading);

  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: initialScreenSize >= 1200 ? 0.7 : 0.2,
  });

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  useEffect(() => {
    if (getAllServicesLoading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    } else {
      dispatch(ACTION_LOADING_SPINNER_RESET());
    }
  }, [dispatch, getAllServicesLoading]);

  useEffect(() => {
    if (getAllServicesError) {
      getAllServicesRefetch();
    }
  }, [getAllServicesError, getAllServicesRefetch]);

  return (
    <>
      <div className="selected_product_info">
        <div>
          <p className="selected_product_info_title">Apple iPhone 11</p>
          <p>with subscription</p>
        </div>
        <div className="selected_product_info_price">As from $49</div>
      </div>  
      <div className="all_treatments_container" id={name}>
        <header className="all_treatments_header" ref={inViewRef}>
          {inView ? (
            <Spring
              from={{
                position: "relative",
                opacity: 0,
              }}
              to={{
                position: "relative",
                opacity: 1,
              }}
              config={{ duration: 1000 }}
            >
              {(styles) => (
                <>
                  <h2
                    style={{
                      position: `${styles.position}`,
                      opacity: `${styles.opacity}`,
                    }}
                    ref={servicesHeaderRef}
                  >
                    Welcome
                  </h2>
                  <span
                    style={{
                      position: `${styles.position}`,
                      opacity: `${styles.opacity}`,
                      width: servicesHeaderRef.current
                        ? servicesHeaderRef.current.clientWidth + "px"
                        : "0px",
                    }}
                    className="treatments_title_underline"
                  />
                  <br />
                  <h3
                    style={{
                      position: `${styles.position}`,
                      opacity: `${styles.opacity}`,
                    }}
                  >
                    <p>
                      We appreciate your interest in our products. Are there additional services you would like to obtain or purchase during your visit?
                    </p>
                  </h3>
                </>
              )}
            </Spring>
          ) : null}
        </header>
        {getAllServicesData
          ? getAllServicesData.all_services.length > 0
              ? getAllServicesData.all_services.sort((a, b) => a.name.localeCompare(b.name))
                .map((item, i) => {
                  return (
                    <Suspense key={i} fallback={<></>}>
                      <ServiceCard
                        item={item}
                        selectedServiceName={selectedServiceName}
                        changeSelectedServiceName={changeSelectedServiceName}
                        initialScreenSize={initialScreenSize}
                        currentScreenSize={currentScreenSize}
                        resetAllCartStates={resetAllCartStates}
                      />
                    </Suspense>
                  )
                })
            : null
          : null
        }
      </div>
    </>
    
  );
});

export default AllServices;
