import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { useTheme } from "@mui/material/styles";
import { FaPlus, FaTable } from "react-icons/fa";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { UserContext } from "../../Context/userContext";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import {
  GETALLUSERS_API,
  GETALLUSERSBYID_API,
  DELETEUSERSBYID_API,GETALLSTORES_API,
} from "../../Constants/apiRoutes";
import "../../style.css";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";


import LoadingAnimation from "../../components/Loading/LoadingAnimation";


function User() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const { setUserDetails } = useContext(UserContext);
  const [selectedStore, setSelectedStore] = useState("");
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [storeNames, setStoreNames] = useState([]);
  const [Users, setusers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { id: "1", name: "Admin" },
    { id: "2", name: "Store User" },
    { id: "3", name: "Finance" },
    { id: "4", name: "Production" },
    { id: "5", name: "Technical" },
  ];
  
  const getAllUsers = async (pageNum, pageSize, search = "") => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        // "https://imlystudios-backend-mqg4.onrender.com/api/users/getAllUsers",
        GETALLUSERS_API,
        {
          params: {
            page: pageNum + 1,
            limit: pageSize,
            SearchText: search,
          },
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request
            "Content-Type": "application/json",
          },
        }
      );

      return {
        users: response.data.users,
        totalCount: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchName]);

  const fetchUsers = async () => {
    try {
      const { users, totalCount } = await getAllUsers(
        page,
        rowsPerPage,
        searchName
      );
      setUsers(users);
      setPaginatedPeople(users);

      // Only update filtered customers if no search is active
      if (!isSearching) {
        setFilteredUsers(users); // Set initial filtered customers to all fetched data
      }

      setTotalUsers(totalCount);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const getUserById = async (userId) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(
        // `https://imlystudios-backend-mqg4.onrender.com/api/users/getUserById/${userId}`,
        `${GETALLUSERSBYID_API}/${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the headers
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  

  const deleteUserById = async (userId) => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.delete(
        // `https://imlystudios-backend-mqg4.onrender.com/api/users/deleteUser/${userId}`,
        `${DELETEUSERSBYID_API}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the headers
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const handleEditClick = async (userId) => {
    setIsLoading(true); 
    try {
      const userDetails = await getUserById(userId);
      setUserDetails(userDetails);
      navigate("/userform");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = async (userId) => {
    setIsLoading(true); 
    try {
      await deleteUserById(userId);
      fetchUsers(); // Refresh the user list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }finally {
      setIsLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setUserDetails(null);
    navigate("/userform");
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportUsersData = async () => {
    try {
      const { users } = await getAllUsers(0, totalUsers); // Fetch all users for export
      exportToExcel(users, "Customers");
    } catch (error) {
      console.error("Error exporting users data:", error);
    }
  };

  // const searchItems = (searchValue) => {
  //   setSearchName(searchValue);

  //   if (searchValue === "") {
  //     setIsSearching(false); // Reset search mode
  //     setFilteredUsers(users); // Show all users when search is cleared
  //   } else {
  //     setIsSearching(true); // Enable search mode
  //     const filteredData = users.filter((user) => {
  //       const searchLower = searchValue.toLowerCase();
  //       return (
  //         (user.FirstName &&
  //           user.FirstName.toLowerCase().includes(searchLower)) ||
  //         (user.LastName &&
  //           user.LastName.toLowerCase().includes(searchLower)) ||
  //         (user.Email && user.Email.toLowerCase().includes(searchLower)) ||
  //         (user.PhoneNumber &&
  //           user.PhoneNumber.toLowerCase().includes(searchLower))
  //       );
  //     });
  //     setFilteredUsers(filteredData);
  //   }
  // };
  // const displayUsers = searchName ? filteredUsers : users;

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(GETALLSTORES_API);
        console.log("API Response:", response.data);

        // Extract the Stores array from the API response
        const storesData = response.data.Stores || [];

        // Check if it's an array and set store names
        setStoreNames(Array.isArray(storesData) ? storesData : []);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  
// useEffect(() => {
//   if (selectedStore?.StoreID) {
//     const filtered = Users.filter(
//       (users) => users.StoreID === selectedStore.StoreID
//     );
//     setFilteredUsers(filtered);
//   } else {
//     setFilteredUsers(Users); 
//   }
// }, [selectedStore, Users]);

// Search function
const searchItems = (searchValue) => {
  setSearchName(searchValue);

  if (searchValue === "") {
    setIsSearching(false); // Reset search mode
  } else {
    setIsSearching(true); // Enable search mode
  }

  // Apply both store and search filters together
  applyFilters(searchValue, selectedStore);
};

// Apply both filters
const applyFilters = (searchValue, selectedStore) => {
  let filteredData = users;

  // Filter by store if a store is selected
  if (selectedStore?.StoreID) {
    filteredData = filteredData.filter(
      (user) => user.StoreID === selectedStore.StoreID
    );
  }

  // Filter by search term if there is one
  if (searchValue) {
    const searchLower = searchValue.toLowerCase();
    filteredData = filteredData.filter((user) => {
      return (
        (user.FirstName && user.FirstName.toLowerCase().includes(searchLower)) ||
        (user.LastName && user.LastName.toLowerCase().includes(searchLower)) ||
        (user.Email && user.Email.toLowerCase().includes(searchLower)) ||
        (user.PhoneNumber &&
          user.PhoneNumber.toLowerCase().includes(searchLower))
      );
    });
  }

  // Update filtered users state
  setFilteredUsers(filteredData);
};

// Effect for handling store selection
useEffect(() => {
  // Apply store and search filters when selectedStore or users change
  applyFilters(searchName, selectedStore);
}, [selectedStore, users]);

// Display logic: Use filteredUsers when searching or filtering, otherwise use all users
const displayUsers = searchName || selectedStore ? filteredUsers : users;

  

  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:ml-10 lg:ml-72 w-auto">
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col w-full">
       
          <div className="flex flex-wrap items-center justify-between w-full">
            <h2 className="pl-4 text-xl font-semibold">Users</h2>

            <ul className="flex flex-wrap items-center gap-2 p-2 justify-center w-full sm:w-auto sm:justify-end">
              <li>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-custom-darkblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-custom-lightblue hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  onClick={handleAddUserClick}
                >
                  <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
                  Add Users
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="inline-flex items-center gap-x-1.5 rounded-md bg-custom-darkblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-custom-lightblue hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  onClick={handleExportUsersData}
                >
                  <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
                  Export Users
                </button>
              </li>
            </ul>
          </div>

        
          <div className="flex flex-wrap items-center justify-center w-full mt-4 gap-4">
            {/* Store Combobox */}
            {/* <div className="p-2 w-full sm:w-auto">
              <Combobox value={selectedStore} onChange={setSelectedStore}>
                <div className="relative mt-1 w-full sm:w-64">
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                    displayValue={(store) => store.name}
                    placeholder="Select Store Name"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {storeNames.map((store) => (
                      <Combobox.Option
                        key={store.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-900"
                          }`
                        }
                        value={store}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-semibold" : "font-normal"
                              }`}
                            >
                              {store.name}
                            </span>
                            {selected && (
                              <span
                                className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                  active ? "text-white" : "text-indigo-600"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
              </Combobox>
            </div> */}
 {/* <div className="p-2 w-full sm:w-auto">
      <Combobox value={selectedStore} onChange={setSelectedStore}>
        <div className="relative mt-1 w-full sm:w-64">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            displayValue={(store) => store?.StoreName || ""}
            placeholder="Select Store Name"
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {storeNames.map((store) => (
              <Combobox.Option
              key={store.StoreID} // Use StoreID as the key
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-9 ${
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  }`
                }
                value={store}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {store.StoreName}{" "}
                    </span>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                          active ? "text-white" : "text-indigo-600"
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div> */}
 
            {/* <div className="relative flex items-center p-2 w-full sm:w-auto">
<input
                id="searchName"
                type="text"
                placeholder="Search by Name, Email, or Mobile"
                value={searchName}
                onChange={(e) => searchItems(e.target.value)} // Ensure the search function is triggered
                className="mt-1 p-2 pr-10 border border-gray-300 rounded-md w-full sm:w-64"
              />
<div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
<IoIosSearch />
</div>
</div> */}

