import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';
import { Typography } from 'antd';
import headerImg from '../../../assets/images/supportImage3.c1e1320e.png'
import CloseIcon from '@mui/icons-material/Close';
import '../../../style/document.css'
// import { log } from 'util';
import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo';

const Dashboard = ({ setShow, show }) => {

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const { allowUser,companyId} = useContext(AuthContext)
  const [showInfo, setShowInfo] = useState(false)


  const handleCardOpen = () => {
    setShowInfo(!showInfo)
  }
  const handleCardClose = () => {
    setShowInfo(false)
  }
  const allowPre = allowUser.find((data) => {
    // //console.log(data);
    if (data.user === "Seizure") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
    }


  })

  // //console.log(selectedEmployeeName);
  const columns = [

    // { field:'comm_prtcpntid', headerName: 'Client', width: 170 },
    {
      field: `participant`, headerName: 'Participant', width: 140,
      valueGetter: (params) => {
        // //console.log(params);
        return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`


      },
    },



    {
      field: `name`, headerName: 'Date', width: 120,
      valueGetter: (params) => {
        //console.log(params);
        const date = new Date(params.row.szr_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
        const year = date.getFullYear();
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`;


      },
    },
    { field: 'szr_action', headerName: 'Action Taken By Staff', width: 120 },
    { field: 'szr_rcvry', headerName: 'Recovery', width: 120 },
    {
      field: `staff`, headerName: 'Staff', width: 130,
      valueGetter: (params) => {
        // //console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname}`


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

    let endpoint = `joinWithObservations?table=fms_seizure&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          setEmployees(response.messages);
          // localStorage.setItem("currentData", JSON.stringify(response.messages));
          // localStorage.setItem("fieldName", JSON.stringify(fieldName));
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isDelete]);

  const handleEdit = async (id) => {
    try {
      const endpoint = `getWhere?table=fms_seizure&field=szr_id&id=${id}`
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
        let endpoint = `deleteStatus?table=fms_seizure&field=szr_id&id=${id}&delete_status=szr_status&value=1`
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



  const CustomToolbar = () => (
    <GridToolbarContainer >
      <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Seizure Logs<span><InfoIcon onClick={handleCardOpen} /></span></h3>
      <Box sx={{ flexGrow: 1 }} />
      {/* <GridToolbarColumnsButton /> */}
      <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
      {/* <GridToolbarDensitySelector /> */}
      <GridToolbarExport sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
      {
        allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
      }
      {
        showInfo ? <Card sx={{ width: '100%' }} className='ObCard' >
          <IconButton aria-label="settings" className='cardIcon'>
            <CloseIcon onClick={handleCardClose} />
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
                title="Introduction to Seizure Logs"
              />
              <Typography variant="body2" color="text.secondary">
                Care Diary allows you to record Oxygen Seizure Logs for your participants. You can also export this data in CSV or PDF format.
              </Typography>
            </CardContent>

          </div>


        </Card> : ''
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
            style={{ padding: 20 }}
            getRowId={(row) => row.szr_id}
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


      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} />}
      {isEditing && <Edit selectData={selectedDocument} setShow={setShow} setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  );
};

export default Dashboard;
