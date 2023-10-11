import React, {
  useEffect,
  useState
} from "react";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import addAgendaMutation from "../../../graphql/mutations/addAgendaMutation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";

import "./AdminAgenda.css";


const AdminAgenda = () => {
  
  const adminAuthenticated = useSelector(
    (state) => state.adminAuthenticated.admin_authenticated
  );

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).replace("\r", "").split(";");
    const csvRows = string.slice(string.indexOf("\n") + 1).replace("\r", "").split("\n");

    const array = csvRows.map((i) => {
      i = i?.replace("\r", "").trim();
      const values = i.split(";");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header.toLowerCase()] = values[index] != undefined ? values[index] : "";
        return object;
      }, {});
      return obj;
    }).filter((item => {
      return item.weekday != "" && item.hour != "" && item.location != "" && item.availability != "" 
    }));
    
    addAgenda({
      variables: {
        agenda: array,
      },
    });

    setArray(array);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...array));

  const redirectToAdminLogInPage = () => {
    if (!adminAuthenticated) {
      return <Redirect to="/admin" />;
    }
  };

  const [
    addAgenda,
    { loading: addAgendaLoading, data: addAgendaData },
  ] = useMutation(addAgendaMutation);

  return (
    <div className="admin_clients_container">
      {redirectToAdminLogInPage()}
      <div
        className="admin_clients_header"
      >
        <Link to="/admin/menu">
          <FontAwesomeIcon
            className="admin_clients_back_arrow"
            icon={faChevronLeft}
          />
        </Link>
        <h1>UPDATE AGENDA</h1>
      </div>
      <div className="admin_clients_content_container">
        <form>
          <input
            className="add_staff_member_button choose_agenda"
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />
          <div
            className="add_staff_member_button"
            onClick={(e) => handleOnSubmit(e)}
          >
            IMPORT CSV 
          </div>
        </form>

        <br />

        <table>
          <thead>
            <tr key={"header"}>
              {headerKeys.map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {array.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAgenda;
