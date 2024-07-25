import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardContent, CardHeader, CardMedia, ClickAwayListener } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import headerImg from  '../../../assets/images/supportImage3.c1e1320e.png'
import { Typography } from 'antd';
import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'

///import Table from './Table';
import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import { BASE_URL, COMMON_GET_FUN,} from 'helper/ApiInfo'
import { useNavigate } from 'react-router'
import {printEmployeesData} from '../../PDF'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import '../../../style/document.css'
//import { employeesData } from './data';

const Dashboard = () => {
  const [employees, setEmployees] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)
  const navigate =useNavigate();
const [anchorEl, setAnchorEl] = useState(false);

const localStorageData =localStorage.getItem("currentData")

  const [showInfo,setShowInfo]=useState(false)

  const handleCardOpen=()=>{
    setShowInfo(!showInfo)
  }
  const handleCardClose=()=>{
    setShowInfo(false)
  }
  
useEffect(()=>{ localStorage.removeItem('fieldName');
  localStorage.removeItem('companyName');
  localStorage.removeItem('currentData');},[])

  // console.log(allowUser);
  const { allowUser,companyId} = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // console.log(data);
    if (data.user === 'Lease and Utility') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })

  const fieldName = [
    { field: 'lese_date', headerName: 'Date' },
    { field: 'lese_docname', headerName: 'Document Name ' },
    { field: 'lese_cmnt', headerName: 'Comments' },
    { field: 'stf_firstname', headerName: 'Staff Name' }, 
    { field: 'prtcpnt_firstname', headerName: 'Participant Name' },
  
   
   
  ];
  // console.log(allowPre);
  const columns = [
    {
      field: `staff`, headerName: 'Staff Name', width: 130,
      valueGetter: (params) => {
        // console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname}`


      },
    },
    {
      field: `name`,
      headerName: 'Date',
      width: 180,
      valueGetter: params => {
        console.log(params)
        const date = new Date(params.row.lese_date)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
        const year = date.getFullYear()
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`
      }
    },
    { field: 'lese_docname', headerName: 'Assets Name', width: 130 },

    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: params => (
        <strong>
          {allowPre?.edit ? (
            <IconButton aria-label='edit' color='primary' onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton>
          ) : allowPre?.read ? (
            <IconButton aria-label='edit' color='primary' onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton>
          ) : (
            ''
          )}
          {/* {
                            
            allowPre?.read?<IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
            <VisibilityIcon />
          </IconButton>:""
          } */}
          {allowPre?.delete ? (
            <IconButton aria-label='delete' color='error' sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          ) : (
            ''
          )}
        </strong>
      )
    }
  ]

  useEffect(() => {
    try {
      let endpoint = `getAllwithJoin?table=fms_leseandutlity&status=0&company_id=${companyId}`;
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        console.log(data);
        if (data.status) {
          setEmployees(data.messages);
          localStorage.setItem("currentData",JSON.stringify(data.messages))
          localStorage.setItem("fieldName",JSON.stringify(fieldName))
          localStorage.setItem("pageName","Lease and Utility")
          
        }else {
          setEmployees([]);
         
        }
      })
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [isAdding, isEditing, isdelete,localStorageData])
  

  const handleEdit = id => {
    try {
      let endpoint = 'getAllwithJoinAssets?table=fms_leseandutlity&field=lese_id&id=' + id
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        // console.log(data);
        if (data.status) {
          navigate('/assets/lease-and-utility/edit',
            {
              state: {
                allowPre,
                selectedData: data?.messages
              }
            }
          )
        }
      })
    } catch (error) {
      console.error('Error in handleEdit:', error);
    }
  }
  
  const handleAddButton = () => {
     navigate('/assets/lease-and-utility/add')

  }

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
        let endpoint = `deleteStatus?table=fms_leseandutlity&field=lese_id&id=${id}&delete_status=lese_status&value=1`
        try {
          let response = COMMON_GET_FUN(BASE_URL, endpoint)
          response.then(data => {
            console.log(data);
            if (data.status) {
              Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: `Record data has been deleted.`,
                showConfirmButton: false,
                timer: 1500
              })
              setIsDelete(id)
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: data.messages,
                showConfirmButton: false,
                timer: 1500
              })

            }
          })
        } catch (error) {
          console.error("Error deleting record:", error);
         
        
        }
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
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Lease And Utility Logs  <span><InfoIcon style={{cursor:"pointer"}}  onClick={handleCardOpen}/></span></h3>
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
          {
  showInfo?<Card sx={{ width:'100%' }} className='ObCard' >
  <IconButton aria-label="settings" className='cardIcon'>
              <CloseIcon  onClick={handleCardClose}/>
            </IconButton>
            <div className='headerCard'>
            <CardMedia
          component="img"
         className='cardImg'
          image={headerImg}
          alt="Paella dish"
        />
      
  
        <CardContent>
        <CardHeader
          title="Introduction to Lease and Utitliy Logs"
          // subheader="September 14, 2016"
        />
          <Typography variant="body2" color="text.secondary">
          Store all the lease agreements, gas, water and electicity bills all in one place.
          </Typography>
        </CardContent>
  
            </div>
  
       
      </Card>:''
}
      </GridToolbarContainer>
    )
  }

  return (
    <div className='container'>
      {!isAdding && !isEditing && (
        <>
          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

                  <DataGrid
className={employees.length<1?"hide_tableData":""}



 
            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={row => row.lese_id}
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              m: 2,
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main'
              }
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 }
              }
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
      {/* {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} />}
      {isEditing && <Edit setShow={setShow} selectedData={selectedDocument} setIsEditing={setIsEditing} allowPre={allowPre} />} */}
    </div>
  )
}

export default Dashboard
