// import React, { useState, useContext, useEffect } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import { FaUpload, FaEdit, FaTrashAlt } from "react-icons/fa";
// import { IoMdAddCircleOutline } from "react-icons/io";
// import { AiOutlineEye } from "react-icons/ai";
// import { FiDownload } from "react-icons/fi";
// import StatusBadge from "./Statuses"; // Make sure you have this component
// import Step2 from "./payment";
// import { useNavigate } from "react-router-dom";
// import { CREATEORUPDATE_ORDER_HISTORY__API, GET_ALL_HYSTORYID_API } from "../../Constants/apiRoutes";
// import LoadingAnimation from "../Loading/LoadingAnimation";
// import { IdContext } from "../../Context/IdContext";
// import { GETORDERBYID_API } from "../../Constants/apiRoutes";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Combobox } from "@headlessui/react";
// import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
// import {
//   StyledTableCell,
//   StyledTableRow,
//   TablePaginationActions,
// } from "../CustomTablePagination";
// import { AiOutlineEdit } from "react-icons/ai";
// import { MdOutlineCancel } from "react-icons/md";

// const YourComponent = ({ onBack, onNext }) => {
//   // Define state for orders, images, pdfPreview, errors, etc.
//   const [formOrderDetails, setFormOrderDetails] = useState({
//     OrderStatus: "",
//     ExpectedDurationDays: "",
//     DeliveryDate: "",
//     Comments: "",
//     UploadDocument: "",
//     StartDate:"",
//   });
//   const [images, setImages] = useState([]);
//   const [editMode, setEditMode] = useState(false);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [pdfPreview, setPdfPreview] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [orders, setOrders] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [showModal, setShowModal] = useState(false);
//   const [popupMessage, setPopupMessage] = useState("");
//   const navigate = useNavigate();
//   const [activeStep, setActiveStep] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   {
//     activeStep === 2 && <Step2 />;
//   }
//   const { generatedId, customerId, orderDate } = useContext(IdContext);
//   const [orderStatusList, setOrderStatusList] = useState([]);
//   useEffect(() => {
//     const fetchOrderStatuses = async () => {
//       try {
//         const response = await fetch(
//           "https://imly-b2y.onrender.com/api/Orderstatus/getAllOrderStatus"
//         );
//         const data = await response.json();

//         // Log the data to see its structure
//         console.log("Fetched Order Statuses:", data);

//         // Check if data is in the expected format
//         if (Array.isArray(data.data)) {
//           setOrderStatusList(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching order statuses:", error);
//       }
//     };

//     fetchOrderStatuses();
//   }, []);
//   const handleChanging = (e) => {
//     const { value } = e.target;

//     const selectedStatus = orderStatusList.find(
//       (status) => status.StatusID === parseInt(value)
//     );

//     // Update orderDetails with selected OrderStatus and StatusID
//     setFormOrderDetails({
//       OrderStatus: selectedStatus ? selectedStatus.OrderStatus : "",
//       StatusID: value, // Store StatusID directly from selection
//     });
//   };
//   const saveOrderHistory = () => {
//     // Extract necessary data for validation
//     const { StatusID, OrderStatus } = formOrderDetails;
//     const { DeliveryDate, Comments } = formOrderDetails;

//     if (!DeliveryDate) {
//       toast.error("Delivery date is required.", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//       return;
//     }

//     // Continue with saving the order history if validation passes
//     const orderHistoryData = {
//       TenantID: 1,
//       OrderHistoryID: 0,
//       OrderID: generatedId,
//       StatusID: StatusID || 0,
//       StartDate: orderDate,
//       EndDate: formOrderDetails.DeliveryDate,
//       AssignTo: "2",
//       Comments: formOrderDetails.Comments,
//       UserID: 2,
//       CreatedBy: "sandy",
//       OrderHistoryStatus: OrderStatus || "",
//       DocumentName: formOrderDetails.DocumentName,
//     };

//     fetch(CREATEORUPDATE_ORDER_HISTORY__API, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderHistoryData),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("API Response:", data); // Log the response

//         // Check if the response's StatusCode indicates success
//         if (data.StatusCode === "SUCCESS") {
//           toast.success("Status created successfully!", {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//             progress: undefined,
//           });

//           closeModalAndMoveToNextStep(); // Close modal and move to next step
//         } else {
//           // Handle error from the API response
//           toast.error(
//             data.message || "Error occurred while creating the status.",
//             {
//               position: "top-right",
//               autoClose: 5000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//               progress: undefined,
//             }
//           );
//           closeModalAfterDelay(); // Close modal after a delay for errors
//         }
//       })
//       .catch((error) => {
//         // Handle network or other errors
//         toast.error('' + error.message, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         });
//         closeModalAfterDelay(); // Close modal after a delay for errors
//       });
//   };
//   // Close the modal and move to the next step after a delay
//   const closeModalAndMoveToNextStep = () => {
//     setTimeout(() => {
//       setShowModal(false);
//       onNext(); // Move to the next step
//     }, 8000); // Delay of 4 seconds
//   };