{/* <div className="flex-container">
  <div className="combobox-container">
    <Combobox value={selectedStore} onChange={setSelectedStore}>
      <div className="combobox-wrapper">
        <Combobox.Input
          className="combobox-input"
          displayValue={(store) => store?.StoreName || ""}
          placeholder="Select Store Name"
        />
        <Combobox.Button className="combobox-button">
          <ChevronUpDownIcon className="combobox-icon" aria-hidden="true" />
        </Combobox.Button>
        <Combobox.Options className="combobox-options">
          {storeNames.map((store) => (
            <Combobox.Option
              key={store.StoreID}
              className={({ active }) =>
                active ? "combobox-option-active" : "combobox-option"
              }
              value={store}
            >
              {({ selected, active }) => (
                <>
                  <span
                    className={
                      selected ? "combobox-option-text font-semibold" : "combobox-option-text font-normal"
                    }
                  >
                    {store.StoreName}{" "}
                  </span>
                  {selected && (
                    <span
                      className={
                        active ? "combobox-option-selected-icon active-selected-icon" : "combobox-option-selected-icon"
                      }
                    >
                      <CheckIcon className="combobox-check-icon" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </div>
    </Combobox>
  </div>

  <div className="search-container-c-u">
    <input
      id="searchName"
      type="text"
      placeholder="Search by Name or Email or Mobile"
      value={searchName}
      onChange={(e) => searchItems(e.target.value)}
      className="search-input"
    />
    <div className="search-icon-container-c-u">
      <IoIosSearch />
    </div>
  </div>
</div> */}

