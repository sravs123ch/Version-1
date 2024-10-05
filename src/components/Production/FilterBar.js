
// import React from 'react';
// import { FaList, FaTruck,FaTasks, FaBan,FaSpinner,FaCheckCircle, FaBroom} from 'react-icons/fa';
// const FilterBar = ({ selectedFilter, onFilterChange }) => {
//   return (
//     <div className="flex space-x-4 p-4 bg-gray-100 rounded-md">
//       <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'All'
//             ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('All')}
//       >
//         <FaList/>
//         All
//       </button>
//       <button
//   className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//     selectedFilter === 'Workstarted'
//       ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//       : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//   }`}
//   onClick={() => onFilterChange('Workstarted')}
// >
//   <FaTasks /> {/* Use the new icon */}
//   Workstarted
// </button>
//     <div className="flex gap-4"> {/* Optional: Add a container with gap for spacing between buttons */}
//       {/* Button for Ready to Dispatch */}
//       <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'DispatchDate'
//             ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('DispatchDate')}
//       >
//         <FaTruck /> {/* Icon for Ready to Dispatch */}
//         Ready to Dispatch
//       </button>

//       {/* Button for Payment Done */}
//       <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'PaymentDone'
//             ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('PaymentDone')}
//       >
//         <FaCheckCircle /> {/* Icon for Payment Done */}
//         Payment Done
//       </button>

//       {/* Button for Site Clearance */}
//       <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'SiteClearance'
//             ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('SiteClearance')}
//       >
//         <FaBroom /> {/* Icon for Site Clearance */}
//         Site Clearance
//       </button>
//     <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'Dispatched'
//        ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('Dispatched')}
//       >
//         <FaTruck/>
//         Dispatched
//       </button>
//       <button
//         className={`inline-flex items-center gap-x-1.5 px-4 py-2 text-sm font-semibold rounded-md ${
//           selectedFilter === 'Canceled'
//         ? 'bg-custom-darkblue text-white hover:bg-custom-lightblue hover:text-gray-700'
//             : 'bg-white text-gray-700 hover:bg-custom-lightblue hover:text-gray-700'
//         }`}
//         onClick={() => onFilterChange('Canceled')}
//       >
//         <FaBan/>
//         Cancelled
//       </button>
//     </div>
//     </div>
//   );
// };

// export default FilterBar;



import { FaList, FaTasks, FaTruck, FaCheckCircle, FaBroom, FaBan, FaPen, FaSearch, FaHourglassHalf, FaCheck, FaTimes, FaTools, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

const FilterBar = ({ selectedFilter, onFilterChange ,totalCount}) => {
  const statuses = [
    { label: 'All', icon: <FaList className="text-gray-500" />, subStatusId: "" }, // Added All label
    { label: 'Drafts', count: '', icon: <FaPen className="text-blue-500" />, subStatusId:"" }, // SubStatusId 1 for YetToStart
    { label: 'Ready to Dispatch', count: '', icon: <FaTruck className="text-blue-500" />, subStatusId: "" }, // SubStatusId 2 for InProgress
    { label: 'Site Clearance', count:'', icon: <FaBroom className="text-yellow-500" />, subStatusId: "" }, // SubStatusId 3 for Completed
    { label: 'InProgress', count: '', icon: <FaSearch className="text-yellow-500" />, subStatusId: 2 }, // SubStatusId 2 for InProgress
    { label: 'Pending', count: '', icon: <FaHourglassHalf className="text-orange-500" />, subStatusId:"" }, // SubStatusId 4 for Cancelled
    { label: 'Completed', count: '', icon: <FaCheck className="text-green-700" />, subStatusId: 3 }, // SubStatusId 3 for Completed
    { label: 'Cancelled', count: '', icon: <FaTimes className="text-red-500" />, subStatusId: 4 }, // SubStatusId 4 for Cancelled
    { label: 'YetToStart', count: '', icon: <FaTools className="text-green-500" />, subStatusId: 1 }, // SubStatusId 1 for YetToStart
    { label: 'Payment', count: '', icon: <FaMoneyBillWave className="text-indigo-500" />, subStatusId: "" }, // No specific SubStatusId
    { label: 'Reporting', count: '', icon: <FaChartBar className="text-teal-500" />, subStatusId: "" }, // No specific SubStatusId
  ];

  return (
    <div className="flex flex-col w-full sm:w-1/4 md:w-1/3 lg:w-1/4 p-4 bg-gray-100 rounded-md">
      <div className="shadow-lg  p-5">
        <h2 className="font-semibold text-lg mb-3">Status Overview</h2>
        <div className="flex flex-col space-y-2">
          {statuses.map((status, index) => (
            <button
              key={index}
              className={`flex items-center justify-between p-2 border-b border-gray-200 w-full text-left hover:bg-gray-100 transition duration-150 ease-in-out ${
                selectedFilter.label === status.label
                  ? 'bg-custom-darkblue text-white' // Highlight selected filter
                  : 'text-gray-700'
              }`}
              onClick={() => onFilterChange(status)} // Pass the whole status object
            >
              <span className="flex items-center">
                <span className="mr-2">{status.icon}</span>
                <span className="font-medium">{status.label}</span>
              </span>
              <span className="font-semibold">{status.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;