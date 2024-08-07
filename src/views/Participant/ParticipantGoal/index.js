import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import '../../../style/document.css';
import { DataGrid /* GridToolbar */, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';

import VisibilityIcon from '@mui/icons-material/Visibility';

import Swal from 'sweetalert2';

///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo';

//import { employeesData } from './data';

const ParticipantGoal = ({setShow, show}) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);

  const { allowUser,companyId} = useContext(AuthContext);

  const allowPre = allowUser.find((data) => {
    // //console.log(data);
    if (data.user === 'RP Register') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read };
    }
  });
  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])


  const columns = [
    { field: 'participantName', headerName: 'Participant', width: 130,
    valueGetter:(params)=>{
        //console.log(params);
        return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname} `
      }
     },

    {
      field: 'gol_title',
      headerName: 'Goal',
      width: 190
    },

    {
      field: 'gol_status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => {
        if (params.value === 'In Progress') {
          return <div className="commonCla blueClr">{params.value}</div>;
        } else if (params.value === 'Achieved') {
          return <div className="commonCla greenClr">{params.value}</div>;
        }
      }
    },
    {
      field: 'gol_type',
      headerName: 'Typpe',
      minWidth: 150
      /* valueFormatter: (params)=>{
                              let date = date(params);
                              let newDate = date.getDay+'-'+date.getMonth()+'-'+date.getFullYear();
                                return newDate;
                          }, */
    },
    {
      field: `name`,
      headerName: 'Next Review Date',
      width: 170,
      renderCell: (params) => {
        const currentDate = new Date();
        const reviewDate = new Date(params.row.gol_rvudate);

        const day = reviewDate.getDate().toString().padStart(2, '0');
        const month = (reviewDate.getMonth() + 1).toString().padStart(2, '0');
        const year = reviewDate.getFullYear();

        if (params.row.gol_rvudate === '0000-00-00') {
          return <div className="commonCla grayClr">No date</div>;
        }
        // Check if the review date is in the future

        if (reviewDate >= currentDate) {
          return <div className="commonCla greenClr">{`${day}/${month}/${year}`}</div>;
        } else {
          return <div className="commonCla redClr">{`${day}/${month}/${year}`}</div>;
        }
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,

      renderCell: (params) => (
        <strong>
          {allowPre?.edit ? (
            <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton>
          ) : allowPre?.read ? (
            <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton>
          ) : (
            ''
          )}
          {allowPre?.delete ? (
            <IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          ) : (
            ''
          )}
        </strong>
      )
    }
  ];
  useEffect(() => {
    
    let endpoint = `getAllwithJoin?table=fms_goals&status=0&company_id=${companyId}`;
 

    let response = COMMON_GET_FUN(BASE_URL, endpoint);
    response.then((data) => {
      //console.log(data);
      if (data.status) {
       
        setEmployees(data?.messages);
      }else{
        setEmployees([]);

      }
    });
  }, [isAdding, isEditing, isdelete]);

  const handleEdit = (id) => {
    //const [employee] = employees.filter(employee => employee.id === id);
    let endpoint = 'getWhere?table=fms_goals&field=gol_id&id=' + id;
    let response = COMMON_GET_FUN(BASE_URL, endpoint);
    response.then((data) => {
      // //console.log(data);
      if (data.status) {
        setSelectedEmployee(data.messages);
        setIsEditing(true);
      }
    });
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
        let endpoint = `deleteStatus?table=fms_goals&field=gol_id&id=${id}&delete_status=status&value=1`
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
      }
    })
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <h3 style={{ fontSize: '1.285rem', fontWeight: '500' }}>Participant Goal</h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: '100px', color: 'black', height: '35px' }} />
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
            getRowId={(row) => row.gol_id}
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
      {isAdding && <Add setIsAdding={setIsAdding}  setShow={setShow} show={show}/>}
      {isEditing && <Edit selectedGoal={selectedEmployee} setShow={setShow} show={show} setIsEditing={setIsEditing} allowPre={allowPre}  />}
    </div>
  );
};

export default ParticipantGoal;
