import express from "express";
import mongoose from "mongoose";
import {Request,Response} from "express";
import Book from "./bookmoddel";
import bodyParser from"body-parser";
const app=express();
app.use(bodyParser.json())
// on doit crrer un schema
const url="mongodb://localhost:27017/biblio";
    mongoose.connect(url,err=>{
        if(err) console.log(err);
        else console.log("Mongodb connected saye");
    });
    app.get("/books",(req:Request,res:Response)=>{

        Book.find((err,books)=>{
        
        if (err) res.status(500).send(err);
        
        else res.send(books);
        })
        });
    app.post("/books",(req:Request,res:Response)=>{
        //enter le livre dans le body de la requete http
      let b=new Book(req.body);
      //il va utiliser un middleware pour parser en json
      b.save(err=>{
        if(err) res.status(500).send(err)
        else res.send(b);
      });
    })
    app.get("/books/:id",(req:Request,res:Response)=>{
        Book.findById(req.params.id,((err:any,books:any)=>{
            if (err)res.status(500).send(err)
            else res.send(books)
        }))
    })
    app.put("/books/:id",(req:Request,res:Response)=>{
        
   let book=Book.findByIdAndUpdate(req.params.id, req. body, (err: any)=> {
            if (err) res.status(500).send(err)
            else res.send(book)

    })
})
app.get('/booksSearch',(req:Request,res:Response)=>{
    const search = req.query.search || '';
    const page:number = parseInt(req.query.page?.toString()||'1');
    const size:number = parseInt(req.query.size?.toString()||'5');

    Book.paginate({title:{$regex:".*(?i)"+search+".*"}},{page:page,limit:size},(err:any,books:any)=>{
        if(err) res.status(500).send(err);
        else res.send(books);
    });
    
});
app.get('/booksParPage',(req:Request,res:Response)=>{
    const page:number = parseInt(req.query.page?.toString()||'1');
    const size:number = parseInt(req.query.size?.toString()||'5');

    Book.paginate({},{page:page,limit:size},(err:any,books:any)=>{
        if(err) res.status(500).send(err);
        else res.send(books);
    });

})
app.delete('/books/:id', (req: Request, res: Response) => { 
    Book.findByIdAndDelete(req.params.id,(err: any) =>{
    if(err) return res.status(500).send(err)
     else return res.send("book deleted");
    });
})
    app.get("/",(req, res)=> {
        res.send ("hello express");
    })
   
    const PORT = process.env.PORT || 3000;
    const eurekaHelper = require('./eureka.helper');
    
  
    app.get('/', (req, res) => {
     res.json("I am user-service")
    })
    eurekaHelper.registerWithEureka('books-service', PORT);
    app.listen(PORT,()=>{
        console.log("server started");
    })
