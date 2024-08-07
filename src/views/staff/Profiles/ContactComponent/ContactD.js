import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Stack } from '@mui/system';
import Swal from 'sweetalert2';
import { TextField } from '@mui/material';
import { BASE_URL, COMMON_UPDATE_FUN } from 'helper/ApiInfo';
import { useNavigate } from 'react-router';
import AuthContext from 'views/Login/AuthContext';

const StaffContact = ({ selectedEmployee }) => {
  const navigate = useNavigate();
  const id = selectedEmployee.stf_id;
  const [personalContact, setPersonalContact] = useState(selectedEmployee.stf_prsnlcntctno);
  const [workContact, setWorkContact] = useState(selectedEmployee.stf_workcntctno);
  const [address, setAddress] = useState(selectedEmployee.stf_address);
  const [guardianName, setGuardianName] = useState(selectedEmployee.stf_emgname);
  const [guardianNumber, setGuardianNumber] = useState(selectedEmployee.stf_emgctcno);
  const [guardianRelation, setGuardianRelation] = useState(selectedEmployee.stf_emgrelntn);
  const [errors, setErrors] = useState({});
  const { allowUser } = useContext(AuthContext);

  const allowPre = allowUser.find((data) => {
    if (data.user === "Profiles") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read };
    }
  });

  const validateMobileNumber = (value) => {
    return /^\d{10}$/.test(value);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const newErrors = {};
    let hasErrors = false;

    if (!validateMobileNumber(personalContact)) {
      newErrors.personalContact = 'contact must be a 10-digit number';
      hasErrors = true;
    }
    if (!validateMobileNumber(workContact)) {
      newErrors.workContact = 'contact must be a 10-digit number';
      hasErrors = true;
    }
    if (!validateMobileNumber(guardianNumber)) {
      newErrors.guardianNumber = 'contact must be a 10-digit number';
      hasErrors = true;
    }
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('stf_prsnlcntctno', personalContact);
    formData.append('stf_workcntctno', workContact);
    formData.append('stf_address', address);
    formData.append('stf_emgname', guardianName);
    formData.append('stf_emgctcno', guardianNumber);
    formData.append('stf_emgrelntn', guardianRelation);

    const endpoint = `updateAll?table=fms_staff_detail&field=stf_id&id=${id}`;
    COMMON_UPDATE_FUN(BASE_URL, endpoint, formData).then((data) => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Data has been updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setTimeout(() => {
          navigate('/staff/profiles');
        }, 1700);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something went wrong.',
          showConfirmButton: true
        });
      }
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container">
      <Box sx={{ flexGrow: 1, m: 1 }} component="form" noValidate autoComplete='off' onSubmit={handleEdit}>
        <Grid container spacing={2}>
          <Grid xs={10}>
            <h3>Contact Details</h3>
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Personal Contact"
              type="number"
              value={personalContact}
              onChange={(e) => setPersonalContact(e.target.value)}
              error={!!errors.personalContact}
              helperText={errors.personalContact}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Work Contact"
              type="number"
              value={workContact}
              onChange={(e) => setWorkContact(e.target.value)}
              error={!!errors.workContact}
              helperText={errors.workContact}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <h3>Emergency Contact</h3>
            <hr />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Name"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Number"
              type="number"
              value={guardianNumber}
              onChange={(e) => setGuardianNumber(e.target.value)}
              error={!!errors.guardianNumber}
              helperText={errors.guardianNumber}
            />
          </Grid>
          <Grid xs={6}>
            <TextField
              style={{ width: '100%' }}
              label="Relation"
              value={guardianRelation}
              onChange={(e) => setGuardianRelation(e.target.value)}
            />
          </Grid>
        </Grid>

        <Box sx={{ m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={goBack} type="button">Cancel</Button>
            {allowPre?.edit ? (
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
  );
};

export default StaffContact;
