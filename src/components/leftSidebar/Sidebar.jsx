import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
 
import DashboardIcon from '@material-ui/icons/Dashboard';
import DeleteIcon from '@material-ui/icons/Delete';
 
import { Link, NavLink, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    paper: {
     backgroundColor: 'gainsboro'
   }
}));


const Sidebar = (props) =>  {
  const classes = useStyles();
  const { location:{ pathname } } = props
  return (
    <div>
    <NavLink to="/"  >
      <ListItem button className={`${pathname === "/" ? classes.paper : ''}`} >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </NavLink>
  </div>
);


}
  
export default withRouter(Sidebar)