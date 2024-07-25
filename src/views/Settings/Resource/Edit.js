import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Upload } from 'antd';
import Chip from '@mui/material/Chip';
import {BASE_URL, COMMON_UPDATE_FUN, IMG_BASE_URL} from '../../../helper/ApiInfo'
import CancelIcon from '@mui/icons-material/Cancel';

import '../../../style/document.css'
import TextField from '@mui/material/TextField'
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { Card, CardContent, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GetAppIcon from '@mui/icons-material/GetApp';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
// import { Upload } from 'antd'
import '../../../style/document.css'

import Swal from 'sweetalert2'
// import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

const Edit = ({ selectData, setIsEditing, allowPre }) => {
  console.log(selectData);
  const id = selectData.resource_id;
  const [date, setDate] = useState(selectData.resource_date? dayjs(selectData.resource_date): null);
  const [staff, setStaff] = useState(selectData.resource_staff_id)
  const [staffList, setStaffList] = useState([])

  const [collectionTypes, setCollectionTypes] = useState(selectData.resource_clltntype.split(','));
  const [collectionTypesL, setCollectionTypesL] = useState([]);
  const [title, setTitle] = useState(selectData.resource_title);
  const [type, setType] = useState(selectData.resource_type);
  const [text, setText] = useState(selectData.resource_text);
  const [link, setLink] = useState(selectData.resource_link);

  const [collectionTypesOpen, setCollectionTypesOpen] = useState(false);
  const [attachment, setAttachment] = useState(selectData.photo);


  // const [showAttachment,setShowAttechment]=useState(false)
  const[newImage,setNewImage]=useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
const[updateDate ,setUpdateDate]=useState(null)
const[createDate ,setCreateDate]=useState(null)
const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

useEffect(() => {
  if (selectData) {
    const updateData = selectData && selectData.updated_at

    if (updateData) {
      const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
      const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
      const formattedDate = `${day}-${month}-${year}`;
      const formattedTime = updateTime.substr(0, 5);
      const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
      setUpdateDate(final)
    }
    const createData = selectData.created_at

    if (createData) {
      const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
      const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
      const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
      const formattedCreateTime = createTime.substr(0, 5);
      const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
      setCreateDate(final)
    }
  }
}, [selectData]);
  const handleClose = () => {
    setCollectionTypesOpen(false); 

  };
  const handleClickImage = (attachment) => {
    setSelectedImage(attachment);
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
  //get all routes

  const fetchData = async () => {
    try {
      const url = `${BASE_URL}getAll?table=all_routes&select=routes_id,routes_name`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.status) {
        setCollectionTypesL(data.messages)


      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  
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
    }
  }

  const handleChange = info => {
    const fileList = [...info.fileList];
    console.log(fileList);
    if (fileList.length > 1) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'You can only upload one file.',
        showConfirmButton: true,
      });
    } else {
      setAttachment(fileList[0]?.originFileObj || null);
  
    }
  };
  


  useEffect(() => {
    getStaff();
    fetchData();

  }, [])



  const handleUpdate = e => {
    e.preventDefault();
    const emptyFields = [];

    if (!date) {
      emptyFields.push('Date');
    }
     if(!staff) {
      emptyFields.push('Staff');
    }
    if(collectionTypes.length<1) {
      emptyFields.push('Collection Type');
    }
     if(!title) {
      emptyFields.push('Title');
    }
    if(!type) {
      emptyFields.push('Type');
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
    const formData = new FormData();
    formData.append('resource_staff_id', staff);
    formData.append('resource_date', dateFormat);
    formData.append('resource_clltntype', collectionTypes);
    formData.append('resource_type', type);
    formData.append('resource_title', title);
    formData.append('resource_text', text);
    formData.append('resource_link', link);
    formData.append('updated_at', currentTime);
    formData.append('photo',attachment);

    let endpoint = 'updateAll?table=fms_setting_resource&field=resource_id&id=' + id

    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      console.log(data);
      console.log("check", data)
      //return data;
      console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true,
        });
      }
    });

  };


 


