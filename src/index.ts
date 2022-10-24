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
        
    })
    app.get("/",(req, res)=> {
        res.send ("hello express");
    })

    app.listen(8085,()=>{
        console.log("server started");
    })
