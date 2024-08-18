const express = require("express")
const app =express()
const cros = require("cors")
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT
require("colors")




app.use(cros())
app.use(express.json())



app.listen(PORT , ()=>{
    console.log(`server work >>> PORT:${PORT}`);
    
})