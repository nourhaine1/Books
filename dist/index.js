"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var bookmoddel_1 = __importDefault(require("./bookmoddel"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1["default"])();
app.use(body_parser_1["default"].json());
// on doit crrer un schema
var url = "mongodb://localhost:27017/biblio";
mongoose_1["default"].connect(url, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Mongodb connected saye");
});
app.get("/books", function (req, res) {
    bookmoddel_1["default"].find(function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app.post("/books", function (req, res) {
    //enter le livre dans le body de la requete http
    var b = new bookmoddel_1["default"](req.body);
    //il va utiliser un middleware pour parser en json
    b.save(function (err) {
        if (err)
            res.status(500).send(err);
        else
            res.send(b);
    });
});
app.get("/books/:id", function (req, res) {
    bookmoddel_1["default"].findById(req.params.id, (function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    }));
});
app.put("/books/:id", function (req, res) {
    var book = bookmoddel_1["default"].findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err)
            res.status(500).send(err);
        else
            res.send(book);
    });
});
app.get('/booksSearch', function (req, res) {
    var _a, _b;
    var search = req.query.search || '';
    var page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    var size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    bookmoddel_1["default"].paginate({ title: { $regex: ".*(?i)" + search + ".*" } }, { page: page, limit: size }, function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app.get('/booksParPage', function (req, res) {
    var _a, _b;
    var page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    var size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    bookmoddel_1["default"].paginate({}, { page: page, limit: size }, function (err, books) {
        if (err)
            res.status(500).send(err);
        else
            res.send(books);
    });
});
app["delete"]('/books/:id', function (req, res) {
    bookmoddel_1["default"].findByIdAndDelete(req.params.id, function (err) {
        if (err)
            return res.status(500).send(err);
        else
            return res.send("book deleted");
    });
});
app.get("/", function (req, res) {
    res.send("hello express");
});
app.listen(8085, function () {
    console.log("server started");
});
