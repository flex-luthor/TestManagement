import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {
  red,
  blue,
  yellow,
  green,
  lightBlue,
  lightGreen
} from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Zoom from "@material-ui/core/Zoom";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import TimerIcon from "@material-ui/icons/Timer";

import image from "assets/img/placeholder.jpg";
import english from "assets/img/english.jpg";
import image2 from "assets/img/placeholder-image.png";
import { Button } from "@material-ui/core";
import axios from "axios";


export default function PrCard(props) {
  const items = [
    red[500],
    green[500],
    blue[500],
    lightBlue[500],
    lightGreen[500]
  ];
  var randomColor = items[(props.id - 1) % 5];

  const [checked, setChecked] = React.useState(true);

  const useStyles = makeStyles(theme => ({
    root: {
      width: 300,
      margin: 15
    },
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    media: {
      height: 0,
      paddingTop: "56.25%" // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    },
    avatar: {
      backgroundColor: randomColor
    },
    price: {
      fontWeight: 500
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 4, 3)
    }
  }));

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const deleteCard = () => {
    props.delete();
    setChecked(false);
    handleClose();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTest = () => {
    axios
    .delete("http://localhost:5000/tests/" + props.id)
    .catch(function(error) {
      console.log(error);
    });
  };

  const link = "/admin/tests/" + props.id;

  return (
    <div>
      <Zoom in={checked} unmountOnExit={true} timeout={300}>
        <Card className={classes.root}>
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {props.subject.slice(0, 1).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={props.title}
            subheader={props.subject.toUpperCase()}
          />
          <CardMedia
            className={classes.media}
            image={props.subject === "maths" ? image : props.subject === "english" ? english : image2}
          />
          <CardContent>
            <h4 className={classes.price}>
              <TimerIcon /> {props.duration} mins
            </h4>
            <div>
              <Typography
                variant="body2"
                component="span"
                className={classes.price}
              >
                Total Marks:
              </Typography>
              <Typography
                variant="body2"
                component="span"
                color="textSecondary"
                className={classes.price}
              >
                {props.marks}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body2"
                component="span"
                className={classes.price}
              >
                No. of questions:
              </Typography>
              <Typography
                variant="body2"
                component="span"
                color="textSecondary"
                className={classes.price}
              >
                {" "}
                {props.questions.length}
              </Typography>
            </div>
            <Typography variant="body2" color="textSecondary" component="p" style={{margin: '20px 0'}}>
              {props.description}
            </Typography>
            {props.admin ? (<Button color="danger" variant="contained" fullWidth onClick={deleteTest}>
              DELETE
            </Button>) : (<Button color="primary" variant="contained" fullWidth href={link}>
              ATTEMPT TEST
            </Button>) }
          </CardContent>
          <CardActions disableSpacing>
          </CardActions>
        </Card>
      </Zoom>
      </div>
  );
}
