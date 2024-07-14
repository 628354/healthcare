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
import { IMG_BASE_URL, COMMON_GET_PAR, GET_PARTICIPANT_LIST, COMMON_UPDATE_FUN, BASE_URL, COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'

const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
  const currentDate = new Date();

  const id = selectedData.whs_id;

  const [date, setDate] = useState(selectedData.whs_date ? dayjs(selectedData.whs_date) : dayjs())
  const [category, setCategory] = useState(selectedData.whs_ctgry);
  const [location, setLocation] = useState(selectedData.whs_location);
  const [nextReviewDate, setNextReviewDate] = useState(selectedData.whs_rvudate === "0000-00-00" ? '' : (selectedData.whs_rvudate ? dayjs(selectedData.whs_rvudate) : dayjs()))
  const [comments, setComments] = useState(selectedData.whs_comnt);
  const [categoryList, setCategoryList] = useState([]);






  const [attachment, setAttachment] = useState(selectedData.image_data);

  const [newImage, setNewImage] = useState([])
  const minSelectableDate = dayjs(date).add(1, 'day');


  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateDate, setUpdateDate] = useState(null)
  const [createDate, setCreateDate] = useState(null)

  useEffect(() => {
    if (selectedData) {
      const updateData = selectedData && selectedData.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedData.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
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
      fileList.push(files[i].originFileObj);
    }
    setNewImage(fileList);
  };
  const handleDeleteImage = (id, index) => {
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

        let endpoint = 'deleteSelected?table=fms_compliance_media&field=compliance_id&id=' + id
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


  const getCategory = async () => {
    try {
      let endpoint = 'getAll?table=whs_log_ctgry&select=whs_log_id,whs_log_name'

      let response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const res = await response.json()
        setCategoryList(res.messages)
        console.log(res)
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }


  useEffect(() => {

    getCategory();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!category) {
      emptyFields.push('Category');
    }
    if (!location) {
      emptyFields.push('Location');
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
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const newdateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null

    const formData = new FormData();

    formData.append('whs_date', dateFormat);
    formData.append('whs_ctgry', category);
    formData.append('whs_location', location);
    formData.append('whs_rvudate', newdateFormat);
    formData.append('whs_comnt', comments);
    formData.append('updated_at', currentTime);


    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });



    let endpoint = 'updateCompliance?table=fms_whs_logs&field=whs_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {

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
        <h1>Edit WHS Log</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            value={dayjs(date)}
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='category'>Category</InputLabel>
          <Select labelId='category' id='category' value={category} label='category' onChange={e => setCategory(e.target.value)}>
            {categoryList?.map(item => {
              return (
                <MenuItem key={item?.whs_log_id} value={item?.whs_log_id}>
                  {item?.whs_log_name}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <TextField
          required
          value={location}
          label="Location"
          type="text"
          onChange={(e) => { setLocation(e.target.value) }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next review date'
            format='DD/MM/YYYY'
            value={dayjs(nextReviewDate)}
            minDate={dayjs(minSelectableDate)}
            onChange={newValue => {
              setNextReviewDate(newValue)
            }}
          />
        </LocalizationProvider>

        <TextField
          value={comments}
          multiline
          rows={4}
          label="Comments"
          type="text"
          onChange={(e) => { setComments(e.target.value) }}
        />

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
                        <DeleteIcon onClick={() => handleDeleteImage(fileName.compliance_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                        <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                      </div> :
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
                        <DeleteIcon onClick={() => handleDeleteImage(fileName.compliance_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
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
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>

  );
};

export default Edit;
