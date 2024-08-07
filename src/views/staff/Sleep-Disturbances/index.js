import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  DataGrid/* GridToolbar */, GridToolbarContainer,

  GridToolbarExport,
} from '@mui/x-data-grid';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
import {
  Grid,
  Select,
  MenuItem,
  TextField,
  SvgIcon,
  ClickAwayListener,
} from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo';
import { Box, Stack } from '@mui/system';
import { Typography } from 'antd';
import '../../../style/document.css'



import {printEmployeesData} from '../../PDF'
import FIlter from '../../Filter'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
const [showFilterFields,setShowFilterFields]= useState(false)
const { allowUser,companyId } = useContext(AuthContext)
const [imgS,setNewImage]=useState(null);
console.log(imgS);

const navigate  =useNavigate()
const allowPre = allowUser.find((data) => {
  // //console.log(data);

  if (data.user === "Sleep Disturbances") {
    return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
  }


})



const filterPageData =useSelector((state)=>state.filterAllData?.filterAllData)
console.log(filterPageData);
useEffect(()=>{
  // localStorage.removeItem("currentData")
  if(filterPageData && showFilterFields){
    setEmployees(filterPageData)
  localStorage.setItem("currentData",JSON.stringify(filterPageData))

  }
},[filterPageData])
console.log(employees);
// const localStorageData =localStorage.getItem("currentData")





const fieldName = [
  { field: 'stf_firstname', headerName: 'Staff Name' }, 
  { field: 'prtcpnt_firstname', headerName: 'Participant Name' },

  { field: 'slpdis_starttime', headerName: 'Start Time' },
  { field: 'slpdis_endtime', headerName: 'End Time' },
  { field: 'slpdis_date', headerName: 'Date' },
  { field: 'slpdis_dscrptn', headerName: 'Description' },
  { field: 'slpdis_action', headerName: 'Action' },
  { field: 'slpdis_hour', headerName: 'Total Hours' }
];

const [columnData,setColumnData]=useState([])


// //console.log(employees);
const [anchorEl, setAnchorEl] = useState(false);

const openFilter=()=>{
  setShowFilterFields(true)
}
const closeFilter=()=>{
  setShowFilterFields(false)
  setRows([{value1: '', value2: '', value3: '' }])
}
  // //console.log(allowUser);

  const columns = [
    {
      field: `prtcpnt_firstname`, headerName: 'Participant Name', width: 230,
    },
    {
      field: `slpdis_date`, headerName: 'Date', width: 180,
      valueGetter: (params) => {
        // //console.log(params);
        const date = new Date(params.row.slpdis_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const year = date.getFullYear();
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`;


      },
    },
    { field: 'slpdis_hour', headerName: 'Total Hour', width: 180 },
    {
      field: `slpdis_stfid`, headerName: 'Staff ', width: 230,
      valueGetter: (params) => {
        // //console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname}`


      },
    },


    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: (params) => (
        <strong >
          {
            allowPre?.edit ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton> : (allowPre?.read ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton> : "")
          }
          {/* {
                            
            allowPre?.read?<IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
            <VisibilityIcon />
          </IconButton>:""
          } */}
          {
            allowPre?.delete ? <IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton> : ""
          }




        </strong>
      ),
    },
  ];
  
  const[combineDataFields,setCombineDataFields]=useState([])
