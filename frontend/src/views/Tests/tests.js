import React, { useState, Children, useEffect } from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  Redirect
} from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import PrCard from "./prcards.js";

import { GridList } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { whiteColor } from "assets/jss/material-dashboard-react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import Checkbox from "@material-ui/core/Checkbox";
import firebase from "@firebase/app";
import "@firebase/storage";
import axios from "axios";

import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";

import Upload from "./upload.js";
import Card from "components/Card/Card.js";
import { useCookies } from "react-cookie";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  label: {
    color: "#aaa",
    textAlign: "center",
    paddingTop: "160px",
    height: "200px",
    border: "3px dashed #ccc",
    borderRadius: "20px"
  },
  fab: {
    zIndex: "3",
    position: "fixed",
    right: "50px",
    bottom: "50px"
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    backgroundColor: whiteColor,
    padding: 20,
    width: "50%",
    minWidth: "300px",
    maxHeight: "90%",
    borderRadius: "10px"
  },
  prform: {
    margin: "20px 0"
  },
  formelement: {
    marginBottom: "15px"
  },
  formprice: {
    width: "49%",
    marginBottom: "15px"
  },
  formselect: {
    width: "48%",
    marginBottom: "15px",
    marginRight: "2%"
  },
  imagebox: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "20px"
  },
  nested: {
    paddingLeft: "20px"
  },
  list: {
    margin: "20px 0",
    backgroundColor: "#eee"
  }
};

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  return (
    <div>
      <Switch>
        <Redirect exact from="/admin/tests" to="/admin/tests/home" />

        <Route path="/admin/tests/:id">
          {cookies.user === "student" ? <ChildStudent /> : <ChildAdmin />}
        </Route>
      </Switch>
    </div>
  );
}

