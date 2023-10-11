import React, { useEffect, useMemo } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import AdminLoginPage from "./AdminLogin/AdminLoginPage";
import AdminMenu from "./AdminMenu/AdminMenu";
import AdminClients from "./AdminClients/AdminClients";
import AdminSchedule from "./AdminSchedule/AdminSchedule";
import AdminStaff from "./AdminStaff/AdminStaff";
import AdminService from "./AdminService/AdminService";
import AdminStore from "./AdminStore/AdminStore";
import AdminAgenda from "./AdminAgenda/AdminAgenda";
import AdminUpcomingNotifications from "./AdminUpcomingNotifications/AdminUpcomingNotifications";
import AdminCheckedInNotifications from "./AdminCheckedInNotifications/AdminCheckedInNotifications";
import AdminInProgressNotifications from "./AdminInProgressNotifications/AdminInProgressNotifications";
import AdminHistoryNotifications from "./AdminHistoryNotifications/AdminHistoryNotifications";
import AdminNotifications from "./AdminNotifications/AdminNotifications";
import { useMutation, useQuery } from "@apollo/react-hooks";
import getAllServicesQuery from "../../graphql/queries/getAllServicesQuery";
import getAllStoresQuery from "../../graphql/queries/getAllStoresQuery";
import getClientsQuery from "../../graphql/queries/getClientsQuery";
import getAllAppointmentsQuery from "../../graphql/queries/getAllAppointmentsQuery";
import getAllPersonalEventsQuery from "../../graphql/queries/getAllPersonalEventsQuery";
import resetNotificationsMutation from "../../graphql/mutations/resetNotificationsMutation";
import randomColor from "randomcolor";
import LargeScreenSideMenu from "../account/LargeScreenSideMenu/LargeScreenSideMenu";
import { Font } from "@react-pdf/renderer";
import { useDispatch, useSelector } from "react-redux";
// Font Relative Imports
import MontserratLightSrc from "../../MontserratFont/ttf/Montserrat-Light.ttf";
import MontserratRegularSrc from "../../MontserratFont/ttf/Montserrat-Regular.ttf";
import MontserratMediumSrc from "../../MontserratFont/ttf/Montserrat-Medium.ttf";
import MontserratSemiBoldSrc from "../../MontserratFont/ttf/Montserrat-SemiBold.ttf";
import MontserratBoldSrc from "../../MontserratFont/ttf/Montserrat-Bold.ttf";
import MontserratBlackSrc from "../../MontserratFont/ttf/Montserrat-Black.ttf";
import ACTION_ON_ACTIVITY_PAGE from "../../actions/Admin/OnActivityPage/ACTION_ON_ACTIVITY_PAGE";
import ACTION_ON_UPCOMING_PAGE from "../../actions/Admin/OnUpcomingPage/ACTION_ON_UPCOMING_PAGE";
import ACTION_SPLASH_SCREEN_COMPLETE from "../../actions/SplashScreenComplete/ACTION_SPLASH_SCREEN_COMPLETE";
import ACTION_SPLASH_SCREEN_HALFWAY from "../../actions/SplashScreenHalfway/ACTION_SPLASH_SCREEN_HALFWAY";
import ACTION_NAVBAR_IS_VISIBLE from "../../actions/NavbarIsVisible/ACTION_NAVBAR_IS_VISIBLE";
import ACTION_NAVBAR_NOT_VISIBLE from "../../actions/NavbarIsVisible/ACTION_NAVBAR_NOT_VISIBLE";
import "../../components/account/clientprofile/MyProfile/MyProfile.css";
import "../../components/account/clientprofile/ConsentForm/ConsentForm.css";
import "../../components/account/clientprofile/MyAppointments/MyAppointments.css";
import "../../components/account/clientprofile/ClientProfile.css";
import "../../components/checkout/SummaryReviewCards/SummaryReviewCards.css";
import "../../bootstrap_forms.min.css";

