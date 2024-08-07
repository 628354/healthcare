import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import headerImg from  '../../../assets/images/supportImage3.c1e1320e.png'
import CloseIcon from '@mui/icons-material/Close';
import '../../../style/document.css'
import { BASE_URL, COMMON_GET_FUN } from 'helper/ApiInfo';
import { useNavigate } from 'react-router';
// import { log } from 'util';
import {printEmployeesData} from '../../PDF'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ClickAwayListener, Typography } from '@mui/material';
const Dashboard = () => {
const localStorageData =localStorage.getItem("currentData")
  
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser,companyId}=useContext(AuthContext)
const [anchorEl, setAnchorEl] = useState(false);
  
  const navigate=useNavigate()
  const allowPre= allowUser.find((data)=>{
    // //console.log(data);
     if(data.user === "Company List"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })

  // //console.log(selectedEmployeeName);
  const columns = [
   
    // { field:'comm_prtcpntid', headerName: 'Client', width: 170 },
   
  
                    { field: 'company_name', headerName: 'Company Name', width: 300 },
                    { field: 'email', headerName: 'Email', width: 300 },
               
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => 
      { 
        return(
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
      )},
    },
  ];

  const fieldName = [
    { field: 'company_name', headerName: 'Company Name' },
    { field: 'phone', headerName: 'Contact Number' },
    { field: 'address', headerName: 'Address' },
    { field: 'website', headerName: 'Website Url' }, 
    { field: 'email', headerName: 'Company Email' },
  
    { field: 'registration_number', headerName: 'NDIS' },
    { field: 'abn', headerName: 'ABN' }, 
    { field: 'account_bsb', headerName: 'Account bsb' },
    { field: 'account_number', headerName: 'Account Number' },

    { field: 'account_name', headerName: 'Account Name' },
 
   
  ];

  useEffect(() => {
    fetchData();
  }, [isAdding, isEditing, isDelete,localStorageData]);

  const fetchData = async () => {
 
    try {
     
      const url = `${BASE_URL}getAll?table=fms_company&select=id,company_name,phone,address,website,email,timezone,registration_number,abn,photo,account_bsb,account_number,account_name,password&fields=status&status=0`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (data.status) {
         const data2  = data.messages?.filter(item => item.id !=="1")
         //console.log(data2);
         
    //  const data2  = data.messages?.filter((item)=>{
    //       return item.id !== "1"
    //     })

   
    if(data2.length>0){
      setEmployees(data2);
      localStorage.setItem("currentData",JSON.stringify(data2))

            localStorage.setItem("fieldName",JSON.stringify(fieldName))
            localStorage.setItem("pageName","Company List")

      // //console.log(data2);

    }else{
    setEmployees([]);

    }
      }
    

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleEdit = (id) => {
  //   navigate(`/settings/companyList/edit/${id}`)

  // };

  const handleEdit =(id) => {
    try {
      let endpoint = 'companyData?table=fms_company&id=' + id
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        //console.log(data);
        if (data.status) {
          navigate('/settings/companyList/edit',
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
    navigate('/settings/companyList/add')

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
        let endpoint = `deleteStatus?table=fms_company&field=id&id=${id}&delete_status=status&value=1`
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
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Company List</h3>
     <Box sx={{ flexGrow: 1 }} />
    {/* <GridToolbarColumnsButton /> */}
    <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
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

  return (
    <div className="container">
      
      {!isAdding && !isEditing && (
        <>
                  <DataGrid
className={employees.length<1?"hide_tableData":""}




            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row?.id}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              m: 2,
              boxShadow:2,
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


      {/* {isAdding && <Add setIsAdding={setIsAdding} />}
      {isEditing && <Edit selectData={selectedDocument}setIsEditing={setIsEditing} allowPre={allowPre}/>} */}
    </div>
  );
};

export default Dashboard;
