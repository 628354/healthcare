import React, { useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import '../../../../style/document.css'
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
import Switch from '@mui/material/Switch'
import Swal from 'sweetalert2'
import { useSelector } from 'react-redux'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

const Edit = ({ selectedDocument, setIsEditing, allowPre }) => {
  const participantdata = useSelector(state => state.participantData)
  const parData = participantdata.participantdata?.prtcpnt_firstname
  const lastName = participantdata.participantdata?.prtcpnt_lastname
  const final = `${parData}  ${lastName}`
  const minSelectableDate = new Date();

  const [participant, setParticipant] = useState(final)
  const [category, setCategory] = useState(selectedDocument.doc_ctgry)
  const [type, setType] = useState(selectedDocument.doc_type)
  const [attachment, setAttachment] = useState(selectedDocument.doc_attchmnt)
  const [note, setNote] = useState(selectedDocument.doc_notes)
  const [hasExpiryDate, setHasExpiryDate] = useState(selectedDocument.doc_exp)
  const [expiryDate, setExpiryDate] = useState(selectedDocument.doc_expdate)

  const CurrentDate =new Date();
  // //console.log(hasExpiryDate)

  const id = selectedDocument.doc_id

  const handleAddRow = () => {
    setHasExpiryDate(prevValue => !prevValue)
  }

  const attachmentText = attachment.split(', ')
  //console.log(attachmentText)
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
     

    const formData = new FormData()

    formData.append('dcmt_ctgry_id', category)
    formData.append('dcmt_type_id', type)
    formData.append('dcmt_atchmnt', attachment)
    formData.append('dcmt_note', note)
    formData.append('dcmt_expdatestatus', hasExpiryDate)
    formData.append('dcmt_expdate', expiryDate)

    /* const data = {
      stf_firstname:firstName,
      stf_lastname:lastName,
      stf_prfrdname:userName,
      stf_email:email,
      stf_pswrd:password,
      stf_dob:dob,
      stf_gender:gender,
      stf_prsnlcntctno:personalContact,
      stf_workcntctno:workContact,
      stf_address:address,
      stf_emgname:guardianName,
      stf_emgctcno:guardianNumber,
      stf_empljobtitle:jobTitle,
      stf_strtdate:startDate,
      stf_enddate:endDate,
      stf_pmrymngr:primaryManager,
      stf_acccode:accessCode,
      stf_paylvl:payLevel,
      stf_prfilstats:profileState,
      stf_role:role,
      stf_accstatus:accountStatus,
      stf_archive:archive,
      stf_status:status,
    };  */

    let url = 'https://tactytechnology.com/mycarepoint/api/'
    let endpoint = 'updateAll?table=fms_stf_document&field=dcmt_id&id=' + id
    let response = update(url, endpoint, formData)
    response.then(data => {
      // //console.log(data,"hbhjjk");
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

  

  //   const formData = new FormData();
  //   formData.append('dcmt_stfid',staffName);
  //   formData.append('dcmt_ctgry',category);
  //   formData.append('dcmt_type',type);
  //   formData.append('dcmt_atchmnt',attachment);
  //   formData.append('dcmt_note',note);
  //   formData.append('dcmt_expdatestatus',hasExpiryDate);
  //   formData.append('dcmt_expdate',expiryDate);

  //   let url = "https://tactytechnology.com/mycarepoint/api/";
  //   let endpoint = 'updateAll?table=fms_stf_document&field=stf_id&id='+ id;
  //   let response = update(url,endpoint,formData);
  //     response.then((data)=>{
  //         //console.log(data.status,"docu");
  //         //return data;
  //         if(data.status){
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Updated!',
  //             text: `${staffName} ${category}'s data has been Updated.`,
  //             showConfirmButton: false,
  //             timer: 1500,
  //           });
  //           //setIsEditing(false);
  //         }else{
  //           Swal.fire({
  //           icon: 'error',
  //           title: 'Error!',
  //           text: 'Something Went Wrong.',
  //           showConfirmButton: true,
  //     });
  //         }
  //     });

  // };

  async function update (url, endpoint, formData) {
    //console.log(data);
    // //console.log('console from function');
    const response = await fetch(url + endpoint, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      /* headers: {
                          "Content-Type": "application/json",
                          //'Content-Type': 'application/x-www-form-urlencoded',
                        }, */
      body: formData // body data type must match "Content-Type" header
    })
    // //console.log("done")
    return response.json()
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, attachment => setAttachment(attachment))
    }
  }

  const props = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text'
    },
    onChange (info) {
      if (info.file.status !== 'uploading') {
        //console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
  function beforeUpload (file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

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

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id='Participant'>Participant</InputLabel>
          <Select
            labelId='participant'
            id='Participant'
            value={participant}
            label='Participant'
            onChange={e => {
              setParticipant(e.target.value)
            }}
          >
            <MenuItem style={{ display: 'none' }} value={participant}>
              {participant}
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id='select-four-label'>Category</InputLabel>
          <Select
            value={category}
            label='Status'
            onChange={e => {
              setCategory(e.target.value)
            }}
            required
          >
            <MenuItem value='Client Plan'>Client Plan</MenuItem>
            <MenuItem value='General'>General</MenuItem>
            <MenuItem value='training'>Medical</MenuItem>
          </Select>
        </FormControl>

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id='select-four-label'>Type</InputLabel>
          <Select
            labelId='select-four-label'
            id='select-four-label'
            value={type}
            label='Status'
            onChange={e => {
              setType(e.target.value)
            }}
          >
            <MenuItem value='General'>General</MenuItem>
            <MenuItem value='training'>training</MenuItem>
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
              minDate={dayjs(CurrentDate)}
                label='Expiry Date'
                format='DD/MM/YYYY'
                defaultValue={dayjs(expiryDate)}
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
            {...props}
            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
            listType='picture-card'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            <Button size='small' >upload</Button>
          </Upload>
        {attachment && <img src={attachment} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />}

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '0px' }}>
            {attachmentText.map((fileName, index) => (
              <div key={index} style={{ marginRight: '10px' }}>
                <img src={`http://localhost:3000/${fileName}`} alt='Attachment Preview' />
              </div>
            ))}
          </div>
        </Box>

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
