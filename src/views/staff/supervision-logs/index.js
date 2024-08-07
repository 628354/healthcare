import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import FIlter from '../../Filter'

import {
  DataGrid/* GridToolbar */, GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  // GridToolbarDensitySelector, 
} from '@mui/x-data-grid';

import { BASE_URL, COMMON_GET_FUN, } from 'helper/ApiInfo';
import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import { Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

//import { employeesData } from './data';

const Dashboard = ({ setShow, show }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedSuperLog, setSelectedSuperLog] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const { allowUser, companyId } = useContext(AuthContext)

  const allowPre = allowUser.find((data) => {
    // //console.log(data);
    if (data.user === "Supervision Logs") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
    }


  })
  const filterPageData =useSelector((state)=>state.filterAllData?.filterAllData)
  console.log(filterPageData);
  const columns = [


    {
      field: 'stf_firstname', headerName: 'Staff', width: 200,
      valueGetter: (params) => {
        //console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname} `
      }
    },
    {
      field: 'name',
      headerName: 'Date',
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.row.suprvsn_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
      },
    },

    {
      field: 'suprvsn_type',
      headerName: 'Type',
      width: 90,
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

    let endpoint = `getAllwithJoin?table=fms_stf_supervision&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          // //console.log(response.messages);
          setEmployees(response?.messages);
          
        
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete]);

  const handleEdit = async (id) => {
    try {
      const endpoint = `getWhereSupervision?table=fms_stf_supervision&field=suprvsn_id&id=${id}`
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);

      if (response.status) {
        setSelectedSuperLog(response.messages);
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
        let endpoint = `deleteStatus?table=fms_stf_supervision&field=suprvsn_id&id=${id}&delete_status=suprvsn_status&value=1`
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
  const [showFilterFields,setShowFilterFields]= useState(false)

  const openFilter=()=>{
    setShowFilterFields(true)
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <h3 style={{ fontSize: '1.285rem', fontWeight: '500' }}>Supervision Logs</h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <Box  onClick={openFilter} id="filter_icon">
      <FilterListIcon />
      <Typography  id='fiter_txt' >Filter</Typography>
    </Box>
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport sx={{ border: '1px solid #82868b', width: '100px', color: 'black', height: '35px' }} />
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
  const [columnData,setColumnData]=useState([])
  useEffect(()=>{
    setColumnData(columns)
  },[showFilterFields])
  return (
    <div className="container">



      {!isAdding && !isEditing && (
        <>

          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

          <DataGrid
            className={employees.length < 1 ? "hide_tableData" : ""}
            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={(row) => row.suprvsn_id}
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
          setShow={setShow}
        />
      )}

      {isEditing && (
        <Edit
          setShow={setShow}
          selectedSuperLog={selectedSuperLog}
          setIsEditing={setIsEditing}




        />
      )}

    </div>
  );
};

export default Dashboard;
