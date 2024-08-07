import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  // GridToolbarDensitySelector
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'

///import Table from './Table';
import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import { BASE_URL, COMMON_GET_FUN} from 'helper/ApiInfo'
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardContent, CardHeader, CardMedia, ClickAwayListener, Grid  } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import headerImg from  '../../../assets/images/supportImage3.c1e1320e.png'
import { Typography } from 'antd';
import { useNavigate } from 'react-router'
//import { employeesData } from './data';]
import FilterListIcon from '@mui/icons-material/FilterList';

import { useSelector } from 'react-redux';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import {printEmployeesData} from '../../PDF'
import FIlter from '../../Filter'
const Dashboard = ({ setShow, show }) => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)
  const [showInfo,setShowInfo]=useState(false)
  const [showFilterFields,setShowFilterFields]= useState(false)
  const[combineDataFields,setCombineDataFields]=useState([])
  const [columnData,setColumnData]=useState([])
const [anchorEl, setAnchorEl] = useState(false);

  const navigate =useNavigate();

  const handleCardOpen=()=>{
    setShowInfo(!showInfo)
  }
  const handleCardClose=()=>{
    setShowInfo(false)
  }

  const filterPageData =useSelector((state)=>state.filterAllData?.filterAllData)
  // console.log(filterPageData);
  useEffect(()=>{
    // localStorage.removeItem("currentData")
    if(filterPageData && showFilterFields){
      setEmployees(filterPageData)
    localStorage.setItem("currentData",JSON.stringify(filterPageData))
  
    }
  },[filterPageData])
  
  // //console.log(allowUser);
  const { allowUser,companyId} = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // //console.log(data);
    if (data.user === 'Maintenance') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  const openFilter=()=>{
    setShowFilterFields(true)
  }
  // //console.log(allowPre);

    
  
  const fieldName = [
    { field: 'mnten_date', headerName: 'Date' },
  
    { field: 'mnten_time', headerName: 'Time' },
    { field: 'staff_fullname', headerName: 'Staff Name' }, 
    { field: 'mnten_subjct', headerName: 'Subject' },
    { field: 'mnten_loca', headerName: 'Location' },
    { field: 'mnten_dscrptn', headerName: 'Staff Name' }, 
  
  ];
  const columns = [
    { field:`staff_fullname`, headerName: 'Staff', width: 130,},
    {
      field: `mnten_date`,
      headerName: 'Date',
      width: 180,
      valueGetter: params => {
        //console.log(params)
        const date = new Date(params.row.mnten_date)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') 
        const year = date.getFullYear()
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`
      }
    },
    { field: 'mnten_time', headerName: 'Time', width: 130 },
    { field:`mnten_loca`, headerName: 'Location ', width: 130,},

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
    const fetchData = async () => {
      const combineData =[]

      try {
        let endpoint = `getAllwithJoin?table=fms_maintenance&status=0&company_id=${companyId}`;

        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        //console.log(response);
        
        if (response.status) {
          setEmployees(response.messages);
          console.log(response?.messages);
          localStorage.setItem("currentData",JSON.stringify(response?.messages))
          localStorage.setItem("fieldName",JSON.stringify(fieldName))
          localStorage.setItem("pageName","Maintenance Logs")
          setCombineDataFields(combineData)
        } else {
          setEmployees([]);
        }
        // setLoading(false);

      } catch (error) {
        console.error('Error in fetchData:', error);
        throw error; 
      }
    };
  
    fetchData().catch(error => {

      console.error('Error in useEffect:', error);
    });
  
  }, [isAdding, isEditing, isdelete,showFilterFields]);

  useEffect(()=>{
    setColumnData(columns)
  },[showFilterFields])

  useEffect(()=>{
    localStorage.removeItem("new")
    
    },[])

  const handleEdit = id => {
    let endpoint = 'getAllwithJoinAssets?table=fms_maintenance&field=mntan_id&id=' + id
    let response = COMMON_GET_FUN(BASE_URL, endpoint)
    response.then(data => {
      //console.log(data.messages);
      if (data.status) {
        navigate('/assets/maintenance/edit',
          {
            state: {
              allowPre,
              selectedData: data?.messages
            }
          }
        )
      }
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  }
  

  const handleAddButton = () => {
    navigate('/assets/maintenance/add')

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
        let endpoint = `deleteStatus?table=fms_maintenance&field=mntan_id&id=${id}&delete_status=mnten_status&value=1`
        try {
          let response = COMMON_GET_FUN(BASE_URL, endpoint)
          response.then(data => {
            //console.log(data);
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
  

  function CustomToolbar () {
    return (
      <GridToolbarContainer >
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Maintenance Logs  <span><InfoIcon style={{cursor:"pointer"}}  onClick={handleCardOpen}/></span></h3>
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
      {      
      allowPre?.add ? <Button  variant="contained" onClick={()=>{handleAddButton()} } style={{margin: "0px 0px 0px auto"}} >Add New</Button>  :""
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
          title="Introduction to Maintenance Logs"
          // subheader="September 14, 2016"
        />
          <Typography variant="body2" color="text.secondary">
          You can record and keep track of any maintenance work done in the past. Simply provide the location, decription and invoice of the maintenance work and create a new entry.
          </Typography>
        </CardContent>
  
            </div>
  
       
      </Card>:''
}

{

showFilterFields?<Grid container sx={{ margin: '0px 21px' }}><FIlter setShowFilterFields={setShowFilterFields} columns={columnData} combineDataFields={employees}/></Grid>:""
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
            getRowId={row => row.mntan_id}
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
