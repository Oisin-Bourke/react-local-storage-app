import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { TextField, Button, Paper } from "@material-ui/core";
import * as Yup from "yup";
import './NoteForm.css';
import * as indexedDB from '../indexedDB';
import NoteList from "./NotesList";

  //const notes = [{id: 1, title: 'Shopping', body: 'Get bread!', date: Date.now() },{id: 2, title: 'Shopping', body: 'Get sprouts! And some more sprouts. And whatever else you want!!', date: Date.now() },{id: 3, title: 'Shopping', body: 'Juice', date: Date.now() }];


let db;

const NoteForm = () => {
  const [notes, setNotes] = useState([]);
  console.log('Initial notes state ', notes);
  
  useEffect(() => {
    console.log('use effect notes', notes)
    db = indexedDB.conn();
    const storedNotes = fetchData();
    //console.log('setting notes', storedNotes);
    //setNotes(storedNotes);   
  },[]);
  
  // Formik form with validation 
  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
      .max(24, 'Must be 24 characters or less')
      .required('Required'),
      body: Yup.string()
      .max(200, 'Must be 200 characters or less')
      .required('Required'),
    }),
    onSubmit: (values,actions) => {
      saveNote(values);
      actions.resetForm();
    },
  });
  
  const fetchData = () => {
    //const db = indexedDB.conn();
    let db; 
    let request = window.indexedDB.open('notes_db', 1);
    
    request.onerror = () => {
      console.log('IndexedDB failed to open');
    };
    
    request.onsuccess = () => {
      const storedNotes = [];
      console.log('request success');
      db = request.result;
      // Open the object store and get a 'cursor' which iterates the data
      let objectStore = db.transaction('notes_os').objectStore('notes_os');
      
      objectStore.openCursor().onsuccess = e => {
        console.log('reading...')
        let cursor = e.target.result;
        
        if(cursor) {
          const note = 
          { 
          id: cursor.value.id, 
          title: cursor.value.title, 
          body: cursor.value.body, 
          date: cursor.value.date
          }
          storedNotes.push(note);
          cursor.continue();
        } 
      };
      console.log('setting notes', storedNotes)
      //return storedNotes;
      setNotes(storedNotes)
    };
    
  };

    
  const saveNote = (values) => {
    const newNote = { title: values.title, body: values.body, date: Date.now() };
    const transactionStore = db.transaction(['notes_os'], 'readwrite').objectStore('notes_os');;
    let request = transactionStore.add(newNote);
    
    request.onsuccess = () => {
      console.log('Request success')
    };
    
    transactionStore.oncomplete = () => {
      console.log('Transaction completed. DB updated');
      // displayData();
    };
    
    transactionStore.onerror = () => {
      console.log('Transaction not opened due to error')
    };  
  };

  return(
      <div> 
        <Paper className="container">
          <form onSubmit={formik.handleSubmit}>
              <TextField
                  fullWidth
                  type="text"
                  id="title"
                  name="title"
                  label="Title"
                  value={formik.values.title}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
              />
              <TextField
                  fullWidth
                  multiline
                  rows={3}
                  rowsMax={5}
                  type="textarea"
                  id="body"
                  name="body"
                  label="Note"
                  value={formik.values.body}
                  error={formik.touched.body && Boolean(formik.errors.body)}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
              />
              <Button color="primary" variant="contained" fullWidth type="submit">+ Note</Button>
          </form>
        </Paper>
        {console.log('rendering', notes)}
        <NoteList notes={notes}/>
      </div>
  );
};

export default NoteForm;
