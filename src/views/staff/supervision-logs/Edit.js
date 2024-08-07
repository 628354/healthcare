import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Upload } from "antd";
import Select from '@mui/material/Select';
import dayjs from 'dayjs'
import Swal from 'sweetalert2';
import { IMG_BASE_URL ,COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useLocation, useNavigate } from 'react-router'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AuthContext from 'views/Login/AuthContext'

const Edit = ({setIsEditing ,selectedSuperLog,setShow}) => {
  //console.log(selectedSuperLog);

  const {companyId}=useContext(AuthContext)
  const currentDate = new Date()
  const[date, setdate] = useState (dayjs(selectedSuperLog.suprvsn_date));
  const[staff, setstaff] = useState(selectedSuperLog.suprvsn_stfid);
  const[type, settype] = useState(selectedSuperLog.suprvsn_type);
  const[notes, setnotes] = useState(selectedSuperLog.suprvsn_note);
  const[nextdueon, setnextdueon] = useState(selectedSuperLog.suprvsn_dueon? dayjs(selectedSuperLog.suprvsn_dueon): null );
  const [staffList, setStaffList] = useState([])

  const [attachment, setAttachment] = useState(selectedSuperLog.image_data)
  const[newImage,setNewImage]=useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  const minSelectableDate = dayjs(date).add(1, 'day');
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (selectedSuperLog) {
      const updateData = selectedSuperLog && selectedSuperLog.updated_at
  
      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} & ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedSuperLog.created_at
  
      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} & ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedSuperLog]);

  useEffect(() => {
    setShow(true);
    return () => setShow(false); 
  }, [setShow]);
  
  const id = selectedSuperLog.suprvsn_id;


 
const handleDeleteImage = (id,index) => {
  //console.log(index);
  //console.log(id);
  const updatedAttachment = attachment.filter((_, i) => i !== index);
  setAttachment(updatedAttachment); 
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

 
  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
      if(response.status) {  
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
    e.preventDefault();
    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!type) {
      emptyFields.push('Type');
    }
    if (!staff) {
      emptyFields.push('Staff');
      
    } if (!nextdueon) {
      emptyFields.push('Next due on');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const nextdueonDate = nextdueon ? nextdueon.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const formData = new FormData();
    formData.append('suprvsn_stfid',staff);
    formData.append('suprvsn_date',dateFormat);
    formData.append('suprvsn_type',type);
    formData.append('suprvsn_note',notes);
    formData.append('suprvsn_dueon',nextdueonDate);
    formData.append('updated_at', currentTime);

    newImage.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });


    let endpoint = 'updateStaff?table=fms_stf_supervision&field=suprvsn_id&id='+id;
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
          
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `data has been Updated.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsEditing(false);
          }else{
            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something Went Wrong.',
            showConfirmButton: true,
      });
          }
      });

    
  };

 
 
  return (

    <>
        <div className="small-container">

<Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleUpdate}
      >
        <h1>Create Supervision Log</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            value={dayjs(date)}
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setdate(newValue)
            }}
          />
        </LocalizationProvider>

        <FormControl  sx={{ width: '50ch', m: 1 }}  required>
          <InputLabel id='Staff'>Staff</InputLabel>
          <Select labelId='Staff' id='Staff' value={staff} label='Staff' onChange={e => setstaff(e.target.value)}>
            {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <TextField
          required
          label='Type'
          value={type}
          onChange={e => {
            settype(e.target.value)
          }}
        />
        <TextField
          required
          value={notes}
          label='Notes'
          onChange={e => {
            setnotes(e.target.value)
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next Due On'
            format='DD/MM/YYYY'
            value={dayjs(nextdueon)}
            minDate={dayjs(minSelectableDate)}
            onChange={newValue => {
              setnextdueon(newValue)
            }}
          />
        </LocalizationProvider>

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
            <Button variant='outlined' color='error' onClick={() => setIsEditing(false)} type='button'>
              Cancel
            </Button>
            <Button variant='outlined' type='submit'>
              Submit
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

  );
};


export default Edit;

