import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';

import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
// import { log } from 'util';
import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo';
import {printEmployeesData} from '../../PDF'
import { ClickAwayListener, Grid, Typography } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const Dashboard = ({setShow, show}) => {
  
  useEffect(()=>{
    if(show){
      setShow(false)
    }
  },[])
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser,companyId}=useContext(AuthContext)
const [anchorEl, setAnchorEl] = useState(false);

  const navigate =useNavigate();
  const localStorageData =localStorage.getItem("currentData")
  const allowPre= allowUser.find((data)=>{
    // //console.log(data);
     if(data.user === "Documents"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })

  const fieldName = [
  
    { field: 'categorie_name', headerName: 'Category' },
  
    { field: 'category_document_name', headerName: 'Type' },
    { field: 'stf_firstname', headerName: 'Staff' },
    { field: 'dcmt_expdate', headerName: 'Expiry Date' },
    { field: 'dcmt_expdatestatus', headerName: 'Has Expiry' },
    { field: 'dcmt_note', headerName: 'Notes' },
    
  ];
  
  // //console.log(selectedEmployeeName);
  const columns = [
   
    // { field:'doc_prtcpntname', headerName: 'Participant Name', width: 170 },
    { field:`staffName`, headerName: 'Staff Name', width: 170,
                    valueGetter: (params)=>{
                      // //console.log(params);
                      return `${params.row.stf_firstname} ${params.row.stf_lastname}`
                     
                      
                    },   },
    { field: 'categorie_name', headerName: 'Category', width: 170 },
    { field: 'category_document_name', headerName: 'Type', width: 150 },
   
   
    { field:`name`, headerName: 'Expiry Date', width: 170,
                    renderCell: (params)=>{
                      //console.log(params);
                      
                      if (params.row.dcmt_expdate === '0000-00-00') {
                        return <div className='commonCla grayClr'>No date</div>
                      } else {
                        const date = new Date(params.row.dcmt_expdate);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        // Concatenate in the "dd/mm/yyyy" format
                        return <div className='commonCla redClr' >{`${day}/${month}/${year}`}</div>
                      }

                    },   },
    {
      field: 'action',
      headerName: 'Action',
      width: 190,
      renderCell: (params) => (
        <strong >
        {
          allowPre?.edit? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
        <EditNoteOutlinedIcon /> 
        </IconButton>:(allowPre?.read? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
           <VisibilityIcon />
        </IconButton>:"")
        }
         {/* {
          
allowPre?.read?<IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
<VisibilityIcon />
</IconButton>:""
} */}
{
allowPre?.delete?<IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
<DeleteOutlineOutlinedIcon />
</IconButton>:""
}
       
        
        
        
      </strong>
      ),
    },
  ];

  useEffect(() => {

    let endpoint = `getAllwithJoin?table=fms_stf_document&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          setEmployees(response?.messages);
          localStorage.setItem("currentData",JSON.stringify(response?.messages))
          localStorage.setItem("fieldName",JSON.stringify(fieldName))
          localStorage.setItem("pageName","Documents")
         
        }else{
          setEmployees([])
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isDelete,localStorageData]);


  // useEffect(()=>{
  //   setColumnData(columns)
  // },[showFilterFields])


  const handleAddButton = () => {
    navigate('/staff/documents/add')

  };
  const handleEdit = async (id) => {
    try {
      const endpoint = `getWhereDocument?table=fms_stf_document&field=dcmt_id&id=${id}`
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);

      if (response.status) {
        navigate('/staff/documents/edit',
          {
            state: {
              allowPre,
              selectedDocument: response?.messages
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
        let endpoint = `deleteStatus?table=fms_stf_document&field=dcmt_id&id=${id}&delete_status=dcmt_status&value=1`
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        response.then(data => {
          if (data.status){
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

  
  const settingPage=()=>{
   
    navigate('/staff-documents/settings')
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

  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Documents</h3>
     <Box sx={{ flexGrow: 1 }} />
    {/* <GridToolbarColumnsButton /> */}
     <SettingsIcon onClick={settingPage}  sx={{fontSize: 35, border: '1px solid #82868b',padding:"5px",color:"black",borderRadius:"5px",cursor:"pointer"}}/>
    <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
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
  </GridToolbarContainer>
  );

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
                  <DataGrid
className={employees.length<1?"hide_tableData":""}




            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.dcmt_id}
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
          />
        </>
      )}
          
    
    </div>
  );
};

export default Dashboard;
