import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../../style/document.css'
import { BASE_URL, COMMON_GET_FUN, COMMON_UPDATE_FUN, IMG_BASE_URL } from '../../../helper/ApiInfo'
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

const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
  // const currentDate = new Date();
  // console.log(selectedData.plc_rvudate);


  const id = selectedData.plc_id;
  const currentDate = new Date();
  const [name, setName] = useState(selectedData.plc_name);
  const [version, setVersion] = useState(selectedData.plc_version)
  const [nextReviewDate, setNextReviewDate] = useState(selectedData.plc_rvudate === "0000-00-00" ? "" : selectedData.plc_rvudate)
  const [attachment, setAttachment] = useState(selectedData.image_data);

  const [reasonForUpdate, setReasonForUpdate] = useState(selectedData.plc_rsnupdte);
  const [consultationWith, setConsultationWith] = useState(selectedData.plc_conslt);
  const [staffEducationCom, setStaffEducationCom] = useState(selectedData.plc_stfedu);


  const [newImage, setNewImage] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)

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

  const handleClickImage = (index) => {
    setSelectedImage(index);
  };
  const handleDownloadImage = (fileName) => {

    const imageUrl = `https://tactytechnology.com/mycarepoint/upload/admin/users/${fileName.image}`;
    const fileName2 = imageUrl.split("/").pop();
    console.log(fileName2);
    const aTag = document.createElement('a')
    aTag.href = imageUrl
    aTag.setAttribute("download", fileName.image)
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
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj);
    }
    setNewImage(fileList);
  };
  const handleDeleteImage = (id, index) => {

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

        let endpoint = 'deleteSelected?table=fms_company_media&field=company_id&id=' + id
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



  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, [setShow]);



  const handleUpdate = (e) => {
    e.preventDefault();
    const emptyFields = [];

    if (!name) {
      emptyFields.push('Name');
    }

    if (!version) {
      emptyFields.push('Version');
    }
    if (!attachment) {
      emptyFields.push('Attechment');
    }
    if (!consultationWith) {
      emptyFields.push('Consultation with');
    }
    if (!staffEducationCom) {
      emptyFields.push('Staff education completed');
    }
    if (!reasonForUpdate) {
      emptyFields.push('Reason for update');
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

    const newdateFormat = nextReviewDate ? dayjs(nextReviewDate).format('YYYY-MM-DD') : null

    const formData = new FormData();

    formData.append('plc_name', name);
    formData.append('plc_version', version);
    formData.append('plc_rvudate', newdateFormat);
    formData.append('plc_rsnupdte', reasonForUpdate);
    formData.append('plc_conslt', consultationWith);
    formData.append('plc_stfedu', staffEducationCom);
    formData.append('updated_at', currentTime);




    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = 'updateComapny?table=fms_policies&field=plc_id&id=' + id;
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
        <h1>Edit Policies</h1>
        <TextField
          value={name}
          label="Name"
          type="text"
          onChange={(e) => { setName(e.target.value) }}
        />

        <TextField
          value={version}

          label="Version "
          type="text"
          onChange={(e) => { setVersion(e.target.value) }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next review date'
            format='DD/MM/YYYY'
            value={nextReviewDate ? dayjs(nextReviewDate) : null} 
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setNextReviewDate(newValue)
            }}
          />
        </LocalizationProvider>
        <TextField
          value={reasonForUpdate}
          multiline
          rows={5}
          label="Reason for Update"
          type="text"
          onChange={(e) => { setReasonForUpdate(e.target.value) }}
        />
        <TextField
          value={consultationWith}

          label="Consultation with"
          type="text"
          onChange={(e) => { setConsultationWith(e.target.value) }}
        />

        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='StaffEducationCompleted '>Staff Education Completed</InputLabel>
          <Select labelId='StaffEducationCompleted' id='StaffEducationCompleted' value={staffEducationCom} label='Staff Education Completed' onChange={e => setStaffEducationCom(e.target.value)}>
            <MenuItem value='Yes'>Yes</MenuItem>
            <MenuItem value='No'>No</MenuItem>
            <MenuItem value='Not Applicable'>Not Applicable</MenuItem>

          </Select>
        </FormControl>



        <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
          <Button size='small'>Click here or Drag and drop a file in this area</Button>
        </Upload>


        <div className='cus_parent_div' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>

          {Array.isArray(attachment) && attachment.map((fileName, index) => {
            console.log(fileName);
            const nameOfFile = fileName?.image?.replace(/\d+/g, '')
            return (
              <div className='cus_child_div' key={index} style={{ width: '180px', position: 'relative' }}>
                {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ? (

                  <div className='ddf' onClick={() => handleClickImage(index)}  ><p style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer', textAlign: "center" }} className="Cus_file_Txt">
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
                        <DeleteIcon onClick={() => handleDeleteImage(fileName.company_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                        <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                      </div> :
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
                        <DeleteIcon onClick={() => handleDeleteImage(fileName.company_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
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
