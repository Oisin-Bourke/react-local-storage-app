import React from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, IconButton, Paper, Typography } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import './NoteList.css';
import { deepOrange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    }
}));

function NoteItem(props) {
    const note = props.value;
    const title = note.title;
    const body = note.body;
    const date = new Date(note.date).toLocaleDateString();
    const letter = title.charAt(0).toUpperCase();
    const classes = useStyles();

    return (
        <Paper className="container">
            <ListItem alignItems="flex-start">
                <ListItemAvatar>
                <Avatar className={classes.orange} alt={letter}>{letter}</Avatar>
                </ListItemAvatar>
                <ListItemText
                primary={
                    <React.Fragment>
                        {title}
                        <span></span>
                      <Typography
                        component="span"
                        variant="body2"
                        className="date"
                        color="textSecondary"
                      >
                        {date}
                      </Typography>
                    </React.Fragment>
                  }
                secondary={body}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </Paper>
    );
};
  
function NoteList(props) {
  let notesList = props.notes;
  console.log('Setting props ', notesList);
  let noteItems = null;

  if (Array.isArray(notesList) && notesList.length > 0) {
    console.log('mapping')
    noteItems = notesList.map((note) =>
    <NoteItem key={note.id.toString()} value={note} />);
  }

  return (
  <List>
    {noteItems}
  </List>
  );
};

export default NoteList