<div className="flex-container">
<div className="combobox-container">
  <Combobox value={selectedStore} onChange={setSelectedStore}>
    <div className="combobox-wrapper">
      <Combobox.Input
        className="combobox-input"
        displayValue={(store) => store?.StoreName || "Select Store ID"}
        placeholder="Select Store Name"
      />
      <Combobox.Button className="combobox-button">
        <ChevronUpDownIcon className="combobox-icon" aria-hidden="true" />
      </Combobox.Button>
      <Combobox.Options className="combobox-options">
        {/* Add "Select Store ID" option */}
        <Combobox.Option
          key="select-store-id"
          className={({ active }) =>
            active ? "combobox-option-active" : "combobox-option"
          }
          value={{ StoreID: null, StoreName: "Select Store ID" }}
        >
          {({ selected, active }) => (
            <>
              <span
                className={
                  selected
                    ? "combobox-option-text font-semibold"
                    : "combobox-option-text font-normal"
                }
              >
                Select Store ID
              </span>
              {selected && (
                <span
                  className={
                    active
                      ? "combobox-option-selected-icon active-selected-icon"
                      : "combobox-option-selected-icon"
                  }
                >
                  <CheckIcon className="combobox-check-icon" aria-hidden="true" />
                </span>
              )}
            </>
          )}
        </Combobox.Option>

        {/* Render all store options */}
        {storeNames.map((store) => (
          <Combobox.Option
            key={store.StoreID}
            className={({ active }) =>
              active ? "combobox-option-active" : "combobox-option"
            }
            value={store}
          >
            {({ selected, active }) => (
              <>
                <span
                  className={
                    selected
                      ? "combobox-option-text font-semibold"
                      : "combobox-option-text font-normal"
                  }
                >
                  {store.StoreName}
                </span>
                {selected && (
                  <span
                    className={
                      active
                        ? "combobox-option-selected-icon active-selected-icon"
                        : "combobox-option-selected-icon"
                    }
                  >
                    <CheckIcon className="combobox-check-icon" aria-hidden="true" />
                  </span>
                )}
              </>
            )}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </div>
  </Combobox>
</div>


  <div className="search-container-c-u">
    <input
      id="searchName"
      type="text"
      placeholder="Search by Name or Email or Mobile"
      value={searchName}
      onChange={(e) => searchItems(e.target.value)}
      className="search-input"
    />
    <div className="search-icon-container-c-u">
      <IoIosSearch />
    </div>
  </div>
</div>


          </div>
        </div>

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Mobile No</StyledTableCell>
                <StyledTableCell>Roles</StyledTableCell>
                <StyledTableCell>Gender</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayUsers.map((person) => (
                <StyledTableRow key={person.UserID}>
              
                  <StyledTableCell>
                    <div className="flex flex-col md:flex-col lg:flex-row items-center lg:space-x-2 space-y-2 lg:space-y-0 w-full">
                      <img
                        src={person.ProfileImage}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col sm:flex-row sm:space-x-2  w-full md:pr-8 lg:pr-8">
                        <span>{person.FirstName}</span>
                        <span>{person.LastName}</span>
                      </div>
                    </div>
                  </StyledTableCell>

                  <StyledTableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {person.Email}
                  </StyledTableCell>

                  <StyledTableCell>{person.PhoneNumber}</StyledTableCell>
                 
                  <StyledTableCell>
                    {(() => {
                      // Log the RoleID and available options for debugging
                      console.log("RoleID:", person.RoleID);
                      console.log("Role Options:", roleOptions);

                      // Ensure person.RoleID is treated as a string for comparison
                      const role = roleOptions.find(
                        (role) => role.id === String(person.RoleID)
                      );

                      // Log the found role
                      console.log("Found Role:", role);

                      // Return the role name or "Unknown Role"
                      return role?.name || "Unknown Role";
                    })()}
                  </StyledTableCell>
                
                  <StyledTableCell>
                 
                    <span
  className={`w-[68px] text-center gender-pill ${
    person.Gender === "M"
      ? "gender-male"
      : person.Gender === "F"
      ? "gender-female"
      : "gender-na"
  }`}
>
  {person.Gender === null
    ? "N/A"
    : person.Gender === "M"
    ? person.Gender + "ale"
    : person.Gender + "emale"}
</span>

                  </StyledTableCell>
                
                  <StyledTableCell>
                   
<div className="button-container">
  <button
    type="button"
    onClick={() => handleEditClick(person.UserID)}
    className="button edit-button"
  >
    <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteClick(person.UserID)}
    className="button delete-button"
  >
    <MdOutlineCancel aria-hidden="true" className="h-4 w-4" />
    Delete
  </button>
</div>

                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 20, 25]}
                  colSpan={6}
                  count={totalUsers}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
      {isLoading && (
      
        <LoadingAnimation />
    
    )}
    </div>
  );
}

