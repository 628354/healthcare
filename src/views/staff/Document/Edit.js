import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import '../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete';

import Select from '@mui/material/Select'
import { Upload } from 'antd'
import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

const Edit = ({ selectedDocument, setIsEditing, allowPre, setShow }) => {
  const participantdata = useSelector(state => state.participantData)
  const parData = participantdata.participantdata?.prtcpnt_firstname
  const lastName = participantdata.participantdata?.prtcpnt_lastname
  // const final = `${parData}  ${lastName}`
  console.log(selectedDocument);
  // console.log(IMG_BASE_URL);
  const [staff, setStaff] = useState(selectedDocument.dcmt_stfid)
  const [staffList, setstaffList] = useState([])
  const [category, setCategory] = useState(selectedDocument.dcmt_ctgry_id)
  const [type, setType] = useState(selectedDocument.dcmt_type_id)
  const [attachment, setAttachment] = useState(selectedDocument.image_data)
  const [note, setNote] = useState(selectedDocument.dcmt_note)
  const [hasExpiryDate, setHasExpiryDate] = useState(selectedDocument.dcmt_expdatestatus)
  const [expiryDate, setExpiryDate] = useState(selectedDocument.dcmt_expdate  ? dayjs(selectedDocument.dcmt_expdate) : null)

  const [categoryList, setCategoryList] = useState([])

const [showModal, setShowModal] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const[newImage,setNewImage]=useState([])

  const [typeList, setTypeList] = useState([])
  const id = selectedDocument.dcmt_id

  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)

console.log(category);
console.log(type);

