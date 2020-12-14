const express = require('express');
const PORT = 3000;
const bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://db:27017/todoapp";


const initializeDatabase = async (callback) => {
    await MongoClient.connect(url, async function (err, db) {
        if (err) throw err;
        let dbo = db.db("todoapp");
        console.log("connected to database todoapp");
        await dbo.createCollection("todos", function (err) {
            if (!err) console.log("collection created")
        });
        callback(dbo);
    });
}

const startApp = db => {
    const app = express();
    app.use(bodyParser.json());

    app.get("/todos", (req, res) => {
        db.collection("todos").find({}).toArray(function (err, result) {
            if (err) {
                res.send("An error occured");
                throw err;
            }
            console.log(result);
            res.json(result);
        })
    });

    app.post("/todos",(req, res) => {
        const { title } = req.body;
        db.collection("todos").insertOne({
            title,
            created_at: new Date().toISOString()
        }, function(err) {
            if (err) throw err;
            console.log("1 todo inserted");
            res.json({
                "status": "ok"
            });
        });
    })

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
}


initializeDatabase(startApp);

