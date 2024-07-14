import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
// import '../../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, IMG_BASE_URL } from 'helper/ApiInfo'
import { Card, CardContent,Typography } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';

const Edit = ({ selectedMadication, setIsEditing,allowPre,setShow}) => {
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const id = selectedMadication.mdi_id;
  const [date, setDate] = useState(selectedMadication.mdi_date? dayjs(selectedMadication.mdi_date): null);
  const[staff,setStaff]=useState(selectedMadication.mdi_stf)
  const [participant, setParticipant] = useState(selectedMadication.mdi_prtcpntsid);
  const [participantList,setParticipantList]=useState([])

  const [levelOfSupport, setLevelOfSupport] = useState(selectedMadication.mdi_level);
  const [note, setNote] = useState(selectedMadication.mdi_note);
  const [nextReviewDate, setNextReviewDate] = useState(selectedMadication.mdi_rvudate === '0000-00-00' ? "":selectedMadication.mdi_rvudate)
  const [attachment, setAttachment] = useState(selectedMadication.image_data);
  const[newImage,setNewImage]=useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)
  
  useEffect(() => {

    // if(show){
      setShow(true)
    return () => setShow(false)
  
    // }
    
  }, [setShow])

  useEffect(() => {
    if (selectedMadication) {
      const updateData = selectedMadication && selectedMadication.updated_at
  
      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedMadication.created_at
  
      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedMadication]);
  const getRole = async () => {
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
  
  useEffect(()=>{
  getRole();
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

  const handleUpdate = e => {
    e.preventDefault();
    const emptyFields = [];
   
    if (!date) {
      emptyFields.push('Date');
    }

    if (!levelOfSupport) {
      emptyFields.push('Subject');
    }
    if (!participant) {
      emptyFields.push('Participant');
    }
    if (!staff) {
      emptyFields.push('Satff');
    }
    if (!note) {
      emptyFields.push('Notes');
    }
    if (!attachment) {
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

 
  const checkStartDate = dayjs(`${date}` );
  const checkNextDate = dayjs(`${nextReviewDate}`);

  if(checkNextDate.isBefore(checkStartDate)){
    return Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: ' Next Review Date cannot be less than start date.',
      showConfirmButton: true
    });
  }
   

    const formattedDate = dayjs(date).format('YYYY-MM-DD'); 
const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');
  
    const formData = new FormData();
    formData.append('mdi_date', formattedDate);
    formData.append('mdi_stf', staff);
    formData.append('mdi_prtcpntsid', participant);
    formData.append('mdi_level', levelOfSupport);
    formData.append('mdi_note', note);
    formData.append('mdi_rvudate',formattedNextDate);
    formData.append('updated_at', currentTime);
    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = 'updateParticipant?table=fms_medicationchart&field=mdi_id&id=' + id
    let response = COMMON_ADD_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
         
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `data has been Updated.`,
              showConfirmButton: false,
              timer: 1500
            });
            setIsEditing(false)
          }else{
            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something Went Wrong.',
            showConfirmButton: true,
      });
          }
      });
    
  }

  const handleDeleteImage = (id,index) => {

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
        <div className="small-container">

<Box
  component="form"
 
  sx={{
    '& .MuiTextField-root': { m: 1, width: '50ch' },
    //bgcolor:'#FFFFFF'
  }}
  noValidate
  autoComplete="off"
  onSubmit={handleUpdate}
>
   <h1>Update Medication Chart</h1>

   <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label="Date" value={dayjs(date)} format="DD/MM/YYYY" onChange={(newValue) => {setDate(newValue) }} />
  </LocalizationProvider>

   <FormControl sx={{ width: '50ch', m: 1 }} required>
    <InputLabel id='staff'>Staff</InputLabel>
    <Select
      labelId='staff'
      id='staff'
      value={staff}
      label='Staff'
      onChange={e => setStaff(e.target.value)}
    >
        <MenuItem   style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
    </Select>
  </FormControl>

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
 
  <TextField
    required
    label='Level of support required *'
    value={levelOfSupport}
    onChange={e => {
      setLevelOfSupport(e.target.value)
    }}
  />
     <TextField
    value={note}
      multiline
      label="Notes"
      type="text"
      onChange={(e)=>{setNote(e.target.value)}}
    />


<LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker value={dayjs(nextReviewDate)}   minDate={dayjs(date)} format="DD/MM/YYYY" label="Next review date" onChange={(newValue)=>{setNextReviewDate(newValue)}} />
    </LocalizationProvider>


   
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

    
    
    <Box sx={{width: '100ch',m:1}}>
        <Stack direction="row-reverse"
              spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
          {
            
            allowPre?.edit?<Button variant="outlined" type="submit" >Update</Button>:""
            }
          
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
