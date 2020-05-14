const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");
const Cors = require("cors");


var app = Express();

Mongoose.connect('mongodb://localhost/exam', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// const QuesModel = Mongoose.model("ques", {
//     ques: String,
//     options: Array,
//     correctOption: Number,
//     image: String,
//     marks: Number
// })

const TestModel = Mongoose.model("test", {
    id: Number,
    title: String,
    description: String,
    subject: String,
    marks: Number,
    duration: Number,
    questions: [ {
        ques: String,
        options: Array,
        correctOption: Number,
        image: String,
        marks: Number
    } ]
});

app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.delete("/tests/:id", async (request, response) => {
    try {
        var result = await TestModel.deleteOne({id: request.params.id});
        await TestModel.deleteOne({id: undefined});
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.put("/student/:id", async (request, response) => {});

app.post("/tests", async (request, response) => {
    try {
        var test = new TestModel(request.body);
        var result = await test.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/tests", async (request, response) => {
    try {
        var result = await TestModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




app.listen(5000, () => {
    console.log("Listening at :5000...");
});