export default User;


// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { styled } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell, { tableCellClasses } from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import IconButton from "@mui/material/IconButton";
// import TableFooter from "@mui/material/TableFooter";
// import TablePagination from "@mui/material/TablePagination";
// import FirstPageIcon from "@mui/icons-material/FirstPage";
// import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
// import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
// import LastPageIcon from "@mui/icons-material/LastPage";
// import { useTheme } from "@mui/material/styles";
// import { FaPlus, FaTable } from "react-icons/fa";
// import * as XLSX from "xlsx";
// import PropTypes from "prop-types";
// import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
// import { IoIosSearch } from "react-icons/io";
// import axios from "axios";
// import { UserContext } from "../../Context/userContext";
// import { Combobox } from "@headlessui/react";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
// import { MdOutlineCancel } from "react-icons/md";
// import {
//   GETALLUSERS_API,
//   GETALLUSERSBYID_API,
//   DELETEUSERSBYID_API,GETALLSTORES_API,
// } from "../../Constants/apiRoutes";
// import "../../style.css";
// import {
//   StyledTableCell,
//   StyledTableRow,
//   TablePaginationActions,
// } from "../CustomTablePagination";


// function User() {
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalUsers, setTotalUsers] = useState(0);
//   const [searchName, setSearchName] = useState("");
//   const navigate = useNavigate();
//   const { setUserDetails } = useContext(UserContext);
//   const [selectedStore, setSelectedStore] = useState("");
//   const [paginatedPeople, setPaginatedPeople] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [storeNames, setStoreNames] = useState([]);
//   const [Users, setusers] = useState([]);
  
