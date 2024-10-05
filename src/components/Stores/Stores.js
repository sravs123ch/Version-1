import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { FaPlus, FaTable } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineEdit } from "react-icons/ai";
import * as XLSX from "xlsx";
import { StoreContext } from '../../Context/storeContext';
import axios from 'axios';
import { GETALLSTORES_API ,GETALLSTORESBYID_API , DELETESTORESSBYID_API } from '../../Constants/apiRoutes';
import { MdOutlineCancel } from "react-icons/md";
import "../../style.css";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import LoadingAnimation from "../../components/Loading/LoadingAnimation";

function Stores() {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [totalStores, setTotalStores] = useState(0);
  const { setStoreDetails } = useContext(StoreContext);
  const navigate = useNavigate();
  const [paginatedPeople, setPaginatedPeople] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllStores = async (pageNum, pageSize, search = "") => {
    try {
      const response = await axios.get(
        // "https://imlystudios-backend-mqg4.onrender.com/api/stores/getAllStores",
        GETALLSTORES_API,
        {
          params: {
            pageNumber: pageNum + 1,
            pageSize: pageSize,
            SearchText: searchName,
          }
        }
      );

      // Log the entire API response to understand its structure
      console.log("API Response:", response.data);

      return {
        stores: response.data.Stores || [], // Correctly access the 'Stores' field
        totalCount: response.data.totalItems || 0 // Use 'totalItems' for total count
      };
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  };

  const fetchStores = async () => {
    console.log("Fetching data for page:", page);
    try {
      const { stores, totalCount } = await getAllStores(page, rowsPerPage, searchName);
      
      setPaginatedPeople(stores);
      console.log('Fetched stores:', stores);
      console.log('Total stores count:', totalCount);
      setStores(stores);
      setTotalStores(totalCount);
      // Only update filtered customers if no search is active
      if (!isSearching) {
        setFilteredStores(stores); // Set initial filtered customers to all fetched data
      }

      setTotalStores(totalCount);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  
  };


  useEffect(() => {
    fetchStores();
  }, [page, rowsPerPage, searchName]);


  const handleChangePage = (event, newPage) => {
    console.log("Current page:", page);
    console.log("Requested page:", newPage);
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    console.log("Rows per page changed to:", event.target.value);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0
  };

  const getStoreById = async (storeId) => {
    try {
      const response = await axios.get(
        // `https://imlystudios-backend-mqg4.onrender.com/api/stores/getStoreById/${storeId}`
        `${GETALLSTORESBYID_API}/${storeId}`
        
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching store:", error);
      throw error;
    }
  };

  const deleteStoreById = async (storeId) => {
    try {
      setIsLoading(true); 
      const response = await axios.delete(
        // `https://imlystudios-backend-mqg4.onrender.com/api/stores/deleteStore/${storeId}`
        `${DELETESTORESSBYID_API}/${storeId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (storeId) => {
    setIsLoading(true); 
    try {
      const storeDetails = await getStoreById(storeId);
      setStoreDetails(storeDetails);
      // Navigate to the update page with the store ID
      navigate(`/Storesform`);
    } catch (error) {
      console.error('Error handling edit:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (storeId) => {
    try {
      await deleteStoreById(storeId);
      fetchStores(); // Refresh store list after deletion
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };

  const handleExportStoresData = () => {
    const ws = XLSX.utils.json_to_sheet(stores);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stores");
    XLSX.writeFile(wb, "Stores.xlsx");
  };

  const handleAddStoreClick = () => {
    setStoreDetails(null);
    navigate("/Storesform"); // Navigate to the add store page
  };

  const handleEditClick = (storeId) => {
    handleEdit(storeId); // Call existing handleEdit function
  };

  const handleDeleteClick = (storeId) => {
    handleDelete(storeId); // Call existing handleDelete function
  };
  const searchItems = (searchValue) => {
    setSearchName(searchValue);

    if (searchValue === "") {
      setIsSearching(false); 
      setFilteredStores(paginatedPeople); 
    } else {
      setIsSearching(true); // Enable search mode
      const filteredData = paginatedPeople.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredStores(filteredData);
    }
  };

  
  return (


    // <div className="px-4 sm:px-6 lg:px-8 pt-4 ml-10 lg:ml-72 w-auto">
    <div className="main-container">
      {/* <div className="mt-6 bg-white p-6 rounded-lg shadow-md"> */}
      {/* <div className="mt-6  p-6 rounded-lg "> */}
        <div className="body-container">
  <h2 className="heading">Stores</h2>
     <div className="search-button-group">
            <div className="search-container">
              <label htmlFor="searchName" className="sr-only">
                Search
              </label>
              <input
                id="searchName"
                type="text"
                placeholder="Search by Name or Email or Mobile"
                value={searchName}
                onChange={(e) => searchItems(e.target.value)}
                className="mt-1 p-2 pr-10 border border-gray-300 rounded-md w-full "
              />
              <div className="search-icon-container text-gray-500">
                <IoIosSearch />
              </div>
            </div>


    <ul className="button-list">
      <li>
        <button
          type="button"
          className="action-button"
          onClick={handleAddStoreClick}
        >
          <FaPlus aria-hidden="true" className="icon" />
          Add Stores
        </button>
      </li>
      <li>
        <button
          type="button"
          className="action-button"
          onClick={handleExportStoresData}
        >
          <FaTable aria-hidden="true" className="icon" />
          Export Stores
        </button>
      </li>
    </ul>
  </div>
</div>



        <TableContainer component={Paper} className="mt-4 rounded-lg shadow">
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Stores</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.map((store, index) => (
                <StyledTableRow key={store.StoreID}>
                  <StyledTableCell>{store.StoreName}</StyledTableCell>
                  <StyledTableCell>{store.Email}</StyledTableCell>
                  <StyledTableCell>{store.Phone}</StyledTableCell>
                  <StyledTableCell>
                    {`${store.AddressLine1 || ''} ${store.AddressLine2 || ''}`}
                  </StyledTableCell>

              
                     
 <StyledTableCell>
 
<div className="button-container">
  <button
    type="button"
    onClick={() => handleEditClick(store.StoreID)}
    className="button edit-button"
  >
    <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteClick(store.StoreID)}
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
                  rowsPerPageOptions={[10, 25, 50]}
                  count={totalStores}
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
      // <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-700">
        <LoadingAnimation />
      // </div>
    )}
      </div>
    // </div >
  );
}

export default Stores;
