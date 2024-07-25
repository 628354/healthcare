import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ClickAwayListener, Typography } from '@mui/material';

//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid/* GridToolbar */, GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';


import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import { Box } from '@mui/system';
import AuthContext from 'views/Login/AuthContext';
import { useDispatch } from 'react-redux';
import { addParticipantData } from 'store/actions';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
import { useNavigate } from 'react-router';
// import { addParticipantData } from '../../../store/actions';

//import { employeesData } from './data';

import {printEmployeesData} from '../../PDF'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';



const ParticipantProfiles = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const { allowUser,companyId} = useContext(AuthContext)
const [anchorEl, setAnchorEl] = useState(false);
const localStorageData =localStorage.getItem("currentData")

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const allowPre = allowUser.find((data) => {
    // console.log(data);
    if (data.user === "Profiles") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
    }


  })
 
  const fieldName = [
    { field: 'stf_firstname', headerName: 'Staff Name' }, 
    { field: 'stf_prfrdname', headerName: 'Participant Name' },
    { field: 'stf_email', headerName: 'Email' },
    { field: 'stf_gender', headerName: 'Gender' },
    { field: 'stf_empljobtitle', headerName: 'Job Title' },
    
  
   
   
  ];

  const columns = [
   
    {
      field: `name`, headerName: 'Name', width: 250,
      valueGetter: (params) => {
        // console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname}`


      },
    },
  
    {
      field: 'stf_email',
      headerName: 'Email',
      width: 250,
    },
    // {
    //   field:'stf_prfrdname',
    //   headerName:'User Name',
    //   type:'number',
    //   width:90,
    // },
    // {
    //   field:'stf_dob',
    //   headerName:'Date Of Birth',
    //   minWidth:110,
    //   /* valueFormatter: (params)=>{
    //           let date = date(params);
    //           let newDate = date.getDay+'-'+date.getMonth()+'-'+date.getFullYear();
    //             return newDate;
    //       }, */
    // },

    {
      field: 'stf_gender',
      headerName: 'Gender',
      width: 200,
      valueFormatter: (params) => {
        // console.log(params);
        if (params.value == '2') {
          return `Male`;
        } else if (params.value == '1') {
          return `female`;
        } else if (params.value == '3') {
          return `other`;
        }

      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => (
        <strong >
          {
            allowPre?.edit ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton> : (allowPre?.read ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton> : "")
          }
          {
            allowPre?.delete ? <IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton> : ""
          }

        </strong>
      ),
    },
  ];




  useEffect(() => {

    let endpoint = `getWhereAll?table=fms_staff_detail&field=stf_archive&value=1&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          console.log(response);
          setEmployees(response.messages);
          localStorage.setItem("currentData",JSON.stringify(response.messages))
          localStorage.setItem("fieldName",JSON.stringify(fieldName))
          localStorage.setItem("pageName","Staff Profiles")
        }else{
          setEmployees([]);


        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete,localStorageData]);


  const handleEdit = async (id) => {
    // navigate(`/staff/profiles/edit/${id}`)
    try {
      let endpoint = 'getWhere?table=fms_staff_detail&field=stf_id&id=' + id;
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);
      if (response.status) {
        navigate('/staff/profiles/edit',
          {
            state: {
              allowPre,
              selectedEmployee: response?.messages
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
    navigate('/staff/profiles/add')

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
        let endpoint = `deleteStatus?table=fms_staff_detail&field=stf_id&id=${id}&delete_status=slpdis_status&value=1`
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
    // console.log(filterData);
    const csvRows = [];
    const headers = filterData.map(col => col.headerName);
    // console.log(headers);
    csvRows.push(headers.join(','));

    
    employees.forEach(row => {
      const values = filterData.map(col => {
        let value = row[col.field];
     
        if (col.field === 'slpdis_stfid' && col.valueGetter) {
          value = col.valueGetter({ row });
        }
  
        const escaped = ('' + value).replace(/"/g, '\\"');
        // console.log(escaped);
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
      // console.log(values.join(','));
    });
    const csvData = csvRows.join('\n');
    // console.log(csvData);
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
      <GridToolbarContainer >
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Staff Profiles</h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
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
        {
          allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
        }
      </GridToolbarContainer>
    );
  }


  useEffect(()=>{ localStorage.removeItem('fieldName');
    localStorage.removeItem('companyName');
    localStorage.removeItem('currentData');},[])

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
            getRowId={(row) => row.stf_id}
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
     
      
    </div>
  );
};

export default ParticipantProfiles;