// //console.log(columns);
  useEffect(() => {

    let endpoint = `getAllwithJoin?table=fms_stf_slepdisterbnc&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      const combineData =[]
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          // //console.log(response.messages);
          setEmployees(response?.messages);
          localStorage.setItem("currentData",JSON.stringify(response?.messages))
          localStorage.setItem("fieldName",JSON.stringify(fieldName))
          localStorage.setItem("pageName","Sleep Disturbances")
          setCombineDataFields(combineData)
        
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();  
  }, [isAdding, isEditing, isdelete,showFilterFields]);

  // //console.log(combineDataFields);

useEffect(()=>{
  setColumnData(columns)
},[showFilterFields])


useEffect(()=>{
localStorage.removeItem("new")

},[])

  const handleEdit = async (id) => {
    try {
      const endpoint = `getWhere?table=fms_stf_slepdisterbnc&field=slpdis_id&id=${id}`
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);

      if (response.status) {
        navigate('/staff/sleep-disturbances/edit',
          {
            state: {
              allowPre,
              selectedData: response?.messages
            }
          }
        )
      } else {
        console.error('Request was not successful:', response.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const handleAddButton = () => {
    navigate('/staff/sleep-disturbances/add')
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.value) {
        let endpoint = `deleteStatus?table=fms_stf_slepdisterbnc&field=slpdis_id&id=${id}&delete_status=slpdis_status&value=1`
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        response.then(data => {
          if (data.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `Record data has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            })
            setIsDelete(id)
          }
        })
      }
    })
  }



  const handleClick = () => {
    setAnchorEl(!anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(false);
  };

  

  const convertIntoCsv=()=>{
    setAnchorEl(null);
    const filterData = columns.filter(col => col.field !== 'action');
    // //console.log(filterData);
    const csvRows = [];
    const headers = filterData.map(col => col.headerName);
    // //console.log(headers);
    csvRows.push(headers.join(','));

    
    employees.forEach(row => {
      const values = filterData.map(col => {
        let value = row[col.field];
     
        if (col.field === 'slpdis_stfid' && col.valueGetter) {
          value = col.valueGetter({ row });
        }
  
        const escaped = ('' + value).replace(/"/g, '\\"');
        // //console.log(escaped);
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
      // //console.log(values.join(','));
    });
    const csvData = csvRows.join('\n');
    // //console.log(csvData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employees.csv';
    document.body.appendChild(link);
    link.click();
  
    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }, 0);


    
  }
  
  function CustomToolbar() {
    return (
     <GridToolbarContainer>
    <h3 style={{ fontSize: '1.285rem', fontWeight: '500' }}>Sleep Disturbances</h3>
    <Box sx={{ flexGrow: 1 }} />
    {/* <GridToolbarColumnsButton /> */}
    <Box  onClick={openFilter} id="filter_icon">
      <FilterListIcon />
      <Typography  id='fiter_txt' >Filter</Typography>
    </Box>
    {/* <FilterAltIcon onClick={openFilter} sx={{ border: '1px solid #82868b', width: '100px', color: 'black', height: '35px' }} /> */}
    {/* <GridToolbarDensitySelector /> */}
   
    <Box className="gt">
    <ClickAwayListener onClickAway={handleClose}>
    <Box id="filter_icon" className='drop_pos'  onClick={handleClick} >
    <SystemUpdateAltIcon/>
    <Typography  id='fiter_txt' >export</Typography>
 
    </Box>
    </ClickAwayListener>
    {
      anchorEl? 
      <ul
      id="dropdown-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClick}
      className='download_opt'
     
    >
      <li onClick={employees.length > 0 ? convertIntoCsv : null} className='drop_li' >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className="align-middle ml-50">CSV</span>
      </li>
      <li onClick={employees.length > 0 ? printEmployeesData : null} className='drop_li'>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
        <span className="align-middle ml-50">PDF</span>
      </li>
    </ul>:""
    }

    </Box>


    
    
    {allowPre?.add ? (
      <Button
        variant="contained"
        onClick={() => {
          handleAddButton();
        }}
        style={{ margin: '0px 0px 0px auto' }}
      >
        Add New
      </Button>
    ) : (
      ''
    )}

{

  showFilterFields?<Grid container sx={{ margin: '0px 21px' }}><FIlter setShowFilterFields={setShowFilterFields} columns={columnData} combineDataFields={employees}/></Grid>:""
}



  
  </GridToolbarContainer>
    );
  }

  return (
    <div className="container">


      {!isAdding && !isEditing && (
        <>

          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

                  <DataGrid
className={employees.length<1?"hide_tableData":""}





            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={(row) => row.slpdis_id}
            slots={{
              toolbar: CustomToolbar,
            }}

            sx={{
              m: 2,
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}

            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          //checkboxSelection
          />
          {/* <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </>
      )}
   
      {isEditing && (
        <Edit
          selectedData={selectedDocument}
          setIsEditing={setIsEditing}
          allowPre={allowPre}
        />
      )}
    </div>
  );
};

export default Dashboard;
