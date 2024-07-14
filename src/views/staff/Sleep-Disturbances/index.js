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
} from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
import { Box, Stack } from '@mui/system';
import { Typography } from 'antd';
import '../../../style/document.css'
import { Menu } from '@mui/material';





const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
const [showFilterFields,setShowFilterFields]= useState(false)
const { allowUser } = useContext(AuthContext)
const allowPre = allowUser.find((data) => {
  // console.log(data);

  if (data.user === "Sleep Disturbances") {
    return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
  }


})



const [rows, setRows] = useState([{value1: '', value2: '', value3: '' }]);
// console.log(employees);
const [anchorEl, setAnchorEl] = useState(false);

const addRow = () => {
  setRows([...rows, { value1: '', value2: '', value3: '' }]);
};

const removeRow =(i)=>{
  const deleteVal = [...rows]
  deleteVal.splice(i,1)
  setRows(deleteVal)
};

const handleChange = (e, i) => {
  const { name, value } = e.target;
  const updatedRows = [...rows];
  updatedRows[i][name] = value; 
  setRows(updatedRows);
};


// console.log(rows);

const [resourceData, setResourceData] = useState([]);

const fetchData = async () => {
  try {
   
    const url = `${BASE_URL}getAll?table=fms_setting_resource&select=resource_id,resource_date,resource_staff_id,resource_type,resource_title,company_id,resource_status,resource_clltntype,resource_status&company_id=${companyId}&fields=resource_status&status=0`;
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (data.status) {
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const filteredEmployees = data.messages.filter(employee => {
          // console.log(employee.resource_clltntype);
    
          const clltntypes = employee.resource_clltntype.split(',').map(item => item.trim());

        
          return clltntypes.some(name => name === "Sleep Disturbances");
        });
        setResourceData(filteredEmployees);
    //  console.log(filteredEmployees);
      } 
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// console.log(resourceData);
useEffect(()=>{
  fetchData();

},[])



const openFilter=()=>{
  setShowFilterFields(true)
}
const closeFilter=()=>{
  setShowFilterFields(false)
  setRows([{value1: '', value2: '', value3: '' }])
}
  // console.log(allowUser);

  const columns = [
    {
      field: `slpdis_prtcpnt`, headerName: 'Participant Name', width: 130,
      valueGetter: (params) => {
        // console.log(params);
        return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`


      },
    },
    {
      field: `slpdis_date`, headerName: 'Date', width: 180,
      valueGetter: (params) => {
        // console.log(params);
        const date = new Date(params.row.slpdis_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`;


      },
    },
    { field: 'slpdis_hour', headerName: 'Total Hour', width: 130 },
    {
      field: `slpdis_stfid`, headerName: 'Staff ', width: 130,
      valueGetter: (params) => {
        // console.log(params);
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


  useEffect(() => {

    let endpoint = `getAllwithJoin?table=fms_stf_slepdisterbnc&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          // console.log(response.messages);
          if (Array.isArray(response.messages) && response.messages.length > 0) {
            const rowsWithIds = response.messages.map((row, index) => ({ ...row, id: index }));
            setEmployees(rowsWithIds);
          } else {
            setEmployees([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete]);

  const handleEdit = async (id) => {
    try {
      const endpoint = `getWhere?table=fms_stf_slepdisterbnc&field=slpdis_id&id=${id}`
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);

      if (response.status) {
        setSelectedDocument(response.messages);
        setIsEditing(true);
      } else {
        console.error('Request was not successful:', response.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const handleAddButton = () => {
    setIsAdding(true);
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
    <Box id="filter_icon" className='drop_pos'  onClick={handleClick} >
    <SystemUpdateAltIcon/>
    <Typography  id='fiter_txt' >Filter</Typography>
 
    </Box>

    {
      anchorEl? 
      <ul
      id="dropdown-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClick}
      className='download_opt'
     
    >
      <li onClick={convertIntoCsv} className='drop_li' >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <span className="align-middle ml-50">CSV</span>
      </li>
      <li onClick={() => window.print()} className='drop_li'>
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

  showFilterFields?<Grid container sx={{ margin: '0px 21px' }}>



{rows.map((val,i)=>{
 
//  console.log(val);
//  console.log(i);
  return(
    <Grid
    container
    justifyContent="space-between"
    alignItems="center"
    spacing={1}
    key={i}
    marginBottom="10px"
  >
    <Grid item xs={1}>
      <IconButton>
        <RemoveCircleOutlineIcon sx={{ color: "red" }} onClick={() => removeRow(i)} />
      </IconButton>
    </Grid>
    <Grid item xs={3}>
      <Select
        fullWidth
        name='value1'
        value={val.value1}
        onChange={(e)=>handleChange(e,i)} 
      >

        {columns.map((item,index)=>{
// console.log(rows);
          return(
        <MenuItem key={index} value={item?.field}>{item?.headerName}</MenuItem>

          )
        })}
        
        
      </Select>
    </Grid>
    <Grid item xs={3}>
      <Select
        fullWidth
        name='value2'

        value={val.value2}
        onChange={(e)=>handleChange(e,i)} 
      >
        <MenuItem value="1">is</MenuItem>
        <MenuItem value="2 not">is not</MenuItem>
        <MenuItem value="3">Contains</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={4}>

{/* {
  rows
} */}
    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker

            label="Date"
            onChange={e => handleChange(row.id, 'value3', e)}

          />
        </LocalizationProvider> */}

      <TextField
        fullWidth
        placeholder="Value"
        type="text"
        name='value3'

          value={val.value3}
          onChange={(e)=>handleChange(e,i)} 
        
      />
    </Grid>
    <Grid item xs={1}>
      <IconButton>
        <AddCircleOutlineIcon sx={{ color: "green", marginBottom: "0px" }} onClick={addRow} />
      </IconButton>
    </Grid>
  </Grid>
  )

})}






  <Box sx={{width: '100ch',m:1}}>
        <Stack direction="row-reverse"
              spacing={2}>
          <Button variant="outlined" type="submit" >Apply</Button>
          <Button variant="outlined" color="error" type="button" onClick={closeFilter}>Cancel</Button>
         
          
        </Stack>
    </Box>
</Grid> :""
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
      {isAdding && (
        <Add
          setIsAdding={setIsAdding}
        />
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