const AdminRouter = React.forwardRef((props, ref) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    getEmployeeData,
    getEmployeeError,
    getEmployeeLoading,
    employeeDataRefetch,
    path,
    initialScreenSize,
    currentScreenSize,
    getEmployeesError,
    getEmployeesData,
    getEmployeesLoading,
    getEmployeesRefetch,
    handleClickToScrollToHome,
  } = props;

  const {
    data: getAllServicesData,
    refetch: getAllServicesRefetch,
    loading: getAllServicesLoading,
    error: getAllServicesError,
  } = useQuery(getAllServicesQuery, {
    fetchPolicy: "no-cache",
  });

  const {
    data: getAllStoresData,
    refetch: getAllStoresRefetch,
    loading: getAllStoresLoading,
    error: getAllStoresError,
  } = useQuery(getAllStoresQuery, {
    fetchPolicy: "no-cache",
  });

  const {
    data: getClientsData,
    refetch: getClientsRefetch,
    loading: getClientsLoading,
    error: getClientsError,
  } = useQuery(getClientsQuery, {
    fetchPolicy: "no-cache",
  });

  const {
    data: getAllAppointmentsData,
    refetch: getAllAppointmentsRefetch,
  } = useQuery(getAllAppointmentsQuery, {
    fetchPolicy: "no-cache",
  });

  const {
    data: getAllPersonalEventsData,
    refetch: getAllPersonalEventsRefetch,
  } = useQuery(getAllPersonalEventsQuery, {
    fetchPolicy: "no-cache",
  });

  const splashScreenHalfway = useSelector(
    (state) => state.splashScreenHalfway.splashScreenHalfway
  );
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );

  const randomColorArray = useMemo(() => {
    if (getClientsData) {
      if (getClientsData.clients.length > 0) {
        return randomColor({
          count: getClientsData.clients.length,
          hue: "#0081B1",
          format: "rgba",
          luminosity: "dark",
          alpha: 0.7,
        });
      }else if(getEmployeesData){
        if(getEmployeesData.employees.length > 0){
          return randomColor({
            count: getClientsData.clients.length + getEmployeesData.employees.length,
            hue: "#0081B1",
            format: "rgba",
            luminosity: "dark",
            alpha: 0.7,
          })
        }
      }
    }
  }, [getClientsData, getEmployeesData]);

  const [resetNotifications] = useMutation(resetNotificationsMutation);

  useEffect(() => {
    if (location.pathname === "/admin") {
      dispatch(ACTION_NAVBAR_NOT_VISIBLE());
    } else {
      dispatch(ACTION_NAVBAR_IS_VISIBLE());
    }
  }, [dispatch, location.pathname]);

  useEffect(() => {
    if (location.pathname.includes("activity")) {
      dispatch(ACTION_ON_ACTIVITY_PAGE());
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (location.pathname.includes("upcoming")) {
      dispatch(ACTION_ON_UPCOMING_PAGE());
    }
  }, [location.pathname, dispatch]);

  const registerFont = () => {
    Font.register({
      family: "Montserrat",
      fonts: [
        {
          src: MontserratLightSrc,
          fontStyle: "normal",
          fontWeight: 300,
        },
        {
          src: MontserratRegularSrc,
          fontStyle: "normal",
          fontWeight: 400,
        },
        {
          src: MontserratMediumSrc,
          fontStyle: "normal",
          fontWeight: 500,
        },
        {
          src: MontserratSemiBoldSrc,
          fontStyle: "normal",
          fontWeight: 600,
        },
        {
          src: MontserratBoldSrc,
          fontStyle: "normal",
          fontWeight: 700,
        },
        {
          src: MontserratBlackSrc,
          fontStyle: "normal",
          fontWeight: 900,
        },
      ],
    });
  };

  useMemo(() => {
    registerFont();
  }, []);

  useEffect(() => {
    if (!splashScreenComplete) {
      dispatch(ACTION_SPLASH_SCREEN_COMPLETE());
    }
    if (!splashScreenHalfway) {
      dispatch(ACTION_SPLASH_SCREEN_HALFWAY());
    }
  }, [dispatch, splashScreenComplete, splashScreenHalfway]);

  return (
    <>
      <LargeScreenSideMenu
        initialScreenSize={initialScreenSize}
        currentScreenSize={currentScreenSize}
        getEmployeeData={getEmployeeData ? getEmployeeData : null}
        employeeDataRefetch={employeeDataRefetch}
        getClientsLoading={getClientsLoading}
        handleClickToScrollToHome={handleClickToScrollToHome}
        ref={ref}
        resetNotifications={resetNotifications}
      />
      <Switch>
        <Route
          exact
          path={path}
          render={() => (
            <AdminLoginPage
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              employeeDataRefetch={employeeDataRefetch}
            />
          )}
        />
        <Route
          exact
          path={path + "/menu"}
          render={() => (
            <AdminMenu
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              employeeDataRefetch={employeeDataRefetch}
              resetNotifications={resetNotifications}
            />
          )}
        />
        <Route
          exact
          path={path + "/appointments/upcoming"}
          onLeave={() => resetNotifications()}
          render={() => (
            <AdminUpcomingNotifications
              employeeDataRefetch={employeeDataRefetch}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeLoading={getEmployeeLoading}
              getEmployeeError={getEmployeeError}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              getClientsData={getClientsData}
              randomColorArray={randomColorArray}
              getAllStoresData={getAllStoresData}
              getAllServicesData={getAllServicesData}
            />
          )}
        />
        <Route
          exact
          path={path + "/appointments/checkedin"}
          onLeave={() => resetNotifications()}
          render={() => (
            <AdminCheckedInNotifications
              employeeDataRefetch={employeeDataRefetch}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeLoading={getEmployeeLoading}
              getEmployeeError={getEmployeeError}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              getClientsData={getClientsData}
              randomColorArray={randomColorArray}
              getAllStoresData={getAllStoresData}
              getAllServicesData={getAllServicesData}
            />
          )}
        />
        <Route
          exact
          path={path + "/appointments/inprogress"}
          onLeave={() => resetNotifications()}
          render={() => (
            <AdminInProgressNotifications
              employeeDataRefetch={employeeDataRefetch}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeLoading={getEmployeeLoading}
              getEmployeeError={getEmployeeError}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              getClientsData={getClientsData}
              randomColorArray={randomColorArray}
              getAllStoresData={getAllStoresData}
              getAllServicesData={getAllServicesData}
            />
          )}
        />
        <Route
          exact
          path={path + "/appointments/history"}
          onLeave={() => resetNotifications()}
          render={() => (
            <AdminHistoryNotifications
              employeeDataRefetch={employeeDataRefetch}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeLoading={getEmployeeLoading}
              getEmployeeError={getEmployeeError}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              getClientsData={getClientsData}
              randomColorArray={randomColorArray}
              getAllStoresData={getAllStoresData}
              getAllServicesData={getAllServicesData}
            />
          )}
        />
        <Route
          exact
          path={path + "/activity"}
          onLeave={() => resetNotifications()}
          render={() => (
            <AdminNotifications
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeLoading={getEmployeeLoading}
              getEmployeeError={getEmployeeError}
              employeeDataRefetch={employeeDataRefetch}
            />
          )}
        />
        <Route
          exact
          path={path + "/clients"}
          render={() => (
            <AdminClients
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeError={getEmployeeError}
              employeeDataRefetch={employeeDataRefetch}
              getEmployeesRefetch={getEmployeesRefetch}
              getEmployeesError={getEmployeesError}
              getClientsData={getClientsData ? getClientsData : null}
              getClientsRefetch={getClientsRefetch}
              getClientsLoading={getClientsLoading}
              randomColorArray={randomColorArray ? randomColorArray : null}
              resetNotifications={resetNotifications}
            />
          )}
        />
        <Route
          exact
          path={path + "/management/staff"}
          render={() => (
            <AdminStaff
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getClientsData={getClientsData ? getClientsData : null}
              getClientsLoading={getClientsLoading}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeError={getEmployeeError}
              getEmployeesError={getEmployeesError}
              employeeDataRefetch={employeeDataRefetch}
              getEmployeesData={getEmployeesData}
              getEmployeesRefetch={getEmployeesRefetch}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              randomColorArray={randomColorArray ? randomColorArray : null}
              resetNotifications={resetNotifications}
            />
          )}
        />
        {getEmployeeData 
          ? getEmployeeData.employee.employeeRole.includes("Admin")
            ? <Route
                exact
                path={path + "/management/service"}
                render={() => (
                  <AdminService
                    initialScreenSize={initialScreenSize}
                    currentScreenSize={currentScreenSize}
                    getEmployeeData={getEmployeeData ? getEmployeeData : null}
                    getEmployeeError={getEmployeeError}
                    employeeDataRefetch={employeeDataRefetch}
                    getAllStoresData={getAllStoresData}
                    getAllServicesData={getAllServicesData}
                    getAllServicesRefetch={getAllServicesRefetch}
                    getAllServicesLoading={getAllServicesLoading}
                    getAllServicesError={getAllServicesError}
                    randomColorArray={randomColorArray ? randomColorArray : null}
                    resetNotifications={resetNotifications}
                  />
                )}
              />
            : null
          : null
        }
        <Route
          exact
          path={path + "/management/store"}
          render={() => (
            <AdminStore
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeError={getEmployeeError}
              employeeDataRefetch={employeeDataRefetch}
              getAllServicesData={getAllServicesData}
              getAllServicesRefetch={getAllServicesRefetch}
              getAllServicesLoading={getAllServicesLoading}
              getAllServicesError={getAllServicesError}
              getAllStoresData={getAllStoresData}
              getAllStoresRefetch={getAllStoresRefetch}
              getAllStoresLoading={getAllStoresLoading}
              getAllStoresError={getAllStoresError}
              randomColorArray={randomColorArray ? randomColorArray : null}
              resetNotifications={resetNotifications}
              getEmployeesError={getEmployeesError}
              getEmployeesData={getEmployeesData}
              getEmployeesRefetch={getEmployeesRefetch}
            />
          )}
        />
        <Route
          exact
          path={path + "/schedule"}
          render={() => (
            <AdminSchedule
              initialScreenSize={initialScreenSize}
              currentScreenSize={currentScreenSize}
              getAllAppointmentsData={getAllAppointmentsData}
              getAllAppointmentsRefetch={getAllAppointmentsRefetch}
              getEmployeeData={getEmployeeData ? getEmployeeData : null}
              getEmployeeError={getEmployeeError}
              getEmployeesError={getEmployeesError}
              getEmployeesData={getEmployeesData ? getEmployeesData : null}
              getClientsData={getClientsData ? getClientsData : null}
              getClientsRefetch={getClientsRefetch}
              getAllPersonalEventsData={getAllPersonalEventsData}
              getAllPersonalEventsRefetch={getAllPersonalEventsRefetch}
              randomColorArray={randomColorArray ? randomColorArray : null}
              resetNotifications={resetNotifications}
              employeeDataRefetch={employeeDataRefetch}
              getEmployeesRefetch={getEmployeesRefetch}
              getAllStoresData={getAllStoresData}
              getAllServicesData={getAllServicesData}
            />
          )}
        />
        <Route
          exact
          path={path + "/agenda"}
          render={() => (
            <AdminAgenda />
          )}
        />
        {/* If no path matches, redirect to home */}
        <Route render={() => <Redirect to="/" />} />
      </Switch>
    </>
  );
});

export default AdminRouter;
