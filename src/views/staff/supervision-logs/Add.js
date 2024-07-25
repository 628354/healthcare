import React, { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Upload } from 'antd'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_NEW_ADD, GET_PARTICIPANT_LIST, IMG_BASE_URL, companyId } from 'helper/ApiInfo'

import dayjs from 'dayjs'

import Swal from 'sweetalert2'
import { Grid, Input, Typography } from '@mui/material'

const Add = ({ setIsAdding, setShow }) => {
  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [staff, setStaff] = useState('')
  const [staffList, setStaffList] = useState([])  

  const [type, setType] = useState('')
  const [notes, setNotes] = useState('')
  const [nextdueon, setNextDueOn] = useState('')
  const minSelectableDate = dayjs(date).add(1, 'day')
  const [activeIndex, setActiveIndex] = useState(0);

  const [attachment, setAttachment] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // const [cpassword, setCpassword] = useState('');

  // const [role, setRole] = useState('');

  // const [status, setStatus] = useState('');

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])

  const handleChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newFileList = Array.from(files);
      setAttachment(prevAttachment => [...prevAttachment, ...newFileList]);
      
    }
  };
  


  useEffect(() => {
    const staff = localStorage.getItem('user')
    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_id
      setStaff(finalStaff)
    }
  }, [])

  const getStaff = async () => {
    try {
      let response = await COMMON_GET_FUN(GET_PARTICIPANT_LIST.staff)
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

  const handleAdd = e => {
    e.preventDefault()

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

    //const id = employees.length + 1+1;
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const nextdueonDate = nextdueon ? nextdueon.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    
    const formData = new FormData()
    formData.append('suprvsn_stfid',staff)
    formData.append('suprvsn_date',dateFormat)
    formData.append('suprvsn_type',type)
    formData.append('suprvsn_note',notes)
    formData.append('suprvsn_dueon',nextdueonDate)
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);
    // Append files
    attachment.forEach((file, index) => {
      formData.append(`image[${index}]`, file);
    });

    let endpoint = 'insertStaffMedia?table=fms_stf_supervision'
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
     
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${type} 's data has been Added.`,
          showConfirmButton: false,
          timer: 1500
        })
        setIsAdding(false)
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



  const moveSlide = (direction) => {
    if (direction === 'left') {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : attachment.length - 1));
    } else {
      setActiveIndex((prevIndex) => (prevIndex < attachment.length - 1 ? prevIndex + 1 : 0));
    }
  };

  const openFileDialog = () => {
    const fileInput = document.getElementById('fileUpload');
    if (fileInput) {
      fileInput.click();
    } else {
      console.error("File input element not found.");
    }
  };

  
  const handleDownloadImage = (fileName) => {
    if (fileName) {
      const url = URL.createObjectURL(fileName);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Please select a file to download');
    }
  };



    const handleViewImage = (fileName) => {
      console.log(fileName);
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowModal(true);
      };
    
      if (fileName) {
        reader.readAsDataURL(fileName);  
      }
  };
    const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDeleteImage = (index) => {
    console.log(index);
    const updatedAttachment = attachment.filter((data,ind)=>{
     return ind !==index
    });
    console.log(updatedAttachment);
    setAttachment(updatedAttachment);
    setActiveIndex(0); 
  };
  console.log(attachment);
  return (
    <div className='small-container'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >
        <h1>Create Supervision Log</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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

        <TextField
          required
          label='Type'
          onChange={e => {
            setType(e.target.value)
          }}
        />
        <TextField
          required
          label='Notes'
          onChange={e => {
            setNotes(e.target.value)
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Next Due On'
            format='DD/MM/YYYY'
            minDate={dayjs(minSelectableDate)}
            onChange={newValue => {
              setNextDueOn(newValue)
            }}
          />
        </LocalizationProvider>

      

  <Grid container id="slider_parent">

    {
      attachment.length>0?
      <div className="form-group">
    <Typography variant="h6" className="font-weight-bold">
      Attachment ({activeIndex + 1}/{attachment.length})
    </Typography>
    <article className="sc-fzoYkl hfPoTr sc-AxgMl cVmQYF">
      <section className="sc-fzpkJw hctKJM  ">
        <section className="slider">
          {attachment.map((fileName,index) => {
            console.log(fileName);
console.log(index);
            return (
              <div className={`slide ${index === activeIndex ? 'active' : ''}`} key={index}>
                {fileName.name.endsWith('.csv') ||
                fileName.name.endsWith('.xlsx') ||
                fileName.name.endsWith('.docx') ? (
                  <div className="icon-container">
                     <AddIcon
                      onClick={openFileDialog}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
                    />
                    <DeleteIcon
                      onClick={() => handleDeleteImage(index)}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }}
                    />
                    <GetAppIcon
                      onClick={() => handleDownloadImage(fileName)}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
                    />
                  </div>
                ) : (
                  <div className="icon-container">
                     <AddIcon
                      onClick={openFileDialog}

                      href={`${BASE_URL}${fileName?.name}`}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
                    />
                    <DeleteIcon
                      onClick={() => handleDeleteImage(index)}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }}
                    />
                    <VisibilityIcon
                      onClick={() => handleViewImage(fileName)}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }}
                    />
                    <GetAppIcon
                      href={`${BASE_URL}${fileName?.name}`}
                      onClick={() => handleDownloadImage(fileName)}
                      style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
                    />
                  </div>
                )}

                <div className="content-container">
                  <div className="centered-content">{fileName.name}</div>
                </div>
                {attachment.length > 0 ? (
                  <>
                    <ChevronLeftIcon className="left-arrow" onClick={() => moveSlide('left')} />
                    <ChevronRightIcon className="right-arrow" onClick={() => moveSlide('right')} />
                  </>
                ) : (
                  ''
                )}
              </div>
            );
          })}
        </section>
      </section>
    </article>
    <span>
      <input
       type='file'
       title=''
       name='file'
       accept='.doc,.docx,.jpg,.png,.jpeg,application/pdf,application/vnd.ms-excel,.xlsx,.xls,.csv'
       multiple
       className='sc-fzqBkg fCkJVF sc-AxirZ bJCmFu'
       value=''
       id='fileUpload'
       onChange={handleChange}
       style={{ display: 'none' }}
      />
    </span>
  </div>:

