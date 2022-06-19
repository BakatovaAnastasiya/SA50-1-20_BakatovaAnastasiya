const mysql = require("mysql");

const express = require("express");
const app = express();

app.set("view engine", "hbs");

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "Bakatova A.V",
    database: "laboratornaya3",
    password: "qwertyuiop"
});

pool.getConnection(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    } else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});

const urlencodedParser = express.urlencoded({ extended: false });

app.get("/", function (req, res) {
    pool.query("SELECT student_name.surname, student_name.name, student_name.second_name, student_group.group_name, student_speciality.kod_speciality FROM student_name JOIN student_group ON student_name.stud_group=student_group.id JOIN student_speciality on student_group.special=student_speciality.number;", function (err, data) {
        if (err) return console.log(err);
        res.render("stranica.hbs", {
            student_name: data
        });
    });
});

app.get("/create", function (req, res) {
    pool.query("SELECT * FROM student_group", function (err, data) {
        if (err) return console.log(err);
        res.render("create.hbs", {
            student_group: data
        });
    });
});

app.post("/create", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const second_name = req.body.second_name;
    const name = req.body.name;
    const surname = req.body.surname;
    const stud_group = req.body.stud_group;
    const birthday = req.body.birthday;
    pool.query("INSERT INTO student_name (second_name, name, surname, stud_group, birthday ) VALUES (?,?,?,?,?)", [second_name, name, surname, stud_group, birthday], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/group", function (req, res) {
    pool.query("SELECT * FROM student_speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("group.hbs", {
            student_speciality: data
        });
    });
});

app.post("/group", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const group_name = req.body.group_name;
    const cource = req.body.cource;
    const special = req.body.special;
    pool.query("INSERT INTO student_group (group_name, cource, special) VALUES (?,?,?)", [group_name, cource, special], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.get("/speciality", function (req, res) {
    pool.query("SELECT * FROM student_speciality", function (err, data) {
        if (err) return console.log(err);
        res.render("speciality", {
            student_speciality: data
        });
    });
});

app.post("/speciality", urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const kod_speciality = req.body.kod_speciality;
    pool.query("INSERT INTO student_speciality (kod_speciality) VALUES (?)", [kod_speciality], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/");
    });
});

app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});