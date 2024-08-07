import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { IMG_BASE_URL, COMMON_GET_PAR, GET_PARTICIPANT_LIST, COMMON_UPDATE_FUN, BASE_URL, COMMON_GET_FUN } from '../../../helper/ApiInfo'
//select field
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Card, CardContent, FormHelperText, Typography } from '@mui/material'
import Swal from 'sweetalert2'
import { Upload } from 'antd'
import { useLocation, useNavigate } from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AuthContext from 'views/Login/AuthContext';

const Edit = () => {

  const {companyId}=useContext(AuthContext)
  const navigate = useNavigate();
  const locationD = useLocation()
  const { allowPre, selectedData } = locationD.state
  // //console.log(selectedData);
  const id = selectedData.cmpny_id

  const [date, setDate] = useState(selectedData.cmpny_date ? dayjs(selectedData.cmpny_date) : dayjs())
  const [staff, setStaff] = useState(selectedData.cmpny_stfid)
  const [asset, setAsset] = useState(selectedData.cmpny_asetname)
  const [location, setLocation] = useState(selectedData.cmpny_location)
  const [staffList, setStaffList] = useState([])
  const [description, setDescription] = useState(selectedData.cmpny_dscrptn)
  const [attachment, setAttachment] = useState(selectedData.image_data)
  const [newImage, setNewImage] = useState([])

  const [selectedImage, setSelectedImage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const [updateDate, setUpdateDate] = useState(null)
  const [createDate, setCreateDate] = useState(null)
  const [startIndex, setStartIndex] = useState(0);
  const [errors ,setErrors]=useState()

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


  const handleDeleteImage = (id, index) => {
    //console.log(index);
    //console.log(id);
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
        //console.log(response);
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



   const moveLeft = (e) => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 4);
    }
  };

  const moveRight = (e) => {

    if (startIndex + 4 < attachment.length) {
      setStartIndex(prev => prev + 4);
    }
  };

  const goBack = () => {
    navigate(-1)
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
    //console.log(files);
    const fileList = [];
    for (let i = 0; i < files.length; i++) {
      fileList.push(files[i].originFileObj);
    }
    setNewImage(fileList);
  };


  // const [staffId, setStaffId] = useState(null);



  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
      if (response.status) {
        setStaffList(response.messages)

      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {
    getStaff()
  }, [])


  const handleUpdate = e => {
    e.preventDefault()
    let hasError = false;
    const newErrors = {};
    if (!date) {
      newErrors.date = 'Date is required';
      hasError = true;
    }
    if (!staff) {
      newErrors.staff = 'Staff is required';
      hasError = true;
    }
   
    if (!asset) {
      newErrors.asset = 'Assets is required';
      hasError = true;
    }
   
    if (!location) {
      newErrors.location = 'Location is required';
      hasError = true;
    }
    setErrors(newErrors);

    if (hasError) {
      return;
    }
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData()

    formData.append('cmpny_date', dateFormat)
    formData.append('cmpny_stfid', staff)
    formData.append('cmpny_asetname', asset)
    formData.append('cmpny_location', location)
    formData.append('cmpny_dscrptn', description)
    formData.append('updated_at', currentTime);

    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });
    let endpoint = 'updateAssets?table=fms_cmpnyasets&field=cmpny_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      // //console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setTimeout(() => {

          navigate('/assets/company-assets')

        }, 1700)
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
          <h1>Edit Company Assets</h1>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Date'
              format='DD/MM/YYYY'
              value={dayjs(date)}
              // minDate={dayjs(currentDate)}
              onChange={newValue => {
                setDate(newValue)
                if (newValue) {
                  setErrors((prevErrors) => ({ ...prevErrors, date: '' }));
                }
              }}
              slotProps={{
                textField: {
                  helperText: errors?.date,
                 
                },
              }}
            />
          </LocalizationProvider>

          <FormControl id="selecet_tag_w" className="desk_sel_w" sx={{ m: 1 }} required>
            <InputLabel id='Staff'>Staff</InputLabel>
            <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={(e) => {
            setStaff(e.target.value);
            if (e.target.value) {
              setErrors((prevErrors) => ({ ...prevErrors, staff: '' }));
            }
          }} error={!!errors?.staff}
                    helperText={errors?.staff}>
              {staffList?.map(item => {
                return (
                  <MenuItem key={item?.stf_id} value={item?.stf_id}>
                    {item?.stf_firstname} {item?.stf_lastname}
                  </MenuItem>
                )
              })}
            </Select>
            <FormHelperText>{errors?.staff}</FormHelperText>
          </FormControl>

          <TextField
            required
            value={asset}
            label='Assets'
            type='text'
            onChange={(e)=>{setAsset(e.target.value);if (e.target.value){
              setErrors((prevErrors) => ({ ...prevErrors, asset: '' }));
            }
          }}
  
            helperText={errors? errors?.asset: ""}
            error={!!errors?.asset}
          />
          <TextField
            value={location}
            multiline
            label='Location'
            type='text'
            onChange={(e)=>{setLocation(e.target.value);if (e.target.value) {
              setErrors((prevErrors) => ({ ...prevErrors, location: '' }));
            } }}
            helperText={errors? errors?.location: ""}
            error={!!errors?.location}
          /> 
          <TextField
            value={description}
            multiline
            label='Description'
            rows={4}
            type='text'
            onChange={e => {
              setDescription(e.target.value)
            }}
          />
          <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple onChange={handleChange} listType="picture-card" >
            <Button size='small'>Click here or Drag and drop a file in this area</Button>
          </Upload>

          {attachment.length > 0 ? 
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
             {attachment.length > 4 ? <ArrowBackIosIcon className="slider_btns" onClick={moveLeft} type='button' disabled={startIndex === 0} />:""}
            
            <div className={attachment.length>4?"multi_view_slider1":"multi_view_slider2"}>
              {Array.isArray(attachment) && attachment.slice(startIndex, startIndex + 4).map((fileName, index) => {
                //console.log(fileName);
                const nameOfFile = fileName?.image?.replace(/\d+/g, '');

                return (
                  <div className='cus_child_div' key={index} style={{ width: '200px', position: 'relative' }}>
                    {fileName.image.endsWith('.csv') || fileName.image.endsWith('.pdf') || fileName.image.endsWith('.xlsx') || fileName.image.endsWith('.docx') ? (

                      <div className='ddf' onClick={() => handleClickImage(index)}  >

                        <p style={{ alignContent: 'center', width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer', textAlign: "center" }} className="Cus_file_Txt">

                          <SummarizeIcon sx={{ fontSize: '30px' }} /><br />
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
                            <DeleteIcon onClick={() => handleDeleteImage(fileName.asset_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                            <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                          </div> :
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
                            <DeleteIcon onClick={() => handleDeleteImage(fileName.asset_id, index)} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
                            <VisibilityIcon onClick={() => handleViewImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
                            <GetAppIcon onClick={() => handleDownloadImage(fileName)} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
                          </div>

                        }

                      </>


                    )}
                  </div>

                )
              })}
            </div>
            {attachment.length > 4 ?   <ArrowForwardIosIcon className="slider_btns" onClick={moveRight} type='button' disabled={startIndex + 4 >= attachment.length} />:""}

          
          </div> : ""}

          {showModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
                <img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
                <button type='button' onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
              </div>
            </div>
          )}


          <Box sx={{ width: '100ch', m: 1 }}>
            <Stack direction='row-reverse' spacing={2}>
              <Button variant='outlined' color='error' onClick={goBack} type='button'>
                Cancel
              </Button>
              {allowPre.edit ? (
                <Button variant='outlined' type='submit'>
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


  )
}

export default Edit
