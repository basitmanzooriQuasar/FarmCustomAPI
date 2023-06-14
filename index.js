//Synchronous code of Node js
const fs = require("fs");
const http = require("http"); //requiring the built-in http module(giving us networking capabilities)
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");
const slugify = require("slugify"); //slug is last part of url unique string

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const writeText = `We are creating a new file with this text including text from input file ${textIn}.
// Created by Basit Manzoor at ${Date.now()}`;

// fs.writeFileSync("./txt/output.text", writeText);
//thi is my first change
// console.log("File written!");

// //Asynchronous nature of Node Js: Blocking and Non-Blocking
// const fs = require("fs");

// // fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
// //   console.log("to show this runs in bg");
// //   console.log(data);
// // }); //making it a call back function

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data1) => {
//     console.log(data1);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data2) => {
//       console.log(data2);
//       fs.writeFile("./txt/final.txt", `${data1}\n${data2}`, "utf-8", (err) => {
//         console.log("File has been written 😊");
//       });
//     });
//   });
// });

// console.log("Reading data from input file");

/////////////////////////////////////////////////////

//Server

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slug = dataObj.map((ele) =>
  slugify(ele.productName, {
    lower: true,
  })
);
console.log(slug);

//1. Create a server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj
      .map((mov) => replaceTemplate(tempCard, mov))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  //Product page
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }

  //NOT FOUND
  else {
    res.writeHead(404, {
      //HTTP HEADER(piece of info sending back)
      "Content-type": "text.html",
    }); //404 STATUS CODE OF PAGE NOT FOUND
    res.end("<h1>Page NOT FOUND! </h1>");
  }
});
//2. Start a server
server.listen(8001, "127.0.0.1", () =>
  console.log("Server has been started on this port 8001")
);
// var a = Math.max();
// var b = Math.min();
// console.log(a);
// console.log(b);
