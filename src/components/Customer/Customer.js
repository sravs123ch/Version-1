

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
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { IoIosSearch } from "react-icons/io";
import { FaTable } from "react-icons/fa";
import axios from "axios";
import { CustomerContext } from "../../Context/customerContext"; // Import CustomerContext
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { MdOutlineCancel } from "react-icons/md";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";
import {
  GETALLCUSTOMERS_API,
  DELETECUSTOMERSBYID_API,
  GETALLCUSTOMERSBYID_API,
  GETALLSTORES_API,
  CUSTOMERID_API,
  ADDRESS_API,
  ORDERBYCUSTOMERID_API
} from "../../Constants/apiRoutes";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { GrFormView } from "react-icons/gr";

function Customers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [Customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const navigate = useNavigate();
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStore, setSelectedStore] = useState("");
  // const { setCustomerDetails } = useContext(CustomerContext);
  const { customerDetails, setCustomerDetails ,setAddressDetails} = useContext(CustomerContext);
  const [isLoading, setIsLoading] = useState(false);
  const [storeNames, setStoreNames] = useState([]);
  const [customers] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
const [orders, setOrders] = useState([]); // State to hold the fetched orders


  const getAllCustomers = async (pageNum, pageSize) => {
    console.log("Final API URL:", GETALLCUSTOMERS_API);

    try {
      const response = await axios.get(GETALLCUSTOMERS_API, {
        params: {
         
          page: pageNum + 1,
          pageSize: pageSize,
          limit: pageSize,
          SearchText: searchName,
        },
      });

      return {
        customers: response.data.customers,
        totalCount: response.data.totalItems,
      };
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };

 
  useEffect(() => {
    fetchCustomers();
  }, [page, rowsPerPage, searchName]);

  // const fetchCustomers = async () => {
  //   try {
  //     const { customers, totalCount } = await getAllCustomers(
  //       page,
  //       rowsPerPage,
  //       searchName
  //     );
  //     setCustomers(customers);
  //     setPaginatedPeople(customers);

  //     // Only update filtered customers if no search is active
  //     if (!isSearching) {
  //       setFilteredCustomers(customers); // Set initial filtered customers to all fetched data
  //     }

  //     setTotalCustomers(totalCount);
  //   } catch (error) {
  //     console.error("Failed to fetch customers", error);
  //   }
  // };

  // const searchItems = (searchValue) => {
  //   setSearchName(searchValue);

  //   if (searchValue === "") {
  //     setIsSearching(false); // Reset search mode
  //     setFilteredCustomers(paginatedPeople); // Show all customers when search is cleared
  //   } else {
  //     setIsSearching(true); // Enable search mode
  //     const filteredData = paginatedPeople.filter((item) => {
  //       return Object.values(item)
  //         .join("")
  //         .toLowerCase()
  //         .includes(searchValue.toLowerCase());
  //     });
  //     setFilteredCustomers(filteredData);
  //   }
  // };

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const { customers, totalCount } = await getAllCustomers(page, rowsPerPage, searchName);
      setCustomers(customers);
      setPaginatedPeople(customers);

      // Only update filtered customers if no search is active
      if (!isSearching) {
        setFilteredCustomers(customers); // Set initial filtered customers to all fetched data
      }

      setTotalCustomers(totalCount);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customers on component mount or whenever page/rowsPerPage changes
  }, [page, rowsPerPage]); 

  // Filter customers based on selected store
  useEffect(() => {
    if (selectedStore?.StoreID) {
      const filtered = customers.filter(
        (customer) => customer.StoreID === selectedStore.StoreID
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers); 
    }
  }, [selectedStore, customers]);

  // Search customers based on the search bar
  const searchItems = (searchValue) => {
    setSearchName(searchValue);

    if (searchValue === "") {
      setIsSearching(false); // Reset search mode
      setFilteredCustomers(customers); // Show all customers when search is cleared
    } else {
      setIsSearching(true); // Enable search mode
      const filteredData = filteredCustomers.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredCustomers(filteredData);
    }
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const getCustomerById = async (customerId) => {
  //   try {
  //     console.log("customers", customerId);
  //     const response = await axios.get(
  //       // `https://imlystudios-backend-mqg4.onrender.com/api/customers/getCustomerById/${customerId}`
  //       `${GETALLCUSTOMERSBYID_API}/${customerId}`
  //     );

  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching customer:", error);
  //     throw error;
  //   }
  // };

  const getCustomerById = async (customerId) => {
    try {
      console.log("customers", customerId);
      const response = await axios.get(
        // `https://imlystudios-backend-mqg4.onrender.com/api/customers/getCustomerById/${customerId}`
       `${CUSTOMERID_API}/${customerId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };
const getCustomerAddressById = async (customerId) => {
    try {
      console.log("customers", customerId);
      const response = await axios.get(
        // `https://imlystudios-backend-mqg4.onrender.com/api/customers/getCustomerById/${customerId}`
       `${ADDRESS_API}/${customerId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching customer:", error);
      throw error;
    }
  };
  // Function to fetch customer by ID using CUSTOMERID_API
// const getCustomerById = async (customerId) => {
//   try {
//     console.log("Fetching customer with ID:", customerId);

//     // Fetch customer details from CUSTOMERID_API
//     const customerResponse = await axios.get(`${CUSTOMERID_API}/${customerId}`);
//     const customerData = customerResponse.data?.customer || {};

//     console.log("Customer Data fetched:", customerData);

//     // Check if the customer has addresses
//     if (customerData.CustomerID) {
//       // Fetch addresses from ADDRESS_API using the CustomerID
//       const addressResponse = await axios.get(`${ADDRESS_API}/${customerData.CustomerID}`);
//       const addresses = addressResponse.data?.Addresses || [];

//       console.log("Addresses fetched:", addresses);
//     } 
//   } catch (error) {
//     console.error("Error fetching customer or addresses:", error);
//   }
// };

  const deleteCustomerById = async (customerId) => {
    setIsLoading(true); 
    try {
      const response = await axios.delete(
        // `https://imlystudios-backend-mqg4.onrender.com/api/customers/deleteCustomer/${customerId}`

        `${DELETECUSTOMERSBYID_API}/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = async (customerId) => {
    setIsLoading(true); 
    try {
      const customerDetails = await getCustomerById(customerId); 
      const addressDetails = await getCustomerAddressById(customerId); 
    
      setCustomerDetails(customerDetails);
      setAddressDetails(addressDetails);
      navigate("/Customerform");
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }finally {
      setIsLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = async (customerId) => {
    try {
      await deleteCustomerById(customerId);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  const handleExportCustomersData = async () => {
    try {
      const { customers } = await getAllCustomers(0, totalCustomers); // Fetch all users for export
      exportToExcel(customers, "Customers");
    } catch (error) {
      console.error("Error exporting users data:", error);
    }
  };

  const handleAddCustomerClick = () => {
    setCustomerDetails(null);
    navigate("/Customerform");
  };
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


useEffect(() => {
  if (selectedStore?.StoreID) {
    const filtered = Customers.filter(
      (customer) => customer.StoreID === selectedStore.StoreID
    );
    setFilteredCustomers(filtered);
  } else {
    setFilteredCustomers(Customers); 
  }
}, [selectedStore, Customers]);


const handleViewOrdersClick = async (customerId) => {
  setIsLoading(true); 
  try {
    // Fetch orders for the selected customer
    const response = await axios.get(`${ORDERBYCUSTOMERID_API}/${customerId}`);
    const customerDetails = await getCustomerById(customerId); 
    const addressDetails = await getCustomerAddressById(customerId); 
    setCustomerDetails(customerDetails);
    setAddressDetails(addressDetails);
    
    // Assuming your response contains an array of orders
    setOrders(response.data); // Set the orders in state

    // Log fetched orders
    console.log("Fetched Orders:", response.data);

    // Navigate to the Customer form with activeStep state
    navigate("/Customerform", { state: { activeStep: 2, orders: response.data } });
    
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Handle error, e.g., show a toast notification
  }finally {
    setIsLoading(false);
  }
};



  return (
    // <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:ml-10 lg:ml-72 w-auto">
    <div className="main-container">
      {/* <div className="mt-6 bg-white p-6 rounded-lg shadow-md "> */}
      {/* // <div className="mt-6 p-6 rounded-lg"> */}
      {/* <div className="flex flex-wrap items-center justify-between w-full">
    <h2 className="pl-4 text-xl font-semibold">Customers</h2>

   
    <ul className="flex flex-wrap items-center gap-2 p-2 justify-center w-full sm:w-auto sm:justify-end">
      <li>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-custom-darkblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-custom-lightblue hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={handleAddCustomerClick}
        >
          <FaPlus aria-hidden="true" className="-ml-0.5 h-4 w-4" />
          Add Customers
        </button>
      </li>
      <li>
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-custom-darkblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-custom-lightblue hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          onClick={handleExportCustomersData}
        >
          <FaTable aria-hidden="true" className="-ml-0.5 h-4 w-4" />
          Export Customers
        </button>
      </li>
    </ul>
  </div> */}
    <div className="body-container">
          <h2 className="heading">Customers</h2>
          <div className="search-button-group">
            <ul className="button-list">
              <li>
                <button
                  type="button"
                  className="action-button"
                  onClick={handleAddCustomerClick}
                >
                  <FaPlus aria-hidden="true" className="icon" />
                   Add Customers
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="action-button"
                  onClick={handleExportCustomersData}
                >
                  <FaTable aria-hidden="true" className="icon" />
                  Export Customers
                </button>
              </li>
            </ul>
          </div>
        </div>

<div className="flex-container">
  {/* <div className="combobox-container">
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
  </div> */}

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


<TableContainer component={Paper} className="mt-4">
  <Table>
    <TableHead>
      <TableRow>
        <StyledTableCell style={{ width: "25%" }}>Name</StyledTableCell>
        <StyledTableCell style={{ width: "20%" }}>Email</StyledTableCell>
        <StyledTableCell style={{ width: "15%" }}>Mobile No</StyledTableCell>
        <StyledTableCell style={{ width: "15%" }}>Gender</StyledTableCell>
        {/* <StyledTableCell style={{ width: "20%" }}>Actions</StyledTableCell> */}
        <StyledTableCell style={{ width: "20%" }} align="center">Actions</StyledTableCell>

       

      </TableRow>
    </TableHead>
    {/* <TableBody>
      {filteredCustomers.map((person, index) => (
        <StyledTableRow key={index}>
          <StyledTableCell>
            <div className="flex items-center space-x-2">
              <span>{person.FirstName}</span>
              <span>{person.LastName}</span>
            </div>
          </StyledTableCell>
          <StyledTableCell>{person.Email}</StyledTableCell>
          <StyledTableCell>{person.PhoneNumber}</StyledTableCell>
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
                ? "Male"
                : "Female"}
            </span>
          </StyledTableCell>
          <StyledTableCell>
            <div className="button-container">
              <button
                type="button"
                onClick={() => handleEditClick(person.CustomerID)}
                className="button edit-button"
              >
                <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteClick(person.CustomerID)}
                className="button delete-button"
              >
                <MdOutlineCancel aria-hidden="true" className="h-4 w-4" />
                Delete
              </button>
            </div>
          </StyledTableCell>
        </StyledTableRow>
      ))}
    </TableBody> */}
    <TableBody>
  {filteredCustomers.length > 0 ? (
    filteredCustomers.map((person, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell>
          <div className="flex items-center space-x-2">
            <span>{person.CustomerFirstName}</span>
            <span>{person.CustomerLastName}</span>
          </div>
        </StyledTableCell>
        <StyledTableCell>{person.CustomerEmail}</StyledTableCell>
        <StyledTableCell>{person.PhoneNumber}</StyledTableCell>
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
              ? "Male"
              : "Female"}
          </span>
        </StyledTableCell>
        <StyledTableCell>
          <div className="button-container">
            <button
              type="button"
              onClick={() => handleEditClick(person.CustomerID)}
              className="button edit-button"
            >
              <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDeleteClick(person.CustomerID)}
              className="button delete-button"
            >
              <MdOutlineCancel aria-hidden="true" className="h-4 w-4" />
              Delete
            </button>
            {/* <button
              type="button"
              onClick={() => handleDeleteClick(person.CustomerID)}
              className="button delete-button"
            >
             <GrFormView aria-hidden="true" className="h-4 w-4" />
             View Orders
            </button> */}
          {/* <button
  type="button"
  onClick={() => {
    handleViewOrdersClick(person.CustomerID);
    setActiveStep(2); 
  }}
  className="button view-button"
>
  <GrFormView aria-hidden="true" className="h-5 w-5" />
  View Orders
</button> */}
<button
  type="button"
  onClick={() => {
    handleViewOrdersClick(person.CustomerID);
    setActiveStep(2);
  }}
  className="button view-button w-32 whitespace-nowrap" /* Prevents text from splitting */
>
  <GrFormView aria-hidden="true" className="h-5 w-5" />
  View Orders
</button>



          </div>
        </StyledTableCell>
      </StyledTableRow>
    ))
  ) : (
    <StyledTableRow>
      <StyledTableCell colSpan={5} align="center">
        No customers found.
      </StyledTableCell>
    </StyledTableRow>
  )}
</TableBody>
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[10, 20, 25]}
          colSpan={6}
          count={totalCustomers}
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



        {isLoading && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
        <LoadingAnimation />
      </div>
    )}
      </div>
    // </div>
  );
}

export default Customers;