<div className="form-group">
<label className="file-upload-label">
  Attachment ({activeIndex + 1}/{attachment?.length})

<article className={attachment.length > 0 ? "sc-AxgMl cVmQYF" : "sc-AxgMl cVmQYF"}>
  <section className={attachment.length > 0 ? "sc-AxheI eXzlnr" : "sc-AxheI eXzlnr"}>
  <section className="slider">
      {attachment.length > 0 ? (
        <>  
          {attachment?.map((fileName, index) => {
            console.log(fileName);
            return (
              <div className={`slide ${index === activeIndex ? 'active' : ''}`} key={index}>
                {/* Your slide content */}
              </div>
            );
          })}
        </>
      ) : (
        <span>Click here or <br />drag &amp; drop a file in this area</span>
      )}
    </section>
  
      <input
       type='file'
       id='fileUpload'
       name='file'
       multiple
       onChange={handleChange}
       className='file-upload-input'
       style={{ display: 'none' }}
       value={attachment}
      />
    
  </section>
</article>

</label>
</div>
    }
 
 {showModal && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
                <img
                  src={selectedImage}
                  alt="Attachment Preview"
                  style={{ width: '100%', height: 'auto', maxHeight: '80vh' }}
                />

<iframe
  src={selectedImage}
  width='100%'
  height='500px'
  title='PDF Preview'
  seamless

/>

                <button onClick={handleCloseModal} style={{ marginTop: '10px' }}>
                  Close
                </button>
              </div>
            </div>
          )}

</Grid>

        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction='row-reverse' spacing={2}>
            <Button variant='outlined' color='error' onClick={() => setIsAdding(false)} type='button'>
              Cancel
            </Button>
            <Button variant='outlined' type='submit'>
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  )
}

export default Add

