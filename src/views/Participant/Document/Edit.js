import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import '../../../style/document.css'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import Select from '@mui/material/Select'
import { Upload } from 'antd'
import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import {BASE_URL, COMMON_GET_FUN, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, IMG_BASE_URL} from '../../../helper/ApiInfo'
import { Card, CardContent,Typography } from '@mui/material'
const Edit = ({ selectedDocument, setIsEditing, allowPre }) => {
  const participantdata = useSelector(state => state.participantData)
  const parData = participantdata.participantdata?.prtcpnt_firstname
  const lastName = participantdata.participantdata?.prtcpnt_lastname
  const final = `${parData}  ${lastName}`
console.log(selectedDocument);
const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const [participant, setParticipant] = useState(selectedDocument.doc_prtcpntid)
  const [category, setCategory] = useState(selectedDocument.doc_ctgry_id)
  const [type, setType] = useState(selectedDocument.doc_type_id)
  const [attachment, setAttachment] = useState(selectedDocument.image_data)
  const [note, setNote] = useState(selectedDocument.doc_notes)
  const [hasExpiryDate, setHasExpiryDate] = useState(selectedDocument.doc_exp)
  const [expiryDate, setExpiryDate] = useState(selectedDocument.doc_expdate)
  const [participantList,setParticipantList]=useState([])
  const [categoryList, setCategoryList] = useState([])
  const [typeList, setTypeList] = useState([])
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[newImage,setNewImage]=useState([])

  const id = selectedDocument.doc_id

  
  const currentDate = new Date();
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


  const handleAddRow = () => {
    
    setHasExpiryDate(prevValue => !prevValue)
  }

  // const attachmentText = attachment.split(', ')
  // console.log(attachmentText)
  const handleUpdate = e => {
    e.preventDefault()

    if (!category || !type) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      })
    }

    const formData = new FormData()
    formData.append('doc_prtcpntid',participant)
    formData.append('doc_ctgry_id', category)
    formData.append('doc_type_id', type)
    formData.append('doc_attchmnt', attachment)
    formData.append('doc_notes', note)
    formData.append('doc_exp', hasExpiryDate)
    formData.append('doc_expdate', expiryDate)

    formData.append('created_at', currentTime);
    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
    let endpoint = 'updateParticipant?table=fms_prtcpnt_documts&field=doc_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      console.log(data);
      //return data;
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


  

//get participant
const getParticipant = async () => {
  try {
    let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
    if(response.status) {  
      setParticipantList(response.messages)
     
    } else {
      throw new Error('Network response was not ok.')
    }
  } catch (error) {
    console.error('Error fetching staff data:', error)
    // Handle the error as needed, such as showing a message to the user.
  }
}
  //getcategory 
  const getAdminstrationType = async () => {
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'getAll?table=document_categories&select=categorie_id,categorie_name,is_confidential,company_id';


    let response = await fetch(`${url}${endpoint}`, {
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
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = `getWhereAll?table=fms_participant_doc_name&field=categorie_id&value=${category}`;


    let response = await fetch(`${url}${endpoint}`, {
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

  useEffect(() => {
    getType()
  }, [category])

  useEffect(()=>{
    getParticipant();
    getAdminstrationType();
  },[])

  
  const handleClickImage = (index) => {
    setSelectedImage(index);
  };
  const handleDownloadImage = (fileName) => {
    
    const imageUrl = `https://tactytechnology.com/mycarepoint/upload/admin/users/${fileName.image}`;
    const fileName2= imageUrl.split("/").pop();
    console.log(fileName2);
    const aTag =document.createElement('a')
    aTag.href=imageUrl
    aTag.setAttribute("download",fileName.image)
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();


  
};

  const handleViewImage = (fileName) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleChange = (e) => {
    const files = e.fileList;
    console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj); 
    }
    setNewImage(fileList);
  };
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
        
        let endpoint = 'deleteSelected?table=fms_participant_media&field=media_id&id=' + id
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

        <FormControl sx={{ width: '50ch', m: 1 }} required>
  <InputLabel id='participant'>Participant</InputLabel>
  <Select
    labelId='participant'
    id='participant'
    value={participant}
    label='Participant'
    onChange={e => setParticipant(e.target.value)}
  >
    {
      participantList?.map((item)=>{
     
        return(
          <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

        )

      })
    }
  </Select>
</FormControl>

<FormControl sx={{ width: '50ch', m: 1 }}>
          <InputLabel id="select-four-label">Category</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={category}
            label="Status"
            onChange={(e) => { setCategory(e.target.value) }}
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

       
        <FormControl sx={{ width: '50ch', m: 1 }}>
          <InputLabel id="select-four-label">Type</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={type}
            label="Status"
            onChange={(e) => { setType(e.target.value) }}


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
                value={dayjs(expiryDate)}
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

        {/* date picker field */}

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
            <Typography variant="h5"> <span> {createDate} </span> {updateDate ? <span> || {updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>
   
  )
}

export default Edit
