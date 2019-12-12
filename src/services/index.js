const express = require ("express");
const fs = require ("fs")
const path = require("path")




const router = express.Router()


const studentsFilePath = path.join(__dirname, "students.json");

const readFile = ()=>{
  const buffer = fs.readFileSync(studentsFilePath)  
  const content = buffer.toString();
  return JSON.parse(content)
}

router.get("/", (req,res)=>{
    res.send(readFile())
})


router.get("/:id", (req,res)=>{
    let students = readFile();

    let student = students.find(x => x._id == req.params.id)
    if(student){
        res.send(student)
    }
    else {
        res.status(404).send ("Not found bro")
    }
})


router.post("/", (req,res) => {
    let previousStudents = readFile();

    if(previousStudents.find(student => student.email == req.body.email))
        res.status(500).send("Cannot create: email already in use")
   
        
 
    req.body._id = previousStudents.length + 1;
    req.body.creationTime = new Date()
    previousStudents.push(req.body)
    fs.writeFileSync(studentsFilePath, JSON.stringify(previousStudents));
     res.send({ _id: req.body._id })
 })
 
 
router.put("/:id", (req,res) => {
   let  students = readFile()
    
    let student = students.find(x => x._id == req.params.id)
    if(student){

        let mergedStudent =  Object.assign(student, req.body)
        // students[req.params.id - 1] = mergedStudent
        let position = students.indexOf(student)
        students[position] = mergedStudent
        fs.writeFileSync(studentsFilePath, JSON.stringify(students));
        res.send(mergedStudent)
    }
    else {
        res.status(404).send ("Not found bro")
    }



})


router.delete("/:id", (req,res)=>{
    let students = readFile();

    let studentsToRemain = students.filter(x => x._id != req.params.id)

    if(studentsToRemain.length < students.length){
        //remove
        //return 200

        fs.writeFileSync(studentsFilePath, JSON.stringify(studentsToRemain));
        res.send("Removed");

    }
    else {
        res.status(404).send ("Not found bro")
    }

})


router.post("/checkEmail/:email", (req,res) => {
    let students = readFile();

    res.send(students.find(student => student.email == req.params.email) 
    ? "Email in use" 
    :  "Email not in use")

})





module.exports = router;