const handleDeleteImage = (id,index) => {
  console.log(index);
  console.log(id);
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
      
      let endpoint = 'deleteSelected?table=fms_reporting_media&field=report_id&id=' + id
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

const handleDelete = (value) => {
  // console.log(value);
  const updatedCollectionTypes = collectionTypes.filter((item) => item !== value);
  console.log("yes delete");
  setCollectionTypes(updatedCollectionTypes);
};


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
  <h1>Edit Resource</h1>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker label="Date" value={date} format='DD/MM/YYYY' onChange={(newValue) => { setDate(newValue) }} />
  </LocalizationProvider>


  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
    <InputLabel id='staff'>Staff</InputLabel>
    <Select
      labelId='staff'
      id='staff'
      value={staff}
      label='Staff'
      onChange={e => setStaff(e.target.value)}
    >
      <MenuItem style={{ display: 'none' }} value={staff}>{staff}</MenuItem>
    </Select>
  </FormControl>



  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
    <InputLabel id='CollectionTypes '>Collection Types </InputLabel>
    <Select
      labelId='CollectionTypes'
      id='CollectionTypes'
      value={collectionTypes}
      label='CollectionTypes'
      open={collectionTypesOpen}
      onOpen={() => setCollectionTypesOpen(true)}
      onClose={() => setCollectionTypesOpen(false)}
      multiple
      onChange={(e) => {
        setCollectionTypes(e.target.value);
        handleClose();
      }}
      renderValue={(selected) => {
        console.log(selected);
        return(
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected?.map((value) => {
            const selectedPractitioner = collectionTypesL.find(item => item?.routes_name === value);
            console.log(selected);
            console.log(value);

            return (
              <Chip
                key={value}
                label={selectedPractitioner?.routes_name}
                deleteIcon={
                  <CancelIcon
                    onMouseDown={(event) => event.stopPropagation()}
                  />
                }
                onDelete={(e) => handleDelete(value)}
                sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
              />

            )
          })}
        </div>
      )}}
    >
      {
        collectionTypesL?.map((item) => {

          return (
            <MenuItem key={item?.routes_id} value={item?.routes_name}>{item?.routes_name}</MenuItem>

          )

        })
      }
    </Select>
  </FormControl>







  <TextField
    required
    label='Titile'
    value={title}
    onChange={e => {
      setTitle(e.target.value)
    }}
  />

  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
    <InputLabel id='Type  '>Type </InputLabel>
    <Select
      labelId='Type '
      id='Type '
      value={type}
      label='Type '
      onChange={e => setType(e.target.value)}
    >

      <MenuItem value='Text'>Text</MenuItem>
      <MenuItem value='Link'>Link</MenuItem>
      <MenuItem value='Attechment'>Attechment</MenuItem>

    </Select>
  </FormControl>


  {
    type === 'Text' ? <TextField
      required
      label='Text'
      value={text}
      onChange={e => {
        setText(e.target.value)
      }}
    /> : (type === "Link" ? <TextField
      required
      label='Link'
      value={link}
      onChange={e => {
        setLink(e.target.value)
      }}
    /> : (type === "Attechment" ? <>  <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} type="file" multiple listType="picture-card" onChange={handleChange} >
      <Button size='small'>Click here or Drag and drop a file in this area</Button>
    </Upload>

    <div className='cus_parent_div' style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
{
attachment && typeof attachment === 'string' ?
<div className='cus_child_div' style={{ width: '180px', position: 'relative' }}>
{attachment.endsWith('.csv') || attachment.endsWith('.pdf')  || attachment.endsWith('.xlsx') || attachment.endsWith('.docx') ? (

<div className='ddf'>
<p style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer', textAlign: "center" }} className="Cus_file_Txt">
  {attachment}
</p>
</div>
) : (

<img
src={`${IMG_BASE_URL}${attachment}`}
alt='Attachment Preview'
style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
// onClick={() => handleClickImage()}
/>
)}
{
<div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
<DeleteIcon onClick={handleDeleteImage} style={{ cursor: 'pointer', fontSize: '20px', color: 'red', marginRight: '5px' }} />
<VisibilityIcon onClick={handleViewImage} style={{ cursor: 'pointer', fontSize: '20px', color: 'white', marginRight: '5px' }} />
<GetAppIcon onClick={handleDownloadImage} style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} />
</div>
}
</div> :""

}

{showModal && (
<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
<div style={{ backgroundColor: '#fff', padding: '20px', maxWidth: '90%' }}>
<img src={`${IMG_BASE_URL}${attachment[selectedImage]?.image}`} alt='Attachment Preview' style={{ width: '100%', height: 'auto', maxHeight: '80vh' }} />
<button onClick={handleCloseModal} style={{ marginTop: '10px' }}>Close</button>
</div>
</div>
)}

</div>
    </> : ""))
  }

  <Box sx={{ width: '100ch', m: 1 }}>
    <Stack direction="row-reverse"
      spacing={2}>
      <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
      {

        allowPre?.edit ? <Button variant="outlined" type="submit" >Update</Button> : ""
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