function ChildStudent() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const classes = useStyles();
  const [pr, changePr] = React.useState([]);
  const [activeTest, changeActiveTest] = React.useState();

  const getPr = () => {
    axios
      .get("http://localhost:5000/tests")
      .then(function(response) {
        changePr(response.data);
        // activeTest = response.data.find(x => x.id === id);
        changeActiveTest(response.data.find(x => x.id == id));
        // console.log(response.data);
        return activeTest;
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getPr();
  });

  const [value, setValue] = React.useState([]);

  const handleChange = event => {
    let newValue = [...value];
    newValue[event.target.name] = event.target.value;
    setValue(newValue);
    console.log(value);
  };

  const handleSubmit = () => {
    let marks = 0;
    for (let index = 0; index < activeTest.questions.length; index++) {
      if (activeTest.questions[index].correctoption == value[index]) {
        marks += activeTest.questions[index].marks;
      }
    }
    // changePr({...pr, taken: true, marksObtained: marks });
    alert(
      "Test Submitted Successfully. Marks Obtained : " +
        marks +
        "/" +
        activeTest.marks
    );
    return <Redirect to="/admin/tests/home" />;
  };

  // console.log(activeTest);
  if (id === "home") {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridList>
            {pr.map(el => {
              return (
                // eslint-disable-next-line react/jsx-key
                <PrCard
                  id={el.id}
                  title={el.title}
                  description={el.description}
                  duration={el.duration}
                  marks={el.marks}
                  marksObtained={el.marksObtained}
                  taken={el.taken}
                  subject={el.subject}
                  questions={el.questions}
                />
              );
            })}
          </GridList>
        </GridItem>
      </GridContainer>
    );
  } else if (activeTest === undefined) return null;
  else
    return (
      <div>
        <h3>{activeTest.title}</h3>
        <div>
          {activeTest.questions.map(el => {
            return (
              // eslint-disable-next-line react/jsx-key
              <Card
                style={{ padding: "0 20px", margin: "50px 0", width: "95%" }}
              >
                <h5>Question No. {activeTest.questions.indexOf(el) + 1}</h5>
                <p style={{ fontWeight: "600" }}>{el.ques} :</p>
                {el.image !== null ? (
                  <img style={{ maxWidth: "400px" }} src={el.image} />
                ) : null}
                <FormControl component="fieldset">
                  <FormLabel>Options :</FormLabel>
                  <RadioGroup
                    aria-label="options"
                    name={activeTest.questions.indexOf(el)}
                    value={parseInt(
                      value[activeTest.questions.indexOf(el)],
                      10
                    )}
                    onChange={handleChange}
                  >
                    {el.options.map(opt => {
                      return (
                        <FormControlLabel
                          value={el.options.indexOf(opt) + 1}
                          control={<Radio />}
                          label={opt}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              </Card>
            );
          })}
        </div>
        <Button color="primary" variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    );
}

function ChildAdmin() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const classes = useStyles();
  const [pr, changePr] = React.useState([]);
  const [activeTest, changeActiveTest] = React.useState();
  const getPr = () => {
    axios
      .get("http://localhost:5000/tests")
      .then(function(response) {
        changePr(response.data);
        // activeTest = response.data.find(x => x.id === id);
        changeActiveTest(response.data[id - 1]);
        return activeTest;
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getPr();
  });

  const [value, setValue] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
  ]);

  const handleClick = id => {
    let newArray = [...openCollapse];
    newArray[id] = !newArray[id];
    setOpenCollapse(newArray);
  };

  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [type, setType] = React.useState("");
  const [duration, setDuration] = React.useState();
  const [questions, setQuestions] = React.useState([
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: "2",
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    },
    {
      ques: "",
      options: [null, null, null, null],
      correctoption: null,
      marks: 0
    }
  ]);

  // const handleChange = event => {
  //   let newValue = [...value];
  //   newValue[event.target.name] = event.target.value;
  //   setValue(newValue);
  //   console.log(value);
  // };

  const handleChangeTitle = event => {
    setTitle(event.target.value);
  };

  const handleChangeDesc = event => {
    setDesc(event.target.value);
  };

  const handleChangeType = event => {
    setType(event.target.value);
  };

  const handleChangeDuration = event => {
    setDuration(event.target.value);
  };

  const handleChangeQuetionsQues = (event, id) => {
    let newArray = [...questions];
    newArray[id].ques = event.target.value;
    setQuestions(newArray);
  };

  const handleChangeQuestionsOptions = (event, id, option) => {
    let newArray = [...questions];
    newArray[id].options[option] = event.target.value;
    setQuestions(newArray);
  }

  const handleChangeQuetionsCorrectOption = (event, id) => {
    let newArray = [...questions];
    newArray[id].correctoption = event.target.value;
    setQuestions(newArray);
  };

  const handleChangeMarks = (event, id) => {
    let newArray = [...questions];
    newArray[id].marks = event.target.value;
    setQuestions(newArray);
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const addTest = () => {
    let marks = 0;
    for (let index = 0; index < 9; index++) {
      marks += +questions[index].marks;
    };
    const data = {
      id: Math.round(Math.random() * 1000),
      title: title,
      description: desc,
      subject: type,
      marks: marks,
      duration: duration,
      questions: questions
    }
    // const dataJSON = JSON.stringify(data);
    axios
      .post("http://localhost:5000/tests", data)
      .then(function(response) {
        console.log(data);
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    let marks = 0;
    for (let index = 0; index < activeTest.questions.length; index++) {
      if (activeTest.questions[index].correctoption == value[index]) {
        marks += +activeTest.questions[index].marks;
      }
    }
    // changePr({...pr, taken: true, marksObtained: marks });
    alert(
      "Test Submitted Successfully. Marks Obtained : " +
        marks +
        "/" +
        activeTest.marks
    );
    return <Redirect to="/admin/tests/home" />;
  };

  // console.log(activeTest);
  if (id === "home") {
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <GridList>
            {pr.map(el => {
              return (
                // eslint-disable-next-line react/jsx-key
                <PrCard
                  id={el.id}
                  title={el.title}
                  description={el.description}
                  duration={el.duration}
                  marks={el.marks}
                  marksObtained={el.marksObtained}
                  taken={el.taken}
                  subject={el.subject}
                  questions={el.questions}
                  admin={true}
                  getPr={getPr}
                />
              );
            })}
          </GridList>
        </GridItem>
        <Fab
          color="primary"
          className={classes.fab}
          aria-label="add"
          onClick={handleOpen}
        >
          <AddIcon />
        </Fab>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500
          }}
        >
          <Fade in={open}>
            <div className={classes.paper} style={{ overflow: "auto" }}>
              {/* <h4 id="transition-modal-title">Warning</h4> */}
              <div>
                <p>Add new Test</p>
                <div className={classes.prform}>
                  <TextField
                    className={classes.formelement}
                    autoFocus
                    required
                    id="title"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    value={title}
                    onChange={handleChangeTitle}
                  />
                  <TextField
                    className={classes.formelement}
                    id="description"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={desc}
                    onChange={handleChangeDesc}
                  />
                  <TextField
                    className={classes.formselect}
                    id="subject"
                    required
                    select
                    label="subject"
                    value={type}
                    onChange={handleChangeType}
                    variant="outlined"
                  >
                    <MenuItem value={"english"}>English</MenuItem>
                    <MenuItem value={"maths"}>Maths</MenuItem>
                    <MenuItem value={"science"}>Science</MenuItem>

                    {/* {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))} */}
                  </TextField>
                  <TextField
                    className={classes.formselect}
                    id="duration"
                    label="Duration (in mins)"
                    variant="outlined"
                    value={duration}
                    onChange={handleChangeDuration}
                  />
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(0)}>
                      <ListItemText primary="Question 1" />
                      {openCollapse[0] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[0]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[0].ques}
                            onChange={e => handleChangeQuetionsQues(e, 0)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[0].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 0, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[0].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 0, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[0].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 0, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[0].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 0, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[0].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 0)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[0].marks}
                            onChange={e => handleChangeMarks(e, 0)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(1)}>
                      <ListItemText primary="Question 2" />
                      {openCollapse[1] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[1]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[1].ques}
                            onChange={e => handleChangeQuetionsQues(e, 1)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[1].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 1, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[1].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 1, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[1].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 1, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[1].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 1, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[1].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 1)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[1].marks}
                            onChange={e => handleChangeMarks(e, 1)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(2)}>
                      <ListItemText primary="Question 3" />
                      {openCollapse[2] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[2]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[2].ques}
                            onChange={e => handleChangeQuetionsQues(e, 2)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[2].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 2, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[2].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 2, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[2].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 2, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[2].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 2, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[2].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 2)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[2].marks}
                            onChange={e => handleChangeMarks(e, 2)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(3)}>
                      <ListItemText primary="Question 4" />
                      {openCollapse[3] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[3]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[3].ques}
                            onChange={e => handleChangeQuetionsQues(e, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[3].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 3, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[3].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 3, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[3].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 3, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[3].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 3, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[3].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 3)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[3].marks}
                            onChange={e => handleChangeMarks(e, 3)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(4)}>
                      <ListItemText primary="Question 5" />
                      {openCollapse[4] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[4]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[4].ques}
                            onChange={e => handleChangeQuetionsQues(e, 4)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[4].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 4, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[4].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 4, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[4].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 4, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[4].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 4, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[4].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 4)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[4].marks}
                            onChange={e => handleChangeMarks(e, 4)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(5)}>
                      <ListItemText primary="Question 6" />
                      {openCollapse[5] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[5]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[5].ques}
                            onChange={e => handleChangeQuetionsQues(e, 5)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[5].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 5, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[5].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 5, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[5].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 5, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[5].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 5, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[5].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 5)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[5].marks}
                            onChange={e => handleChangeMarks(e, 5)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(6)}>
                      <ListItemText primary="Question 7" />
                      {openCollapse[6] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[6]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[6].ques}
                            onChange={e => handleChangeQuetionsQues(e, 6)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[6].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 6, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[6].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 6, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[6].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 6, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[6].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 6, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[6].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 6)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[6].marks}
                            onChange={e => handleChangeMarks(e, 6)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(7)}>
                      <ListItemText primary="Question 8" />
                      {openCollapse[7] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[7]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[7].ques}
                            onChange={e => handleChangeQuetionsQues(e, 7)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[7].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 7, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[7].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 7, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[7].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 7, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[7].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 7, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[7].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 7)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[7].marks}
                            onChange={e => handleChangeMarks(e, 7)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(8)}>
                      <ListItemText primary="Question 9" />
                      {openCollapse[8] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[8]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[8].ques}
                            onChange={e => handleChangeQuetionsQues(e, 8)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[8].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 8, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[8].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 8, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[8].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 8, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[8].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 8, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[8].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 8)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[8].marks}
                            onChange={e => handleChangeMarks(e, 8)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                
                  <List className={classes.list}>
                    <ListItem button onClick={() => handleClick(9)}>
                      <ListItemText primary="Question 10" />
                      {openCollapse[9] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={openCollapse[9]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formelement}
                            autoFocus
                            required
                            id="question1"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={questions[9].ques}
                            onChange={e => handleChangeQuetionsQues(e, 9)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 1"
                            variant="outlined"
                            value={questions[9].options[0]}
                            onChange={e => handleChangeQuestionsOptions(e, 9, 0)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 2"
                            variant="outlined"
                            value={questions[9].options[1]}
                            onChange={e => handleChangeQuestionsOptions(e, 9, 1)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 3"
                            variant="outlined"
                            value={questions[9].options[2]}
                            onChange={e => handleChangeQuestionsOptions(e, 9, 2)}
                          />
                          <TextField
                            className={classes.formselect}
                            id="option"
                            label="Option 4"
                            variant="outlined"
                            value={questions[9].options[3]}
                            onChange={e => handleChangeQuestionsOptions(e, 9, 3)}
                          />
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend">
                              Correct Option:
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-label="position"
                              name="position"
                              value={questions[9].correctoption}
                              onChange={e =>
                                handleChangeQuetionsCorrectOption(e, 9)
                              }
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio color="primary" />}
                                label="Option 1"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="2"
                                control={<Radio color="primary" />}
                                label="Option 2"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="3"
                                control={<Radio color="primary" />}
                                label="Option 3"
                                labelPlacement="start"
                              />
                              <FormControlLabel
                                value="4"
                                control={<Radio color="primary" />}
                                label="Option 4"
                                labelPlacement="start"
                              />
                            </RadioGroup>
                          </FormControl>
                        </ListItem>
                        <ListItem className={classes.nested}>
                          <TextField
                            className={classes.formselect}
                            id="marks"
                            label="Marks"
                            variant="outlined"
                            value={questions[9].marks}
                            onChange={e => handleChangeMarks(e, 9)}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </List>
                </div>
                <Button
                  color="info"
                  variant="contained"
                  style={{ marginRight: "0px" }}
                  onClick={addTest}
                >
                  {" "}
                  Add{" "}
                </Button>
                <Button color="transparent" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      </GridContainer>
    );
  } else if (activeTest === undefined) return null;
}
