import React, { useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import '../../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import { Upload } from 'antd'
import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import {BASE_URL, COMMON_UPDATE_FUN, IMG_BASE_URL} from '../../../../helper/ApiInfo'
import AuthContext from 'views/Login/AuthContext'
const Edit = ({ selectedDocument, setIsEditing, allowPre,participantId }) => {
  const participantdata = useSelector(state => state.participantData)
  const parData = participantdata.participantdata?.prtcpnt_firstname
  const lastName = participantdata.participantdata?.prtcpnt_lastname
  const final = `${parData}  ${lastName}`
console.log(selectedDocument);

// //console.log(IMG_BASE_URL);
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

  //console.log(hasExpiryDate)
  const id = selectedDocument.doc_id
  const {companyId} = useContext(AuthContext);

  
  const currentDate = new Date();
console.log(currentDate);

  const handleAddRow = () => {
    
    setHasExpiryDate(prevValue => !prevValue)
  }

  // const attachmentText = attachment.split(', ')
  // //console.log(attachmentText)
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

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData()
    formData.append('doc_prtcpntid',participant)
    formData.append('doc_ctgry_id', category)
    formData.append('doc_type_id', type)
    formData.append('doc_attchmnt', attachment)
    formData.append('doc_notes', note)
    formData.append('doc_exp', hasExpiryDate)
    formData.append('doc_expdate', expiryDate)
    formData.append('updated_at', currentTime);

    let endpoint = 'updateAll?table=fms_prtcpnt_documts&field=doc_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      //console.log(data);
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




  // Function to convert file to base64
// function getBase64(file, callback) {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(file);
// }

  // const handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, attachment => setAttachment(attachment))
  //   }
  // }

  // const props = {
  //   name: 'file',
  //   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  //   headers: {
  //     authorization: 'authorization-text'
  //   },
  //   onChange (info) {
  //     if (info.file.status !== 'uploading') {
  //       //console.log(info.file, info.fileList)
  //     }
  //     if (info.file.status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully`)
  //     } else if (info.file.status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`)
  //     }
  //   }
  // }
  // function beforeUpload (file) {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  //   if (!isJpgOrPng) {
  //     message.error('You can only upload JPG/PNG file!')
  //   }
    
  //   return isJpgOrPng && isLt2M
  // }

//get participant
  const getRole= async()=>{
    let endpoint = `getWhereAll?table=fms_prtcpnt_details&field=prtcpnt_id&value=${selectedDocument.doc_prtcpntid}`;

    let response =await fetch(`${BASE_URL}${endpoint}`,{
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if(response.ok){
      const res = await response.json()
      setParticipantList(res.messages)
console.log(res.messages);
    }

  }
  //getcategory 
  const getAdminstrationType = async () => {
    let endpoint = `getAll?table=document_categories&select=categorie_id,categorie_name,is_confidential,company_id&company_id=${companyId}&fields=status&status=0`;



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
      // //console.log(res);
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
      //console.log(res);
    }

  }

  useEffect(() => {
    getType()
  }, [category])

  useEffect(()=>{
    getRole()
    getAdminstrationType()
  },[])

  const handleDeleteImage = (index) => {
    //console.log(index);
    const updatedAttachment = attachment.filter((_, i) => i !== index);
    setAttachment(updatedAttachment.join(', ')); // Update attachment state
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleClickImage = (index) => {
    setSelectedImage(index);
  };

  const handleDownloadImage = (fileName) => {
    // Create a link element
    const link = document.createElement('a');
    // Set the href attribute to the URL of the image
    link.href = `${IMG_BASE_URL}${fileName?.image_name}`;
    // Set the download attribute to force download
    link.download = fileName?.image_name;
    // Append the link to the body
    document.body.appendChild(link);
    // Trigger the click event to start download
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
  };

  const handleViewImage = (fileName) => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
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

       
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center' }} className="customBoxCSS">
          <Upload
          style={{ width: '100px' }}
          
            listType='picture-card'
           
          >
            <Button size='small' >upload</Button>
          </Upload>
         
        </Box>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {Array.isArray(attachment) && attachment.map((fileName, index) => (
        <div key={index} style={{ width: '100px', position: 'relative' }}>
          <img
            src={`${IMG_BASE_URL}${fileName?.image_name}`}
            alt='Attachment Preview'
            style={{ width: '100%', height: '100px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={() => handleClickImage(index)}
          />
          {selectedImage === index && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
              <DeleteIcon onClick={() => handleDeleteImage(index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
              <VisibilityIcon onClick={() => handleViewImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
              <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
            </div>
          )}
        </div>
      ))}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
            <img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image_name}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
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
  )
}

export default Edit