//   // Close the modal after a delay (for error cases)
//   const closeModalAfterDelay = () => {
//     setTimeout(() => {
//       setShowModal(false); // Close the modal after a delay
//     }, 8000); // Delay of 4 seconds
//   };
//   // const handleChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setFormOrderDetails({ ...formOrderDetails, [name]: value });
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormOrderDetails((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };
//   // };
//   const handledate = (e) => {
//     const { name, value } = e.target;

//     setFormOrderDetails((prevDetails) => {
//       const updatedDetails = { ...prevDetails, [name]: value };

//       // If ExpectedDurationDays is changed, validate and update DeliveryDate automatically
//       if (name === "ExpectedDurationDays") {
//         const days = parseInt(value, 10); // Parse the value as an integer

//         if (!isNaN(days) && days >= 0) {
//           // Only update DeliveryDate if the value is a valid non-negative number
//           const today = new Date();
//           const deliveryDate = addDays(today, days + 1); // Add 1 extra day for a 5-day gap
//           updatedDetails.DeliveryDate = deliveryDate;

//           // Clear any previous error
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "",
//           }));
//         } else if (value === "") {
//           // Clear DeliveryDate if ExpectedDurationDays is cleared
//           updatedDetails.DeliveryDate = "";
//         } else {
//           // Set an error message if the value is not a valid number
//           setErrors((prevErrors) => ({
//             ...prevErrors,
//             ExpectedDurationDays: "Please enter a valid number of days.",
//           }));
//         }
//       }

//       return updatedDetails;
//     });
//   };
//   const formatDate = (isoDate) => {
//     if (!isoDate) return ""; // Return empty if no date is present
//     return new Date(isoDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
//   };
//   const handleDateChanging = (e) => {
//     const { value } = e.target;
//     setFormOrderDetails((prevDetails) => ({
//       ...prevDetails,
//       DeliveryDate: value, // Manually update the DeliveryDate
//     }));
//     const newDate = e.target.value;
//     const isoDate = new Date(newDate).toISOString(); // Convert back to ISO format
//     setFormOrderDetails({ ...formOrderDetails, DeliveryDate: isoDate });
//   };
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (images.length + files.length > 6) {
//       alert("You can only upload up to 6 images.");
//       return;
//     }
//     const newImages = files.map((file) => ({
//       file,
//       preview: URL.createObjectURL(file),
//     }));
//     setImages([...images, ...newImages]);
//     setImagePreviews([
//       ...imagePreviews,
//       ...newImages.map((img) => img.preview),
//     ]);
//   };
//   const handleImageRemove = (index) => {
//     const newImages = images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);
//     setImages(newImages);
//     setImagePreviews(newPreviews);
//   };
//   const handlePdfRemove = () => {
//     setPdfFile(null);
//     setPdfPreview("");
//   };
//   const [file, setFile] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const handleDelete = () => {
//     setFile(null);
//   };
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };
//   const addDays = (date, days) => {
//     let result = new Date(date);
//     result.setDate(result.getDate() + days);
//     return result.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
//   };
//   const handleCancel = () => {
//     // Example: Reset form or navigate to a different page
//     console.log("Cancel clicked");
//     // If you want to navigate away from the form, for example:
//     navigate("/Orders"); // This assumes you're using `react-router-dom` for navigation
//   };
//   const [selectedStatus, setSelectedStatus] = useState(
//     formOrderDetails.StatusID || ""
//   );
//   const [query, setQuery] = useState("");

//   const filteredStatusList =
//     query === ""
//       ? orderStatusList
//       : orderStatusList.filter((status) =>
//         status.OrderStatus.toLowerCase().includes(query.toLowerCase())
//       );

//   // const handleSelect = (statusID) => {
//   //   const selectedStatus = orderStatusList.find((status) => status.StatusID === statusID);
//   //   setFormOrderDetails((prev) => ({
//   //       ...prev,
//   //       StatusID: selectedStatus?.StatusID || "", // Update StatusID
//   //   }));
//   // };

//   const handleSelect = (statusID) => {
//     console.log("Selected status ID:", statusID); // Log the selected status ID
//     setSelectedStatus(statusID); // Update the selected status
//     setFormOrderDetails((prevState) => ({
//       ...prevState,
//       OrderStatus: statusID, // Update formOrderDetails with the selected status ID
//     }));
//   };
//   // Helper function to calculate the duration between two dates
//   const calculateDurationDays = (startDate, endDate) => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Difference in days
//     return duration;
//   };
//   const [statusDetails, setStatusDetails] = useState([]);
//   const fetchOrderDetails = async () => {
//     setLoading(true);
//     try {
//         const response = await fetch(`${GET_ALL_HYSTORYID_API}${generatedId}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }

//         const result = await response.json();
//         console.log("API Response:", result); // Log the entire response

//         // Check if result contains the expected fields
//         const statuses = Array.isArray(result) ? result : [result];
//         statuses.forEach(item => {
//             console.log("OrderID:", item.OrderID, "EndDate:", item.EndDate);
//         });

//         // Map the result to statusDetails
//         const mappedStatusDetails = statuses.map((status) => ({
//             StatusID:status.StatusID || "N/A",
//             OrderID: status.OrderID || "N/A",
//             OrderStatus: status.OrderStatus || "N/A",
//             DeliveryDate: status.EndDate || "N/A",
//             Comments: status.Comment || "N/A",
//             OrderHistoryID: status.OrderHistoryID || "N/A",
//             StartDate:status.StartDate||"N/A",
//             ExpectedDurationDays: status.ExpectedDurationDays || "N/A",
//             DownloadDocuments: status.DownloadDocuments?.length > 0 ? status.DownloadDocuments : "No Documents",
//         }));

//         console.log("Mapped Status Details:", mappedStatusDetails); // Log mapped details
//         setStatusDetails(mappedStatusDetails);
//     } catch (err) {
//         setError(err.message);
//         console.error("Fetch Error:", err.message); // Log fetch error
//     } finally {
//         setLoading(false);
//     }
// };

// useEffect(() => {
//     fetchOrderDetails();
// }, [generatedId]);

// const handleEditstatus = (historyId, statusId) => {
//   console.log("Attempting to edit Payment with historyId:", historyId);
//   console.log("Available OrderHistoryIDs:", statusDetails.map(status => status.OrderHistoryID));

//   // Find the specific order status based on the selected historyId
//   const statusData = statusDetails.find((status) => status.OrderHistoryID === historyId);

//   if (statusData) {
//       // Set the form order details with the data found
//       setFormOrderDetails({
//           OrderID: statusData.OrderID || "",
//           OrderHistoryID: statusData.OrderHistoryID || "",
//           OrderStatus: statusData.OrderStatus || "N/A",
//           DeliveryDate: statusData.DeliveryDate || "",
//           Comments: statusData.Comments || "",
//           StartDate: statusData.StartDate || "",
//           DownloadDocuments: statusData.DownloadDocuments || [],
//           StatusID: statusId || "",
//       });

//       // Find the status from orderStatusList where the status matches and set the StatusID
//       const statusToSelect = orderStatusList.find(status => status.OrderStatus === statusData.OrderStatus);
//       if (statusToSelect) {
//           setSelectedStatus(statusToSelect.StatusID); // Set the selected status ID
//       }

//       // Log the updated form details
//       console.log("Form Details after setting:", formOrderDetails.OrderStatus);

//       // Enable edit mode
//       setEditMode(true);
//   } else {
//       console.error("No valid data found for the provided historyId:", historyId);
//   }
// };

// // Log updated formOrderDetails
// useEffect(() => {
//     console.log("FormOrderDetails updated:", formOrderDetails);
// }, [formOrderDetails]);
//   return (
//     <Box
//       sx={{
//         display: "grid",
//         gridTemplateColumns: { xs: "1fr", sm: " 1fr" }, // Ensure proper grid layout
//         gap: 2, // Adjust spacing between items
//         justifyContent: "center",
//         alignItems: "center",
//         pt: 2,
//       }}
//     >
//       <>
//         <div className="flex flex-col items-center sm:ml-0 lg:ml-50 gap-4">
//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
//             <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
//               Order Status:
//             </label>

//             <Combobox value={selectedStatus} onChange={handleSelect}>
//               <div className="relative w-full sm:w-1/4">
//                 <Combobox.Input
//                   className={`p-1 w-full border rounded-md ${errors.OrderStatus ? "border-red-500" : "border-gray-300"
//                     }`}
//                   onChange={(e) => setQuery(e.target.value)}
//                   displayValue={(statusID) =>
//                     orderStatusList.find(
//                       (status) => status.StatusID === statusID
//                     )?.OrderStatus || ""
//                   }
//                 />
//                 <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
//                   <ChevronUpDownIcon
//                     className="h-5 w-5 text-gray-400"
//                     aria-hidden="true"
//                   />
//                 </Combobox.Button>
//                 <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
//                   {filteredStatusList.length > 0 ? (
//                     filteredStatusList.map((status) => (
//                       <Combobox.Option
//                         key={status.StatusID}
//                         value={status.StatusID}
//                         className={({ active }) =>
//                           `cursor-pointer select-none relative p-2 ${active ? "bg-blue-500 text-white" : "text-gray-900"
//                           }`
//                         }
//                       >
//                         {status.OrderStatus}
//                       </Combobox.Option>
//                     ))
//                   ) : (
//                     <div className="p-2 text-gray-500">No found</div>
//                   )}
//                 </Combobox.Options>
//               </div>
//             </Combobox>

//             {errors.OrderStatus && (
//               <p className="text-red-500 text-sm ml-2">{errors.OrderStatus}</p>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
//             <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
//               Comments
//             </label>
//             <input
//               type="text"
//               name="Comments"
//               value={formOrderDetails.Comments}
//               onChange={(e) =>
//                 setFormOrderDetails({ ...formOrderDetails, Comments: e.target.value })}
//               className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.Comments ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             {errors.Comments && (
//               <p className="text-red-500 text-sm ml-2">{errors.Comments}</p>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
//             <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
//             StartDate
//             </label>
//             <input
//               type="date"
//               name="StartDate"
//               value={formatDate(formOrderDetails.StartDate)}
//               onChange={handleChange}
//               className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.StartDate
//                 ? "border-red-500"
//                 : "border-gray-300"
//                 }`}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
//             <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
//               End Date:
//             </label>
//             <input
//               type="date"
//               name="DeliveryDate"
//               value={formatDate(formOrderDetails.DeliveryDate)}
//               onChange={handleDateChanging}
//               className={`p-1 w-full sm:w-1/4 border rounded-md ${errors.DeliveryDate ? "border-red-500" : "border-gray-300"
//                 }`}
//             />
//             {errors.DeliveryDate && (
//               <p className="text-red-500 text-sm ml-2">{errors.DeliveryDate}</p>
//             )}
//           </div>

//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
//             <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
//               Upload Document:
//             </label>
//             <input
//               type="file"
//               multiple
//               value={formOrderDetails.DocumentName}
//               accept="image/*,application/pdf,.doc,.docx"
//               onChange={handleImageChange}
//               className="hidden"
//               id="UploadFiles"
//             />
//             <label
//               htmlFor="UploadFiles"
//               className="flex items-center justify-center px-4 py-2 p-1 w-full sm:w-1/4 border rounded-md border border-black-500 text-black-500 cursor-pointer hover:bg-blue-50"
//             >
//               <FaUpload className="mr-2" />
//               <span>Upload File</span>
//             </label>
//           </div>

//           {images.length > 0 && (
//             <div className="flex items-center mt-2 space-x-2 flex-wrap">
//               {imagePreviews.map((preview, index) => (
//                 <div key={index} className="relative inline-block">
//                   <img
//                     src={preview}
//                     alt={`Preview ${index}`}
//                     className="w-24 h-24 object-cover"
//                   />
//                   <button
//                     onClick={() => handleImageRemove(index)}
//                     className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
//                   >
//                     x
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {pdfPreview && (
//             <div className="mt-2 flex items-center">
//               <a
//                 href={pdfPreview}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 underline"
//               >
//                 View PDF
//               </a>
//               <button
//                 onClick={handlePdfRemove}
//                 className="ml-4 bg-red-500 text-white p-1 rounded-full text-xs"
//               >
//                 x
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="relative mt-10 flex justify-end gap-4">
//           <div className="mt-6 flex justify-end gap-4">
//             <button
//               type="submit"
//               className="button-base save-btn"
//               onClick={() => {
//                 saveOrderHistory();
//                 // handleAddOrder();
//               }}
//             >
//               Save
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="button-base cancel-btn"
//             >
//               Cancel
//             </button>
//           </div>
//           {showModal && (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//               <div className="bg-white rounded-lg p-6 text-center shadow-lg w-11/12 max-w-sm">
//                 <p className="text-lg">{popupMessage}</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {orders.length >= 0 && (
//           <>
//             <TableContainer component={Paper} className="mt-4 shadow-md">
//               <Table
//                 aria-label="orders table"
//                 className="min-w-full border-collapse border border-gray-300"
//               >
//                 <TableHead className="bg-custom-darkblue">
//                   <TableRow>
//                     <StyledTableCell
//                       align="center"
//                       sx={{
//                         borderRight: "1px solid #e5e7eb",
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Order Status
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{
//                         borderRight: "1px solid #e5e7eb",
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       End Date
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{
//                         borderRight: "1px solid #e5e7eb",
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Comments
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{
//                         borderRight: "1px solid #e5e7eb",
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Document
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{
//                         borderRight: "1px solid #e5e7eb",
//                         color: "white",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Edit
//                     </StyledTableCell>
//                     <StyledTableCell
//                       align="center"
//                       sx={{ color: "white", fontWeight: "bold" }}
//                     >
//                       Delete
//                     </StyledTableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {statusDetails.length > 0 ? (
//                     statusDetails.map((status, index) => (
//                       <TableRow key={index} className="hover:bg-gray-100">
//                         {/* Order Status */}
//                         <StyledTableCell
//                           align="center"
//                           className="border-r border-gray-300"
//                         >
//                           <StatusBadge status={status.OrderStatus} />
//                         </StyledTableCell>

//                         {/* Delivery Date */}
//                         <StyledTableCell
//                           align="center"
//                           className="border-r border-gray-300"
//                         >
//                           {status.DeliveryDate
//                             ? new Date(status.DeliveryDate).toLocaleDateString()
//                             : "N/A"}
//                         </StyledTableCell>

//                         {/* Comments */}
//                         <StyledTableCell
//                           align="center"
//                           className="border-r border-gray-300"
//                         >
//                           {status.Comments || "N/A"}
//                         </StyledTableCell>

//                         {/* Document Links */}
//                         <StyledTableCell
//                           align="center"
//                           className="border-r border-gray-300"
//                         >
//                           {status.UploadDocument ? (
//                             <>
//                               <IconButton
//                                 href={status.UploadDocument}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 color="primary"
//                               >
//                                 <AiOutlineEye size={20} />
//                                 <span className="ml-2 font-bold text-sm">View</span>
//                               </IconButton>
//                               <IconButton
//                                 href={status.UploadDocument}
//                                 download
//                                 color="success"
//                               >
//                                 <FiDownload size={20} />
//                                 <span className="font-bold text-sm">Download</span>
//                               </IconButton>
//                             </>
//                           ) : (
//                             "No Documents"
//                           )}
//                         </StyledTableCell>

//                         {/* Edit Button */}
//                         <StyledTableCell align="center" className="border-r border-gray-300">
//                           <div className="button-container justify-center">
//                             <button
//                               type="button"
//                               onClick={() => handleEditstatus(status.OrderHistoryID)}
//                               className="button edit-button"
//                             >
//                               <AiOutlineEdit aria-hidden="true" className="h-4 w-4" />
//                               Edit
//                             </button>
//                           </div>
//                         </StyledTableCell>

//                         {/* Delete Button */}
//                         <StyledTableCell align="center">
//                           <div className="button-container justify-center">
//                             <button
//                               type="button"
//                               // onClick={() => handleDelete(generatedId)}
//                               className="button delete-button"
//                             >
//                               <MdOutlineCancel aria-hidden="true" className="h-4 w-4" />
//                               Delete
//                             </button>
//                           </div>
//                         </StyledTableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <StyledTableCell align="center" colSpan={6}>
//                         {loading ? "Loading..." : error ? error : "No Order Found"}
//                       </StyledTableCell>
//                     </TableRow>
//                   )}

//                 </TableBody>
//               </Table>
//             </TableContainer>

//             <TablePagination
//               rowsPerPageOptions={[5, 10, 25]}
//               component="div"
//               count={orders.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </>
//         )}
//       </>
//     </Box>
//   );
// };

// export default YourComponent;

import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
} from "@mui/material";
import { FaUpload, FaEdit, FaTrashAlt } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import StatusBadge from "./Statuses"; // Make sure you have this component
import Step2 from "./payment";
import { useNavigate } from "react-router-dom";
import {
  CREATEORUPDATE_ORDER_HISTORY__API,
  GET_ALL_HYSTORYID_API,
} from "../../Constants/apiRoutes";
import LoadingAnimation from "../Loading/LoadingAnimation";
import { IdContext } from "../../Context/IdContext";
import { GETORDERBYID_API } from "../../Constants/apiRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import {
  StyledTableCell,
  StyledTableRow,
  TablePaginationActions,
} from "../CustomTablePagination";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import { OrderContext } from "../../Context/orderContext";
import { useLocation } from "react-router-dom";

const YourComponent = ({ onBack, onNext }) => {
  const steps = [
    {
      label: "Order Placed",
      description: "The order has been placed successfully.",
    },
    {
      label: "Order Processed",
      description: "The order is currently being processed.",
    },
    {
      label: "Order Shipped",
      description: "The order has been shipped to the delivery address.",
    },
    {
      label: "Order Delivered",
      description: "The order has been delivered to the customer.",
    },
  ];

  const orderStatuses = [
    "Order Placed",
    "Order Processed",
    "Order Shipped",
    "Order Delivered",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setSelectedStatus("");
  // };

  const handleOrderStatusChange = (event) => {
    const status = event.target.value;
    setSelectedStatus(status);
    const statusIndex = orderStatuses.indexOf(status);
    setActiveStep(statusIndex);
  };

  // Define state for orders, images, pdfPreview, errors, etc.
  const [formOrderDetails, setFormOrderDetails] = useState({
    OrderStatus: "",
    ExpectedDays: "",
    DeliveryDate: "",
    Comments: "",
    UploadDocument: "",
    StartDate: new Date().toISOString().split("T")[0], // Set StartDate to today's date in YYYY-MM-DD format
  });
  const { orderIdDetails } = useContext(OrderContext);
  const location = useLocation();

  // Get orderId from either location state or context
  const { orderId } = location.state || {};
  const OrderID = orderId || orderIdDetails?.order?.OrderID;

  console.log(orderIdDetails?.order?.OrderID);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [images, setImages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [pdfPreviews, setPdfPreviews] = useState([]);
  {
    activeStep === 2 && <Step2 />;
  }
  const { generatedId, customerId, orderDate } = useContext(IdContext);
  const [orderStatusList, setOrderStatusList] = useState([]);
  useEffect(() => {
    const fetchOrderStatuses = async () => {
      try {
        const response = await fetch(
          "https://imly-b2y.onrender.com/api/Orderstatus/getAllOrderStatus"
        );
        const data = await response.json();

        // Log the data to see its structure
        console.log("Fetched Order Statuses:", data);

        // Check if data is in the expected format
        if (Array.isArray(data.data)) {
          setOrderStatusList(data.data);
        }
      } catch (error) {
        console.error("Error fetching order statuses:", error);
      }
    };

    fetchOrderStatuses();
  }, []);

  const handleChanging = (value) => {
    const selectedStatus = orderStatusList.find(
      (status) => status.StatusID === parseInt(value)
    );
    setSelectedStatus(selectedStatus.StatusID); // Update state to reflect change in the UI
    // Update formOrderDetails with the selected OrderStatus and StatusID
    setFormOrderDetails((prevState) => ({
      ...prevState,
      OrderStatus: selectedStatus ? selectedStatus.OrderStatus : "",
      StatusID: value, // Store StatusID directly from the selection
    }));
  };

  // Save order history function
  // Save order history function
  const saveOrderHistory = async () => {
    const { StatusID, OrderStatus, DeliveryDate, Comments } = formOrderDetails;

    // Validate required fields
    if (!DeliveryDate) {
      toast.error("Delivery date is required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    // Create a new FormData object
    const formData = new FormData();
    formData.append("TenantID", 1);
    formData.append(
      "OrderHistoryID",
      editMode ? formOrderDetails.OrderHistoryID : 0
    ); // Use existing ID for updates
    formData.append("OrderID", OrderID);
    formData.append("StatusID", StatusID || 0);
    formData.append("StartDate", orderDate);
    formData.append("EndDate", DeliveryDate);
    formData.append("AssignTo", "2");
    formData.append("Comments", Comments);
    formData.append("UserID", 2);
    formData.append("CreatedBy", "sandy");
    formData.append("OrderHistoryStatus", OrderStatus || "");

    // Append the binary data of each file as UploadDocument
    if (images && images.length > 0) {
      images.forEach((fileData, index) => {
        const { data, name, type } = fileData;
        const blob = new Blob([data], { type });
        formData.append("UploadDocument", blob, name);
      });
    }

    try {
      // API request to create or update order history
      const response = await fetch(CREATEORUPDATE_ORDER_HISTORY__API, {
        method:  "POST", // Use PUT for updates
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Conditional success messages
      if (data.StatusCode === "SUCCESS") {
        toast.success(
          editMode
            ? "Order status updated successfully!"
            : "Order history created successfully!",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        closeModalAndMoveToNextStep();
      } else {
        toast.error(
          data.message || "Error occurred while processing the request.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        closeModalAfterDelay();
      }
    } catch (error) {
      toast.error("" + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      closeModalAfterDelay();
    }
  };

  // Close the modal and move to the next step after a delay
  const closeModalAndMoveToNextStep = () => {
    setTimeout(() => {
      setShowModal(false);
      onNext(); // Move to the next step
    }, 3000); // Delay of 4 seconds
  };

  // Close the modal after a delay (for error cases)
  const closeModalAfterDelay = () => {
    setTimeout(() => {
      setShowModal(false); // Close the modal after a delay
    }, 3000); // Delay of 4 seconds
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormOrderDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handledate = (e) => {
    const { name, value } = e.target;
    setFormOrderDetails((prevDetails) => {
      const updatedDetails = { ...prevDetails, [name]: value };
      if (name === "ExpectedDurationDays") {
        const days = parseInt(value, 10);
        if (!isNaN(days) && days >= 0) {
          const today = new Date();
          updatedDetails.DeliveryDate = addDays(today, days);
        } else {
          updatedDetails.DeliveryDate = ""; // Reset if invalid
        }
      }
      return updatedDetails;
    });
  };

  // const formatDate = (isoDate) => {
  //   if (!isoDate) return ""; // Return empty if no date is present
  //   return new Date(isoDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
  // };
  // const handleDateChanging = (e) => {
  //   const { value } = e.target;
  //   setFormOrderDetails((prevDetails) => ({
  //     ...prevDetails,
  //     DeliveryDate: value, // Manually update the DeliveryDate
  //   }));
  //   const newDate = e.target.value;
  //   const isoDate = new Date(newDate).toISOString(); // Convert back to ISO format
  //   setFormOrderDetails({ ...formOrderDetails, DeliveryDate: isoDate });
  // };

  // Utility function to format the date as YYYY-MM-DD
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Return empty if no date is present
    return new Date(isoDate).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };
  const handleExpectedDaysChange = (e) => {
    const expectedDays = parseInt(e.target.value, 10);

    // Validate input
    if (isNaN(expectedDays) || expectedDays < 1) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ExpectedDays: "Please enter a valid number of days.",
      }));
      return;
    }

    // Clear any errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      ExpectedDays: "",
    }));

    // Calculate the delivery date based on StartDate
    const deliveryDate = calculateExpectedDeliveryDate(
      formOrderDetails.StartDate,
      expectedDays
    );

    // Update form state with expected days and delivery date
    setFormOrderDetails((prevDetails) => ({
      ...prevDetails,
      ExpectedDays: expectedDays,
      DeliveryDate: deliveryDate, // This will now correctly update
    }));
  };
  // Utility function to calculate the delivery date based on StartDate and ExpectedDays
  const calculateExpectedDeliveryDate = (startDate, daysToAdd) => {
    if (!startDate || isNaN(new Date(startDate))) {
      return ""; // Return an empty string if the startDate is invalid
    }
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysToAdd); // Add the number of days
    return formatDate(date); // Return in YYYY-MM-DD format
  };

  // Handler for manual changes in the Delivery Date input (if needed)
  const handleDateChanging = (e) => {
    const { value } = e.target;
    const newDate = new Date(value);

    if (isNaN(newDate)) {
      setFormOrderDetails((prevDetails) => ({
        ...prevDetails,
        DeliveryDate: "", // Reset if invalid
      }));
    } else {
      setFormOrderDetails((prevDetails) => ({
        ...prevDetails,
        DeliveryDate: newDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      }));
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files; // Get the FileList object from the input
    const selectedFiles = Array.from(files); // Convert the FileList to an array

    const UploadDocuments = {}; // Object to store key-value pairs of document names
    const binaryFiles = []; // Array to store binary files
    const previews = [];

    selectedFiles.forEach((file, index) => {
      // Create a URL for preview if it's an image
      if (file.type.startsWith("image/")) {
        const previewUrl = URL.createObjectURL(file);
        previews.push(previewUrl); // Add to previews array
      }

      // Store document names as key-value pairs
      UploadDocuments[`Document_${index + 1}`] = file.name; // Store document names

      const reader = new FileReader();
      reader.onload = () => {
        // After reading the file, we can get the binary data
        const binaryData = reader.result;
        binaryFiles.push({
          name: file.name,
          type: file.type,
          data: binaryData,
        });

        // Check if the file is a PDF
        if (file.type === "application/pdf") {
          const pdfPreviewUrl = URL.createObjectURL(file); // Create a PDF preview URL
          setPdfPreviews((prev) => [...prev, pdfPreviewUrl]); // Store PDF previews
        }

        // After processing the last file, update the state
        if (index === selectedFiles.length - 1) {
          // Store image previews and binary files in state
          setImagePreviews(previews);
          setImages(binaryFiles); // Store the actual binary files for backend upload
          setFormOrderDetails((prev) => ({
            ...prev,
            UploadDocument: UploadDocuments, // Store document names
          }));
        }
      };

      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    });
  };

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      // Clean up image previews
      imagePreviews.forEach((url) => URL.revokeObjectURL(url)); // Release object URLs created
      pdfPreviews.forEach((url) => URL.revokeObjectURL(url)); // Release PDF preview URLs
    };
  }, [imagePreviews, pdfPreviews]);

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handlePdfRemove = (index) => {
    const newPdfPreviews = pdfPreviews.filter((_, i) => i !== index);
    setPdfPreviews(newPdfPreviews); // Update PDF previews
  };

  const [file, setFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const handleDelete = () => {
    setFile(null);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
  };
  const handleCancel = () => {
    // Example: Reset form or navigate to a different page
    console.log("Cancel clicked");
    // If you want to navigate away from the form, for example:
    navigate("/Orders"); // This assumes you're using `react-router-dom` for navigation
  };
  const [selectedStatus, setSelectedStatus] = useState(
    formOrderDetails.StatusID || ""
  );
  const [query, setQuery] = useState("");

  const filteredStatusList =
    query === ""
      ? orderStatusList
      : orderStatusList.filter((status) =>
          status.OrderStatus.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (statusID) => {
    console.log("Selected Status ID:", statusID);
    const selectedStatus = orderStatusList.find(
      (status) => status.StatusID === statusID
    );
    console.log("Selected Status:", selectedStatus);

    setFormOrderDetails({
      ...formOrderDetails,
      OrderStatus: selectedStatus ? selectedStatus.OrderStatus : "",
      StatusID: statusID,
    });
  };

  // Helper function to calculate the duration between two dates
  const calculateDurationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Difference in days
    return duration;
  };
  const [statusDetails, setStatusDetails] = useState([]);
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GET_ALL_HYSTORYID_API}${OrderID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      console.log("API Response:", result); // Log the entire response

      // Check if result contains the expected fields
      const statuses = Array.isArray(result) ? result : [result];
      statuses.forEach((item) => {
        console.log("OrderID:", item.OrderID, "EndDate:", item.EndDate);
      });

      // Map the result to statusDetails
      const mappedStatusDetails = statuses.map((status) => ({
        StatusID: status.StatusID || "N/A",
        OrderID: status.OrderID || "N/A",
        OrderStatus: status.OrderStatus || "N/A",
        DeliveryDate: status.EndDate || "N/A",
        Comments: status.Comment || "N/A",
        OrderHistoryID: status.OrderHistoryID || "N/A",
        StartDate: status.StartDate || "N/A",
        ExpectedDays: status.ExpectedDurationDays || "N/A",
        DownloadDocuments:
          status.DownloadDocuments?.length > 0
            ? status.DownloadDocuments
            : "No Documents",
        viewdocuments:
          status.viewdocuments?.length > 0
            ? status.viewdocuments
            : "No Documents",
      }));

      console.log("Mapped Status Details:", mappedStatusDetails); // Log mapped details
      setStatusDetails(mappedStatusDetails);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Error:", err.message); // Log fetch error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [generatedId]);

  const handleEditstatus = (historyId, statusId) => {
    console.log("Attempting to edit Payment with historyId:", historyId);
    console.log(
      "Available OrderHistoryIDs:",
      statusDetails.map((status) => status.OrderHistoryID)
    );

    // Find the specific order status based on the selected historyId
    const statusData = statusDetails.find(
      (status) => status.OrderHistoryID === historyId
    );

    if (statusData) {
      // Set the form order details with the data found
      setFormOrderDetails({
        OrderID: statusData.OrderID || "",
        OrderHistoryID: statusData.OrderHistoryID || "",
        OrderStatus: statusData.OrderStatus || "N/A",
        DeliveryDate: statusData.DeliveryDate || "",
        Comments: statusData.Comments || "",
        StartDate: statusData.StartDate || "",
        DownloadDocuments: statusData.DownloadDocuments || [],
        viewdocuments: statusData.viewdocuments || [],
        StatusID: statusId || "",
      });

      // Find the status from orderStatusList where the status matches and set the StatusID
      const statusToSelect = orderStatusList.find(
        (status) => status.OrderStatus === statusData.OrderStatus
      );
      if (statusToSelect) {
        setSelectedStatus(statusToSelect.StatusID); // Set the selected status ID
      }

      // Log the updated form details
      console.log("Form Details after setting:", formOrderDetails.OrderStatus);

      // Enable edit mode
      setEditMode(true);
    } else {
      console.error(
        "No valid data found for the provided historyId:",
        historyId
      );
    }
  };

  // Log updated formOrderDetails
  useEffect(() => {
    console.log("FormOrderDetails updated:", formOrderDetails);
  }, [formOrderDetails]);

  const selectedStatusText =
    orderStatusList.find((status) => status.StatusID === selectedStatus)
      ?.OrderStatus || "";

  useEffect(() => {
    console.log("Selected Status Updated:", selectedStatusText);
  }, [selectedStatus]);

  // const [visibleSteps, setVisibleSteps] = useState(5); // Initially show 5 steps

  // const handleReset = () => {
  //   setActiveStep(0);
  //   setVisibleSteps(5); // Reset visible steps
  // };

  // const handleScroll = (e) => {
  //   const bottom =
  //     Math.ceil(e.target.scrollHeight - e.target.scrollTop) <=
  //     e.target.clientHeight;

  //   if (bottom && visibleSteps < filteredStatusList.length) {
  //     setVisibleSteps((prevSteps) => Math.min(prevSteps + 5, filteredStatusList.length));
  //   }
  // };

  // const handleStepClick = (index) => {
  //   setActiveStep(index); // Set active step to the clicked step index
  //   // Ensure that the step is visible
  //   if (index >= visibleSteps) {
  //     setVisibleSteps((prevSteps) => Math.min(prevSteps + 5, filteredStatusList.length));
  //   }
  // };

  const [visibleSteps, setVisibleSteps] = useState(5); // Initially show 5 steps

  const handleReset = () => {
    setActiveStep(0);
    setVisibleSteps(4); // Reset visible steps
  };

const handleScroll = (e) => {
    const bottom =
      Math.ceil(e.target.scrollHeight - e.target.scrollTop) <=
      e.target.clientHeight;

    if (bottom && visibleSteps < filteredStatusList.length) {
      setVisibleSteps((prevSteps) => Math.min(prevSteps + 5, filteredStatusList.length));
    }
  };

  const handleStepClick = (index) => {
    if (index !== activeStep) {
      setActiveStep(index); // Set active step to the clicked step index
      // Move the clicked step to the bottom of the visible steps
      if (index < visibleSteps) {
        setVisibleSteps((prevSteps) => Math.min(prevSteps + 1, filteredStatusList.length));
      }
    }
  };

  // Adjust the order of the filteredStatusList based on the active step
  const orderedStatusList = [
    ...filteredStatusList.slice(activeStep + 1),
    ...filteredStatusList.slice(0, activeStep + 1)
  ];


  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: " 1fr" }, // Ensure proper grid layout
        gap: 2, // Adjust spacing between items
        justifyContent: "center",
        alignItems: "center",
        pt: 2,
      }}
    >
      <>
        {/* <form onSubmit={saveOrderHistory}> */}
        <form>
          <div className="flex">
            <div className="flex flex-col items-center flex-1 sm:ml-0 lg:ml-5 gap-4">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Order Status:
                </label>

                <Combobox value={selectedStatus} onChange={handleChanging}>
                  <div className="relative w-full sm:w-1/4">
                    <Combobox.Input
                      className={`p-1 w-full border rounded-md ${
                        errors.OrderStatus
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      onChange={(e) => setQuery(e.target.value)}
                      displayValue={(statusID) => {
                        const selected = orderStatusList.find(
                          (status) => status.StatusID === statusID
                        );
                        return selected ? selected.OrderStatus : ""; // Make sure selected value is returned
                      }}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto bg-white border border-gray-300 rounded-md shadow-lg">
                      {filteredStatusList.length > 0 ? (
                        filteredStatusList.map((status) => (
                          <Combobox.Option
                            key={status.StatusID}
                            value={status.StatusID}
                            className={({ active }) =>
                              `cursor-pointer select-none relative p-2 ${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              }`
                            }
                          >
                            {status.OrderStatus}
                          </Combobox.Option>
                        ))
                      ) : (
                        <div className="p-2 text-gray-500">No status found</div>
                      )}
                    </Combobox.Options>
                  </div>
                </Combobox>

                {errors.OrderStatus && (
                  <p className="text-red-500 text-sm ml-2">
                    {errors.OrderStatus}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Comments
                </label>
                <input
                  type="text"
                  name="Comments"
                  value={formOrderDetails.Comments}
                  onChange={(e) =>
                    setFormOrderDetails({
                      ...formOrderDetails,
                      Comments: e.target.value,
                    })
                  }
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.Comments ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.Comments && (
                  <p className="text-red-500 text-sm ml-2">{errors.Comments}</p>
                )}
              </div>

              <div className="flex flex-col hidden sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  StartDate
                </label>
                <input
                  type="date"
                  name="StartDate"
                  value={formatDate(formOrderDetails.StartDate)}
                  onChange={handleChange}
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.StartDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Expected Delivery in Days:
                </label>
                <input
                  type="number"
                  name="ExpectedDays"
                  value={formOrderDetails.ExpectedDays}
                  onChange={handleExpectedDaysChange}
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.ExpectedDays ? "border-red-500" : "border-gray-300"
                  }`}
                  min="0" // Ensure the user can't select a negative number of days
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Delivery Date:
                </label>
                <input
                  type="date"
                  name="DeliveryDate"
                  value={formatDate(formOrderDetails.DeliveryDate)}
                  onChange={handleDateChanging} // Manually change if needed
                  className={`p-1 w-full sm:w-1/4 border rounded-md ${
                    errors.DeliveryDate ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.DeliveryDate && (
                  <p className="text-red-500 text-sm ml-2">
                    {errors.DeliveryDate}
                  </p>
                )}
              </div>

              {/* <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
                  Upload Document:
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf,.doc,.docx"
                  onChange={handleFileChange} // This should now handle files
                  className="hidden"
                  id="UploadFiles"
                />
                <label
                  htmlFor="UploadFiles"
                  className="flex items-center justify-center px-4 py-2 p-1 w-full sm:w-1/4 border rounded-md border border-black-500 text-black-500 cursor-pointer hover:bg-blue-50"
                >
                  <FaUpload className="mr-2" />
                  <span>Upload File</span>
                </label>
              </div> */}

              {/* Render Image Previews */}
              {/* {images.length > 0 && (
                <div className="flex items-center mt-2 space-x-2 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative inline-block">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover"
                      />
                      <button
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )} */}

              {/* Render PDF Previews */}
              {/* {pdfPreviews.length > 0 && (
                <div className="mt-2 flex items-center flex-wrap">
                  {pdfPreviews.map((pdfPreview, index) => (
                    <div key={index} className="flex items-center ml-32">
                      <a
                        href={pdfPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline "
                      >
                        View PDF
                      </a>
                      <button
                        onClick={() => handlePdfRemove(index)}
                        className="ml-4 bg-red-500 text-white p-1 rounded-full text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )} */}

<div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <label className="sm:w-1/4 w-full text-left text-xs font-medium text-gray-700">
        Upload Document:
      </label>
      <div className="flex items-center sm:w-1/4 w-full border rounded-md bg-white p-2">
        <input
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          id="UploadFiles"
        />
        {/* <label
          htmlFor="UploadFiles"
          className="flex items-center justify-center px-4 py-2 border border-black-500 text-black-500 cursor-pointer hover:bg-blue-50"
        > */}
         <label
          htmlFor="UploadFiles"
          className="flex items-center justify-center text-black-500 cursor-pointer"
        >
          <FaUpload className="mr-2" />
          <span>Upload</span>
        </label>

        {/* Render Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="flex items-center ml-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative inline-block">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-5 h-5 object-cover mr-2"
                />
                <button
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  *
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Render PDF Previews */}
        {pdfPreviews.length > 0 && (
          <div className="flex items-center ml-2">
            {pdfPreviews.map((pdfPreview, index) => (
              <div key={index} className="flex items-center">
                <a
                  href={pdfPreview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline mx-1"
                >
                  View
                </a>
                <button
                  onClick={() => handlePdfRemove(index)}
                  className="ml-2 bg-red-500 text-white p-1 rounded-full text-xs"
                >
                  *
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
            </div>
            {/* <Box sx={{ maxWidth: 300 }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {filteredStatusList.length > 0 ? (
                  filteredStatusList.map((status, index) => (
                    <Step key={status.StatusID}>
                      <StepLabel
                        optional={
                          index === filteredStatusList.length - 1 ? (
                            <Typography variant="caption">Last step</Typography>
                          ) : null
                        }
                      >
                        {status.OrderStatus}
                      </StepLabel>
                      <StepContent>
                        <Typography className="text-blue-500">
                          {selectedStatusText}
                        </Typography>
                      
                        <Typography className="text-gray-500">
                          {status.description || " "}
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                    
                        </Box>
                      </StepContent>
                    </Step>
                  ))
                ) : (
                  <Typography className="p-2 text-gray-500">
                    No status found
                  </Typography>
                )}
              </Stepper>

              {activeStep === filteredStatusList.length && (
                <Paper square elevation={0} sx={{ p: 3 }}>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                    Reset
                  </Button>
                </Paper>
              )}
            </Box> */}

<Box sx={{ maxWidth: 300 }}>
      <Box
        sx={{
          maxHeight: "400px", // Set height to limit visible steps
          overflowY: "auto", // Enable vertical scroll
        }}
        onScroll={handleScroll} // Listen for scroll event
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {filteredStatusList.length > 0 ? (
            filteredStatusList.slice(0, visibleSteps).map((status, index) => (
              <Step key={status.StatusID}>
                <StepLabel
                  onClick={() => handleStepClick(index)} // Add click handler
                  optional={
                    index === filteredStatusList.length - 1 ? (
                      <Typography variant="caption">Last step</Typography>
                    ) : null
                  }
                >
                  {status.OrderStatus}
                </StepLabel>
                <StepContent>
                  <Typography className="text-green-500">
                    {selectedStatusText}
                  </Typography>

                  <Typography className="text-gray-500">
                    {status.description || " "}
                  </Typography>

                  <Box sx={{ mb: 2 }}></Box>
                </StepContent>
              </Step>
            ))
          ) : (
            <Typography className="p-2 text-gray-500">
              No status found
            </Typography>
          )}
        </Stepper>
      </Box>

      {activeStep === filteredStatusList.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>
            All steps completed - you&apos;re finished
          </Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
          </div>
          <div className="relative mt-10 flex justify-end gap-4">
            <div className="mt-6 flex justify-end gap-4">
              <button type="button" 
              onClick={saveOrderHistory}
              className="button-base save-btn">
                {editMode ? "Update" : "Save"}{" "}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="button-base cancel-btn"
              >
                Cancel
              </button>
            </div>
            {showModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 text-center shadow-lg w-11/12 max-w-sm">
                  <p className="text-lg">{popupMessage}</p>
                </div>
              </div>
            )}
          </div>
        </form>

        <TableContainer component={Paper} className="mt-4 shadow-md">
          <Table
            aria-label="orders table"
            className="min-w-full border-collapse border border-gray-300"
          >
            <TableHead className="bg-custom-darkblue">
              <TableRow>
                <StyledTableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Order Status
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Delivery Date
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Comments
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Document
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Edit
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ color: "white", fontWeight: "bold" }}
                >
                  Delete
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statusDetails.length > 0 ? (
                statusDetails.map((status, index) => (
                  <TableRow key={index} className="hover:bg-gray-100">
                    {/* Order Status */}
                    <StyledTableCell
                      align="center"
                      className="border-r border-gray-300"
                    >
                      <StatusBadge status={status.OrderStatus} />
                    </StyledTableCell>

                    {/* Delivery Date */}
                    <StyledTableCell
                      align="center"
                      className="border-r border-gray-300"
                    >
                      <p className=" font-thin">
                        Start Date:
                        {status.StartDate
                          ? new Date(status.StartDate).toLocaleDateString()
                          : "N/A"}
                        <br />
                        End Date:
                        {status.DeliveryDate
                          ? new Date(status.DeliveryDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </StyledTableCell>

                    {/* Comments */}
                    <StyledTableCell
                      align="center"
                      className="border-r border-gray-300"
                    >
                      {status.Comments || "N/A"}
                    </StyledTableCell>

                    {/* Document Links */}
                    <StyledTableCell
                      align="center"
                      className="border-r gap-0 border-gray-300"
                    >
                      {/* View Documents Section */}
                      {Array.isArray(status.viewdocuments) &&
                      status.viewdocuments.length > 0 ? (
                        status.viewdocuments.map((url, docIndex) => (
                          <div
                            key={docIndex}
                            className="flex items-center mb-0"
                          >
                            <IconButton
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              color="primary"
                            >
                              <AiOutlineEye size={20} />
                              <span className="ml-2 font-bold text-sm">
                                View
                              </span>
                            </IconButton>
                          </div>
                        ))
                      ) : (
                        <span>No Documents to View</span>
                      )}

                      {/* Download Documents Section */}
                      {Array.isArray(status.DownloadDocuments) &&
                      status.DownloadDocuments.length > 0 ? (
                        status.DownloadDocuments.map((url, docIndex) => (
                          <div
                            key={docIndex}
                            className="flex items-center mb-0"
                          >
                            <IconButton href={url} download color="success">
                              <FiDownload size={20} />
                              <span className="ml-2 font-bold text-sm">
                                Download
                              </span>
                            </IconButton>
                          </div>
                        ))
                      ) : (
                        <span></span>
                      )}
                    </StyledTableCell>

                    {/* Edit Button */}
                    <StyledTableCell
                      align="center"
                      className="border-r border-gray-300"
                    >
                      <div className="button-container justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleEditstatus(
                              status.OrderHistoryID,
                              status.StatusID
                            )
                          }
                          className="button edit-button"
                        >
                          <AiOutlineEdit
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          Edit
                        </button>
                      </div>
                    </StyledTableCell>

                    {/* Delete Button */}
                    <StyledTableCell align="center">
                      <div className="button-container justify-center">
                        <button
                          type="button"
                          // onClick={() => handleDelete(generatedId)}
                          className="button delete-button"
                        >
                          <MdOutlineCancel
                            aria-hidden="true"
                            className="h-4 w-4"
                          />
                          Delete
                        </button>
                      </div>
                    </StyledTableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <StyledTableCell align="center" colSpan={6}>
                    {loading ? "Loading..." : error ? error : "No Order Found"}
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    </Box>
  );
};

export default YourComponent;