//   const roleOptions = [
//     { id: "1", name: "Admin" },
//     { id: "2", name: "Store User" },
//     { id: "3", name: "Finance" },
//     { id: "4", name: "Production" },
//     { id: "5", name: "Technical" },
//   ];
  
//   const getAllUsers = async (pageNum, pageSize, search = "") => {
//     try {
//       // Retrieve the token from localStorage
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         // "https://imlystudios-backend-mqg4.onrender.com/api/users/getAllUsers",
//         GETALLUSERS_API,
//         {
//           params: {
//             page: pageNum + 1,
//             limit: pageSize,
//             SearchText: search,
//           },
//           headers: {
//             Authorization: `Bearer ${token}`, // Add the token to the request
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       return {
//         users: response.data.users,
//         totalCount: response.data.totalItems,
//       };
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [page, rowsPerPage, searchName]);

//   useEffect(() => {
//     if (selectedStore?.StoreID) {
//       const filtered = users.filter(
//         (customer) => users.StoreID === selectedStore.StoreID
//       );
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(users); 
//     }
//   }, [selectedStore, users]);

//   const fetchUsers = async () => {
//     try {
//       const { users, totalCount } = await getAllUsers(
//         page,
//         rowsPerPage,
//         searchName
//       );
//       setUsers(users);
//       setPaginatedPeople(users);

//       // Only update filtered customers if no search is active
//       if (!isSearching) {
//         setFilteredUsers(users); // Set initial filtered customers to all fetched data
//       }

//       setTotalUsers(totalCount);
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };


