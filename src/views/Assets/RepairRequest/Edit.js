import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import '../../../style/document.css'
import { BASE_URL, COMMON_GET_FUN, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST, IMG_BASE_URL } from '../../../helper/ApiInfo'
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import Swal from 'sweetalert2';
import { Upload } from 'antd';
import { Card, CardContent,Typography } from '@mui/material'
import dayjs from 'dayjs';
const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
  // const currentDate = new Date();
  console.log(selectedData);

  const id = selectedData.rpair_id;


  const [problem, setProblem] = useState(selectedData.rpair_problm)
  const [risk, setRisk] = useState(selectedData.rpair_risk);
  const [location, setLocation] = useState(selectedData.rpair_location);
  const [priority, setPriority] = useState(selectedData.rpair_priority);
  const [staff, setStaff] = useState(selectedData.rpair_stfid);
  const [attachment, setAttachment] = useState(selectedData.image_data);
  const [staffList, setStaffList] = useState([])
  const [newImage, setNewImage] = useState([])
  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)
const [selectedImage, setSelectedImage] = useState(null);
const [showModal, setShowModal] = useState(false);

useEffect(() => {
  if (selectedData) {
    const updateData = selectedData && selectedData.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectedData.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectedData]);

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
      
      let endpoint = 'deleteSelected?table=fms_assets_media&field=asset_id&id=' + id
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
 
  console.log(attachment);
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


    // // Create a link element
    // console.log(imageUrl);
    // const link = document.createElement('a');
    // link.href = imageUrl;
    // link.setAttribute('download', imageUrl);

    // // Append the link to the body
    // document.body.appendChild(link);

    // // Click the link to trigger the download
    // link.click();

    // // Clean up
    // document.body.removeChild(link);
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
      fileList.push(files[i].originFileObj); // Push only the file objects
    }
    setNewImage(fileList);
  };


  // const handleChange = (e) => {
  //   const files = e.fileList;
  //   console.log(files);
  //   const fileList = [];
  //   for (let i = 0; i < files.length; i++) {
  //     fileList.push(files[i].originFileObj); // Push only the file objects
  //   }
  //   setAttachment(fileList);
  // };

  // const handleChange = info => {
  //   if (info.file.status === 'uploading') {
  //     return
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, attachment => setAttachment(attachment))
  //   }
  // }


  // const [staffId, setStaffId] = useState(null);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, [setShow]);



  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setStaffList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
      // Handle the error as needed, such as showing a message to the user.
    }
  }

  useEffect(() => {

    getStaff();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    const emptyFields = [];

   
    if (!problem) {
      emptyFields.push('Problem');
    }
    if (!risk) {
      emptyFields.push('Risk');
    }
    if (!location) {
      emptyFields.push('Location');
    }
    if (!priority) {
      emptyFields.push('Priority ');
    }
    if (!staff) {
      emptyFields.push('Staff');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();

    formData.append('rpair_stfid', staff);
    formData.append('rpair_problm', problem);
    formData.append('rpair_risk', risk);
    formData.append('rpair_priority', priority);
    formData.append('rpair_location', location);


    formData.append('updated_at', currentTime);

    // Append files
    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    console.log(formData);

    let endpoint = 'updateAssets?table=fms_repair_request&field=rpair_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      // console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };

  return (
    <>
     <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
        <h1>Edit Repair Request</h1>
        <TextField
          required
          value={problem}
          multiline
          rows={5}
          label="Problem"
          type="text"
          onChange={(e) => { setProblem(e.target.value) }}
        />
        <TextField
          required
          value={risk}
          multiline
          rows={5}
          label="Risk"
          type="text"
          onChange={(e) => { setRisk(e.target.value) }}
        />
        <TextField
          value={location}
          multiline
          label="Location"
          type="text"
          onChange={(e) => { setLocation(e.target.value) }}
        />
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Priority'>Priority</InputLabel>
          <Select
            labelId='Priority'
            id='Priority'
            value={priority}
            label='Priority'
            onChange={e => setPriority(e.target.value)}
          >

            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>


          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setStaff(e.target.value)}>
            {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

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
              <DeleteIcon onClick={() => handleDeleteImage(fileName.asset_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
              <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
            </div> :
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
              <DeleteIcon onClick={() => handleDeleteImage(fileName.asset_id,index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
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
          <Stack direction="row-reverse">
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
            {allowPre.edit ? (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            ) : (
              ''
            )}
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
   
  );
};

export default Edit;
