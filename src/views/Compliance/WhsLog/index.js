import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
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
import { BASE_URL, COMMON_GET_FUN } from 'helper/ApiInfo'

//import { employeesData } from './data';

const Dashboard = ({ setShow, show }) => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)

  // //console.log(allowUser);
  const { allowUser,companyId} = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // //console.log(data);
    if (data.user === 'WHS Logs') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  const columns = [
    {
      field: `Date`,
      headerName: 'Date',
      width: 180,
      valueGetter: params => {
        //console.log(params)
        const date = new Date(params.row.whs_date)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
        const year = date.getFullYear()
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`
      }
    },

    { field: `whs_ctgry`, headerName: 'Category', width: 130, },

    { field: 'whs_location', headerName: 'Location', width: 130 },

    {
      field: `name`,
      headerName: 'Next Review Date',
      width: 170,
      renderCell: (params) => {
        // //console.log(params.row);
        // const currentDate = new Date();
        const reviewDate = new Date(params.row.whs_rvudate);
        const startDate = new Date(params.row.whs_rvudate);

        const day = reviewDate.getDate().toString().padStart(2, '0');
        const month = (reviewDate.getMonth() + 1).toString().padStart(2, '0');
        const year = reviewDate.getFullYear();

        if (params.row.whs_rvudate === '0000-00-00') {

          return <div className='commonCla grayClr'>No date</div>;
        }
        // Check if the review date is in the future


        if (reviewDate >= startDate) {
          return <div className='commonCla greenClr' >{`${day}/${month}/${year}`}</div>
        } else {
          return <div className='commonCla redClr' >{`${day}/${month}/${year}`}</div>

        }

      },
    },
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
      let endpoint = `joinWithComplianceList?table=fms_whs_logs&status=0&company_id=${companyId}`;
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        //console.log(response);
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
  }, [isAdding, isEditing, isdelete]);
  

  const handleEdit = async id => {
    let endpoint = 'editComplianceData?table=fms_whs_logs&field=whs_id&id=' + id
    try {
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      let data = await response
      //console.log(data.messages);
      if (data.status) {
        setSelectedDocument(data.messages)
        setIsEditing(true)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }
  

  const handleAddButton = () => {
    setIsAdding(true)
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
       
        let endpoint = `deleteStatus?table=fms_whs_logs&field=whs_id&id=${id}&delete_status=whs_status&value=1`
        
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

 
  function CustomToolbar() {
    return (
      <GridToolbarContainer >
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>WHS Logs</h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {
          allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
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
            getRowId={row => row.whs_id}
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
      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} />}
      {isEditing && <Edit setShow={setShow} selectedData={selectedDocument} setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  )
}

export default Dashboard