//   const getUserById = async (userId) => {
//     try {
//       // Retrieve the token from localStorage
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.get(
//         // `https://imlystudios-backend-mqg4.onrender.com/api/users/getUserById/${userId}`,
//         `${GETALLUSERSBYID_API}/${userId}`,

//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass token in the headers
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       throw error;
//     }
//   };

//   const deleteUserById = async (userId) => {
//     try {
//       // Retrieve the token from localStorage
//       const token = localStorage.getItem("token");
//       console.log(token);
//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       const response = await axios.delete(
//         // `https://imlystudios-backend-mqg4.onrender.com/api/users/deleteUser/${userId}`,
//         `${DELETEUSERSBYID_API}/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Pass token in the headers
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error("Error deleting user:", error);
//       throw error;
//     }
//   };

//   const handleEditClick = async (userId) => {
//     try {
//       const userDetails = await getUserById(userId);
//       setUserDetails(userDetails);
//       navigate("/userform");
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//     }
//   };

//   const handleDeleteClick = async (userId) => {
//     try {
//       await deleteUserById(userId);
//       fetchUsers(); // Refresh the user list after deletion
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const handleAddUserClick = () => {
//     setUserDetails(null);
//     navigate("/userform");
//   };

//   const exportToExcel = (data, fileName) => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, `${fileName}.xlsx`);
//   };

//   const handleExportUsersData = async () => {
//     try {
//       const { users } = await getAllUsers(0, totalUsers); // Fetch all users for export
//       exportToExcel(users, "Customers");
//     } catch (error) {
//       console.error("Error exporting users data:", error);
//     }
//   };

//   const searchItems = (searchValue) => {
//     setSearchName(searchValue);

//     if (searchValue === "") {
//       setIsSearching(false); // Reset search mode
//       setFilteredUsers(users); // Show all users when search is cleared
//     } else {
//       setIsSearching(true); // Enable search mode
//       const filteredData = users.filter((user) => {
//         const searchLower = searchValue.toLowerCase();
//         return (
//           (user.FirstName &&
//             user.FirstName.toLowerCase().includes(searchLower)) ||
//           (user.LastName &&
//             user.LastName.toLowerCase().includes(searchLower)) ||
//           (user.Email && user.Email.toLowerCase().includes(searchLower)) ||
//           (user.PhoneNumber &&
//             user.PhoneNumber.toLowerCase().includes(searchLower))
//         );
//       });
//       setFilteredUsers(filteredData);
//     }
//   };
//   const displayUsers = searchName ? filteredUsers : users;

//   useEffect(() => {
//     const fetchStores = async () => {
//       try {
//         const response = await axios.get(GETALLSTORES_API);
//         console.log("API Response:", response.data);

//         // Extract the Stores array from the API response
//         const storesData = response.data.Stores || [];

//         // Check if it's an array and set store names
//         setStoreNames(Array.isArray(storesData) ? storesData : []);
//       } catch (error) {
//         console.error("Error fetching stores:", error);
//       }
//     };

//     fetchStores();
//   }, []);

//   useEffect(() => {
//     if (selectedStore?.StoreID) {
//       const filtered =Users.filter(
//         (users) => users.StoreID === selectedStore.StoreID
//       );
//       setFilteredUsers(filtered);
//     } else {
//       setFilteredUsers(Users); // Show all customers if no store is selected
//     }
//   }, [selectedStore, Users]);
  

//   return (
//     <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:ml-10 lg:ml-72 w-auto">
//       <div className="mt-6  p-6">
//         <div className="flex flex-col w-full">
       
//           <div className="flex flex-wrap items-center justify-between w-full">
//             <h2 className="pl-4 text-xl font-semibold">Users</h2>

//             <ul className="button-list">
//               <li>
//                 <button
//                   type="button"
//                   className="action-button"
//                   onClick={handleAddUserClick}
//                 >
//                   <FaPlus aria-hidden="true" className="icon" />
//                   Add Users
//                 </button>
//               </li>
//               <li>
//                 <button
//                   type="button"
//                   className="action-button"
//                   onClick={handleExportUsersData}
//                 >
//                   <FaTable aria-hidden="true" className="icon" />
//                   Export Users
//                 </button>
//               </li>
//             </ul>
//           </div>

        
//           <div className="flex flex-wrap items-center justify-center w-full mt-4 gap-4">
//             {/* Store Combobox */}
//             {/* <div className="p-2 w-full sm:w-auto">
//               <Combobox value={selectedStore} onChange={setSelectedStore}>
//                 <div className="relative mt-1 w-full sm:w-64">
//                   <Combobox.Input
//                     className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
//                     displayValue={(store) => store.name}
//                     placeholder="Select Store Name"
//                   />
//                   <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//                     <ChevronUpDownIcon
//                       className="h-5 w-5 text-gray-400"
//                       aria-hidden="true"
//                     />
//                   </Combobox.Button>
//                   <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//                     {storeNames.map((store) => (
//                       <Combobox.Option
//                         key={store.id}
//                         className={({ active }) =>
//                           `relative cursor-default select-none py-2 pl-3 pr-9 ${
//                             active
//                               ? "bg-indigo-600 text-white"
//                               : "text-gray-900"
//                           }`
//                         }
//                         value={store}
//                       >
//                         {({ selected, active }) => (
//                           <>
//                             <span
//                               className={`block truncate ${
//                                 selected ? "font-semibold" : "font-normal"
//                               }`}
//                             >
//                               {store.name}
//                             </span>
//                             {selected && (
//                               <span
//                                 className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
//                                   active ? "text-white" : "text-indigo-600"
//                                 }`}
//                               >
//                                 <CheckIcon
//                                   className="h-5 w-5"
//                                   aria-hidden="true"
//                                 />
//                               </span>
//                             )}
//                           </>
//                         )}
//                       </Combobox.Option>
//                     ))}
//                   </Combobox.Options>
//                 </div>
//               </Combobox>
//             </div> */}
//  {/* <div className="p-2 w-full sm:w-auto">
//       <Combobox value={selectedStore} onChange={setSelectedStore}>
//         <div className="relative mt-1 w-full sm:w-64">
//           <Combobox.Input
//             className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
//             displayValue={(store) => store?.StoreName || ""}
//             placeholder="Select Store Name"
//           />
//           <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
//             <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
//           </Combobox.Button>
//           <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
//             {storeNames.map((store) => (
//               <Combobox.Option
//               key={store.StoreID} // Use StoreID as the key
//                 className={({ active }) =>
//                   `relative cursor-default select-none py-2 pl-3 pr-9 ${
//                     active ? "bg-indigo-600 text-white" : "text-gray-900"
//                   }`
//                 }
//                 value={store}
//               >
//                 {({ selected, active }) => (
//                   <>
//                     <span
//                       className={`block truncate ${
//                         selected ? "font-semibold" : "font-normal"
//                       }`}
//                     >
//                       {store.StoreName}{" "}
//                     </span>
//                     {selected && (
//                       <span
//                         className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
//                           active ? "text-white" : "text-indigo-600"
//                         }`}
//                       >
//                         <CheckIcon className="h-5 w-5" aria-hidden="true" />
//                       </span>
//                     )}
//                   </>
//                 )}
//               </Combobox.Option>
//             ))}
//           </Combobox.Options>
//         </div>
//       </Combobox>
//     </div> */}
 
//             {/* <div className="relative flex items-center p-2 w-full sm:w-auto">
// <input
//                 id="searchName"
//                 type="text"
//                 placeholder="Search by Name, Email, or Mobile"
//                 value={searchName}
//                 onChange={(e) => searchItems(e.target.value)} // Ensure the search function is triggered
//                 className="mt-1 p-2 pr-10 border border-gray-300 rounded-md w-full sm:w-64"
//               />
// <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
// <IoIosSearch />
// </div>
// </div> */}

// <div className="flex-container">
//   <div className="combobox-container">
//     <Combobox value={selectedStore} onChange={setSelectedStore}>
//       <div className="combobox-wrapper">
//         <Combobox.Input
//           className="combobox-input"
//           displayValue={(store) => store?.StoreName || ""}
//           placeholder="Select Store Name"
//         />
//         <Combobox.Button className="combobox-button">
//           <ChevronUpDownIcon className="combobox-icon" aria-hidden="true" />
//         </Combobox.Button>
//         <Combobox.Options className="combobox-options">
//           {storeNames.map((store) => (
//             <Combobox.Option
//               key={store.StoreID}
//               className={({ active }) =>
//                 active ? "combobox-option-active" : "combobox-option"
//               }
//               value={store}
//             >
//               {({ selected, active }) => (
//                 <>
//                   <span
//                     className={
//                       selected ? "combobox-option-text font-semibold" : "combobox-option-text font-normal"
//                     }
//                   >
//                     {store.StoreName}{" "}
//                   </span>
//                   {selected && (
//                     <span
//                       className={
//                         active ? "combobox-option-selected-icon active-selected-icon" : "combobox-option-selected-icon"
//                       }
//                     >
//                       <CheckIcon className="combobox-check-icon" aria-hidden="true" />
//                     </span>
//                   )}
//                 </>
//               )}
//             </Combobox.Option>
//           ))}
//         </Combobox.Options>
//       </div>
//     </Combobox>
//   </div>

//   <div className="search-container-c-u">
//     <input
//       id="searchName"
//       type="text"
//       placeholder="Search by Name or Email or Mobile"
//       value={searchName}
//       onChange={(e) => searchItems(e.target.value)}
//       className="search-input"
//     />
//     <div className="search-icon-container-c-u">
//       <IoIosSearch />
//     </div>
//   </div>
// </div>

//           </div>
//         </div>

//         <TableContainer component={Paper} className="mt-4">
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <StyledTableCell>Name</StyledTableCell>
//                 <StyledTableCell>Email</StyledTableCell>
//                 <StyledTableCell>Mobile No</StyledTableCell>
//                 <StyledTableCell>Roles</StyledTableCell>
//                 <StyledTableCell>Gender</StyledTableCell>
//                 <StyledTableCell>Actions</StyledTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {displayUsers.map((person) => (
//                 <StyledTableRow key={person.UserID}>
              
//                   <StyledTableCell>
//                     <div className="flex flex-col md:flex-col lg:flex-row items-center lg:space-x-2 space-y-2 lg:space-y-0 w-full">
//                       <img
//                         src={person.ProfileImage}
//                         alt="Profile"
//                         className="h-10 w-10 rounded-full object-cover"
//                       />
//                       <div className="flex flex-col sm:flex-row sm:space-x-2  w-full md:pr-8 lg:pr-8">
//                         <span>{person.FirstName}</span>
//                         <span>{person.LastName}</span>
//                       </div>
//                     </div>
//                   </StyledTableCell>

//                   <StyledTableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
//                     {person.Email}
//                   </StyledTableCell>

//                   <StyledTableCell>{person.PhoneNumber}</StyledTableCell>
                 
//                   <StyledTableCell>
//                     {(() => {
//                       // Log the RoleID and available options for debugging
//                       console.log("RoleID:", person.RoleID);
//                       console.log("Role Options:", roleOptions);

//                       // Ensure person.RoleID is treated as a string for comparison
//                       const role = roleOptions.find(
//                         (role) => role.id === String(person.RoleID)
//                       );

//                       // Log the found role
//                       console.log("Found Role:", role);

//                       // Return the role name or "Unknown Role"
//                       return role?.name || "Unknown Role";
//                     })()}
//                   </StyledTableCell>
                
//                   <StyledTableCell>
                 
//                     <span
//   className={`w-[68px] text-center gender-pill ${
//     person.Gender === "M"
//       ? "gender-male"
//       : person.Gender === "F"
//       ? "gender-female"
//       : "gender-na"
//   }`}
// >
//   {person.Gender === null
//     ? "N/A"
//     : person.Gender === "M"
//     ? person.Gender + "ale"
//     : person.Gender + "emale"}
// </span>

//                   </StyledTableCell>
                
//                   <StyledTableCell>
                   
// <div className="button-container">
//   <button
//     type="button"
//     onClick={() => handleEditClick(person.UserID)}
//     className="button edit-button"
//   >
//     <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
//     Edit
//   </button>

//   <button
//     type="button"
//     onClick={() => handleDeleteClick(person.UserID)}
//     className="button delete-button"
//   >
//     <MdOutlineCancel aria-hidden="true" className="h-4 w-4" />
//     Delete
//   </button>
// </div>

//                   </StyledTableCell>
//                 </StyledTableRow>
//               ))}
//             </TableBody>
//             <TableFooter>
//               <TableRow>
//                 <TablePagination
//                   rowsPerPageOptions={[10, 20, 25]}
//                   colSpan={6}
//                   count={totalUsers}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handleChangePage}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   ActionsComponent={TablePaginationActions}
//                 />
//               </TableRow>
//             </TableFooter>
//           </Table>
//         </TableContainer>
//       </div>
//     </div>
//   );
// }

// export default User;
