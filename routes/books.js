var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('books',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('books',{data:rows});
        }
    });
});

// display Lisaa opiskelija opintojaksolle page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('books/add', {
        Opiskelija: '',
        Opintojakso: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let Opiskelija = req.body.Opiskelija;
    let Opintojakso = req.body.Opintojakso;
    let errors = false;

    if(Opiskelija.length === 0 || Opintojakso.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter Opiskelija and Opintojakso");
        // render to add.ejs with flash message
        res.render('books/add', {
            Opiskelija: Opiskelija,
            Opintojakso: Opintojakso
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Opiskelija: Opiskelija,
            Opintojakso: Opintojakso
        }
        
        // insert query
        dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('books/add', {
                    Opiskelija: form_data.Opiskelija,
                    Opintojakso: form_data.Opintojakso                    
                })
            } else {                
                req.flash('success', 'Book successfully added');
                res.redirect('/books');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Book not found with id = ' + id)
            res.redirect('/books')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('books/edit', {
                title: 'Edit Book', 
                id: rows[0].id,
                Opiskelija: rows[0].Opiskelija,
                Opintojakso: rows[0].Opintojakso
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let Opiskelija = req.body.Opiskelija;
    let Opintojakso = req.body.Opintojakso;
    let errors = false;

    if(Opiskelija.length === 0 || Opintojakso.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter Opiskelija and Opintojakso");
        // render to add.ejs with flash message
        res.render('books/edit', {
            id: req.params.id,
            Opiskelija: Opiskelija,
            Opintojakso: Opintojakso
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Opiskelija: Opiskelija,
            Opintojakso: Opintojakso
        }
        // update query
        dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    Opiskelija: form_data.Opiskelija,
                    Opintojakso: form_data.Opintojakso
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/books')
        } else {
            // set flash message
            req.flash('success', 'Book successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/books')
        }
    })
})

module.exports = router;;