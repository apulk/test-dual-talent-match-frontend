import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import axios from 'axios'
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom'
import LOGIN from '../../mutations/loginMutation';
import { useMutation } from '@apollo/client';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  pos: {
    marginBottom: theme.spacing(3)
}
}));

const Login = (props) => {
  const classes = useStyles();
  const [ login, {loading, data } ] = useMutation(LOGIN);

  const [err, setErr] = useState('')
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string()
        .min(6, 'Must be minimum 6 characters')
        .required('Required'),
    }),
    onSubmit: values => {
      setErr('')
      login({ variables: { email: values.email, pass: values.password } }).then(async result=>{
        if(result) {

            const { data: { login } } = result
            const {  email, id, name, student_id, type } = login
            localStorage.setItem('type',type)
            localStorage.setItem('student_id',student_id)
            localStorage.setItem('token',id)
            props.history.push('/')
        }
      })
      .catch(err=>
        setErr('Email/Password does not match')
      )
    },
  });
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          {/* <LockOutlinedIcon /> */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>

        <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
          <TextField
            error={formik.touched.email && formik.errors.email}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            helperText={formik.touched.email && formik.errors.email ? formik.errors.email : null}
          />
          <TextField
            error={formik.touched.password && formik.errors.password}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            helperText={formik.touched.password && formik.errors.password ? formik.errors.password : null}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container fullWidth className={classes.pos}>
            <Grid>
              <div className="error" style={{color:'red'}}>{err}</div>
            </Grid>
          </Grid>
           
        </form>
      </div>
      <Box mt={8}>
        {/* <Copyright /> */}
      </Box>
    </Container>
  );
}

export default withRouter(Login)