useEffect(() => {
  if (selectedDocument) {
    const updateData = selectedDocument && selectedDocument.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectedDocument.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectedDocument]);

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const currentDate = new Date();

  const handleAddRow = () => {

    setHasExpiryDate(prevValue => !prevValue)
  }

  
  const handleDeleteImage = (id,index) => {
    console.log(index);
    console.log(id);
    const updatedAttachment = attachment.filter((_, i) => i !== index);
    setAttachment(updatedAttachment); // Update attachment state
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.value) {
        
        let endpoint = 'deleteSelected?table=fms_staff_media&field=media_id&id=' + id
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        console.log(response);
        response.then(data => {
          if (data.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `Record data has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            })
           
          }
        })
  
    
      }
    })
  }
  
  
    const handleClickImage = index => {
      setSelectedImage(index)
    }
  
    const handleDownloadImage = fileName => {
      const link = document.createElement('a')
      link.href = `${IMG_BASE_URL}${fileName?.image}`
      link.download = fileName?.image
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    const handleViewImage = (fileName) => {
      setShowModal(true);
    };
  
   
    const handleCloseModal = () => {
      setShowModal(false)
    }
  
  
    const handleChange = (e) => {
      const files = e.fileList;
      console.log(files);
      const fileList = [];
      for (let i = 0; i < files.length; i++) {
        fileList.push(files[i].originFileObj); 
      }
      setNewImage(fileList);
    };
    const getRole = async () => {
      try {
        let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff)
        if(response.status) {  
          setstaffList(response.messages)
         
        } else {
          throw new Error('Network response was not ok.')
        }
      } catch (error) {
        console.error('Error fetching staff data:', error)
      }
    }
    //getcategory 
    const getAdminstrationType = async () => {
      let endpoint = 'getAll?table=document_categories&select=categorie_id,categorie_name,is_confidential,company_id';
  
      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          //'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      if (response.ok) {
        const res = await response.json()
        setCategoryList(res.messages)
        // console.log(res);
      }
  
    }
    const getType = async () => {
      let endpoint = `getWhereAll?table=fms_participant_doc_name&field=categorie_id&value=${category}`;
  
  
      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          //'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      if (response.ok) {
        const res = await response.json()
        setTypeList(res.messages)
        console.log(res);
      }
  
    }
  
  const handleUpdate = e => {
    e.preventDefault()

    const emptyFields = [];
    if (!category) {
      emptyFields.push('Category');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
    if (!type) {
      emptyFields.push('Type');
      
    } if (!attachment) {
      emptyFields.push('Attechment');
    }
  
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const dateFormat = expiryDate ? expiryDate.format('YYYY-MM-DD') : null

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData()
    formData.append('dcmt_stfid', staff);
  formData.append('dcmt_ctgry_id', category);
  formData.append('dcmt_type_id', type);
  formData.append('dcmt_note', note);
  formData.append('dcmt_expdatestatus', hasExpiryDate);
  formData.append('dcmt_expdate', dateFormat);
    formData.append('created_at', currentTime);

    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
    let endpoint = 'updateStaff?table=fms_prtcpnt_documts&field=doc_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setIsEditing(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    })
  }


  

  useEffect(() => {
    getType()
  }, [category])

  useEffect(() => {
    getRole()
    getAdminstrationType()
  }, [])




  return (


    <>
        <div className='small-container'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleUpdate}
      >
        <h1>Edit Document</h1>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='staff'>Staff</InputLabel>
          <Select
            labelId='staff'
            id='staff'
            value={staff}
            label='staff'
            onChange={e => setStaff(e.target.value)}
          >
            {
    staffList?.map((item) => (
      <MenuItem key={item?.stf_id} value={item?.stf_id}>
        {item?.stf_firstname} {item?.stf_lastname}
      </MenuItem>
    ))
  }
          </Select>
        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Category</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={category}
            label="Status"
            onChange={(e) => {setCategory(e.target.value) }}
            required

          >
            {
              categoryList?.map((item) => {

                return (
                  <MenuItem key={item?.categorie_id} value={item?.categorie_id}>{item?.categorie_name}</MenuItem>

                )

              })
            }



          </Select>
        </FormControl>


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Type</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={type}
            label="Status"
            onChange={(e) => {setType(e.target.value) }}


          >
            {
              Array.isArray(typeList) && typeList.length > 0 ? (
                typeList.map((item) => (
                  <MenuItem key={item?.category_document_id} value={item?.category_document_id}>
                    {item?.category_document_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No types available</MenuItem>
              )
            }



          </Select>
        </FormControl>
        <TextField
          multiline
          label='Notes'
          type='text'
          value={note}
          onChange={e => {
            setNote(e.target.value)
          }}
        />
        {hasExpiryDate === '1' ? (
          <Switch label='Expiry date' defaultChecked onClick={handleAddRow} />
        ) : (
          <Switch label='Expiry date' onClick={handleAddRow} />
        )}
        {hasExpiryDate == 1 ? (
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Expiry Date'
                minDate={dayjs(currentDate)}
                format='DD/MM/YYYY'
                defaultValue={dayjs(expiryDate)}
                onChange={newValue => {
                  setExpiryDate(newValue)
                }}
              />
            </LocalizationProvider>
          </div>
        ) : null}
      <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
        <Button size='small'>Click here or Drag and drop a file in this area</Button>
      </Upload>

      <div className='cus_parent_div' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

{Array.isArray(attachment) && attachment.map((fileName, index) => {
  console.log(fileName);
  const nameOfFile = fileName?.image?.replace(/\d+/g, '')
  return (
    <div className='cus_child_div' key={index} style={{ width: '180px', position: 'relative' }}>
      {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ? (

        <div className='ddf' onClick={() => handleClickImage(index)}  ><p style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' ,textAlign:"center"}} className="Cus_file_Txt">
          {nameOfFile}
        </p></div>
      ) : (
        <img
          src={`${IMG_BASE_URL}${fileName.image}`}
          alt='Attachment Preview'
          style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
          onClick={() => handleClickImage(index)}
        />
      )}
      {selectedImage === index && (
        <>
          {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ?
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
              <DeleteIcon onClick={() => handleDeleteImage(fileName.media_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
              <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
            </div> :
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
              <DeleteIcon onClick={() => handleDeleteImage(fileName.media_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
              <VisibilityIcon onClick={() => handleViewImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
              <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
            </div>

          }

        </>


      )}
    </div>

  )
})}
{showModal && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
      <img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
      <button onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
    </div>
  </div>
)}

</div>


        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction='row-reverse'>
            <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
              Cancel
            </Button>
            <Button variant='outlined' type='submit'>
              Update
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
    
    
    <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>

  )
}

export default Edit
