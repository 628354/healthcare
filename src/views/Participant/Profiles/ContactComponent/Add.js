import React, { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import AuthContext from 'views/Login/AuthContext';
import { BASE_URL, COMMON_NEW_ADD } from 'helper/ApiInfo';
import dayjs from 'dayjs';

const Add = ({setIsAdding,participantId}) => {
  const [type, setType] = useState('');
  const [contactName, setContactName] = useState('');
  const [address, setAddress] = useState('');
  const [contactUserEmail, setContactUserEmail] = useState('');
  const [contactUserPhone, setSontactUserPhone] = useState('');
  const {allowUser,}=useContext(AuthContext)
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const allowPre= allowUser.find((data)=>{
    // //console.log(data);
     if(data.user === "Profiles"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
      const handleAdd = e => {
        // alert('working from two'); 
        e.preventDefault();
    
        if ( !type ||!contactName) {
          return Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'All fields are required.',
            showConfirmButton: true,
          });
        } 
    
      const data={
        ctc_type:type,
        ctc_name:contactName,
        ctc_address:address,
        ctc_email: contactUserEmail,
        ctc_phone:contactUserPhone,
        ctc_prtcpntid:participantId,
        updated_at:currentTime




      }
       //console.log(data);
        let endpoint = `insertData?table=fms_prtcpnt_contactdetails`;
        let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
          response.then((data)=>{
              // //console.log(data.status);
              //return data;
              if(data.status){
                Swal.fire({
                  icon: 'success',
                  title: 'Added!',
                  text: `Data has been Added.`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                setIsAdding(false);
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
    <div className="small-container">
    <Box sx={{ flexGrow: 1, m: 1 }} component="form" onSubmit={handleAdd}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <h3>Contact Details</h3>
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            required
            label="Type"
            type="text"
            onChange={(e) => { setType(e.target.value) }}
          
          />
        </Grid>
       
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            required
            label="Name"
            type="text"
            onChange={(e) => {setContactName(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
           
            label="Address"
            onChange={(e) => {setAddress(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            
            label="Email"
            type='email'
            onChange={(e) => {setContactUserEmail(e.target.value) }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            style={{ width: '100%' }}
            label="Number"
            type="number"
            onChange={(e) => { setSontactUserPhone(e.target.value) }}
          />
           
        </Grid>
        
      </Grid>

      
      <Box sx={{ width: '100ch', m: 1 }}>
        <Stack direction="row-reverse" spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
          <Button variant="outlined" type="submit">Submit</Button>
        </Stack>
      </Box>
    </Box>
  </div>
      );
};


export default Add;























// import React, { useState } from 'react';
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { Upload, message } from "antd";
// import Swal from 'sweetalert2';

// const Add = ({ setIsAdding }) => {
//   const [date, setDate] = useState('');
//   const [staff, setStaff] = useState('');
//   const [type, setType] = useState('');
//   const [notes, setNotes] = useState('');
//   const [nextdueon, setNextDueOn] = useState('');
//   const [attachment, setAttachment] = useState('');

//   const beforeUpload = (file) => {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//       message.error('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       message.error('Image must be smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
//   };

//   const handleChange = info => {
//     if (info.file.status === 'done') {
//       getBase64(info.file.originFileObj, attachment =>
//         setAttachment(attachment)
//       );
//     }
//   };

//   const props = {
//     name: 'file',
//     action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
//     headers: {
//       authorization: 'authorization-text',
//     },
//     onChange: handleChange
//   };

//   const handleAdd = e => {
//     e.preventDefault();

//     if (!date || !staff || !type || !notes || !nextdueon) {
//       return Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'All fields are required.',
//         showConfirmButton: true,
//       });
//     }

//     const body = {
//       suprvsn_stfid: staff,
//       suprvsn_date: date,
//       suprvsn_type: type,
//       suprvsn_note: notes,
//       suprvsn_dueon: nextdueon,
//       auprvsn_attachmnt: attachment,
//     };
//     //console.log(body,"ftuyguik")
//     let url="https://tactytechnology.com/mycarepoint/api/";
//     let endpoint = 'insertData?table=fms_stf_supervision';
//     let response = add(url,endpoint,body);
//       response.then((data)=>{
//           //console.log(data.status);
//           //console.log("check",data)
//           //return data;
//           if(data.status){
//             Swal.fire({
//               icon: 'success',
//               title: 'Added!',
//               text: `${firstName} ${lastName}'s data has been Added.`,
//               showConfirmButton: false,
//               timer: 1500,
//             });
//             setIsAdding(false);
//           }else{
//             Swal.fire({
//             icon: 'error',
//             title: 'Error!',
//             text: 'Something Went Wrong.',
//             showConfirmButton: true,
//       });
//           }
//       });
    
//   };

//   const add = async (url, endpoint, data) => {
//     const response = await fetch(url + endpoint, {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     return response.json();
//   };

//   return (
//     <div className="small-container">
//       <Box
//         component="form"
//         sx={{
//           '& .MuiTextField-root': { m: 1, width: '50ch' },
//         }}
//         noValidate
//         autoComplete="off"
//         onSubmit={handleAdd}
//       >
//         <h1>Create Supervision Log</h1>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker label="Date" onChange={(newValue) => { setDate(newValue) }} />
//         </LocalizationProvider>

//         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
//           <InputLabel id="select-one-label">Staff</InputLabel>
//           <Select
//             labelId="select-one-label"
//             id="select-one-label"
//             value={staff}
//             label="Staff"
//             onChange={(e) => { setStaff(e.target.value) }}
//           >
//             <MenuItem value={1}>Staff 1</MenuItem>
//             <MenuItem value={2}>Staff 2</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
//           <InputLabel id="select-type-label">Type</InputLabel>
//           <Select
//             labelId="select-type-label"
//             id="select-type-label"
//             value={type}
//             label="Type"
//             onChange={(e) => { setType(e.target.value) }}
//           >
//             <MenuItem value={1}>Active</MenuItem>
//             <MenuItem value={2}>Inactive</MenuItem>
//           </Select>
//         </FormControl>

//         <TextField
//           required
//           label="Notes"
//           onChange={(e) => { setNotes(e.target.value) }}
//         />

//         <Upload {...props} listType="picture-card" beforeUpload={beforeUpload}>
//           <Button size='small'>Click here or Drag and drop a file in this area</Button>
//         </Upload>

//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker label="Next Due On" onChange={(newValue) => { setNextDueOn(newValue) }} />
//         </LocalizationProvider>

//         <Box sx={{ width: '100ch', m: 1 }}>
//           <Stack direction="row-reverse" spacing={2}>
//             <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
//             <Button variant="outlined" type="submit">Submit</Button>
//           </Stack>
//         </Box>
//       </Box>
//     </div>
//   );
// };

// export default Add;
