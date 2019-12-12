const express = require ("express");
const fs = require ("fs-extra")
const path = require("path")




const router = express.Router()


const studentsFilePath = path.join(__dirname, "students.json");

const readFile = async()=>{
  const buffer = await fs.readFile(studentsFilePath)  
  const content = buffer.toString();
  return JSON.parse(content)
}

router.get("/", async (req,res)=>{
    const allStudents = await readFile()
    res.send(allStudents)
})


router.get("/:id", async (req,res)=>{
    let students = await readFile();

    let student = students.find(x => x._id == req.params.id)
    if(student){
        res.send(student)
    }
    else {
        res.status(404).send ("Not found bro")
    }
})


router.post("/", async (req,res) => {
    let previousStudents = await readFile();

    if(previousStudents.find(student => student.email == req.body.email))
        res.status(500).send("Cannot create: email already in use")
   
        
 
    req.body._id = previousStudents.length + 1;
    req.body.creationTime = new Date()
    previousStudents.push(req.body)
    await fs.writeFile(studentsFilePath, JSON.stringify(previousStudents));
     res.send({ _id: req.body._id })
 })
 
 
router.put("/:id", async (req,res) => {
   let  students = await readFile()
    
    let student = students.find(x => x._id == req.params.id)
    if(student){

        let mergedStudent =  Object.assign(student, req.body)
        // students[req.params.id - 1] = mergedStudent
        let position = students.indexOf(student)
        students[position] = mergedStudent
        await fs.writeFile(studentsFilePath, JSON.stringify(students));
        res.send(mergedStudent)
    }
    else {
        res.status(404).send ("Not found bro")
    }



})


router.delete("/:id", async (req,res)=>{
    let students = readFile();

    let studentsToRemain = students.filter(x => x._id != req.params.id)

    if(studentsToRemain.length < students.length){
        //remove
        //return 200

        await fs.writeFile(studentsFilePath, JSON.stringify(studentsToRemain));
        res.send("Removed");

    }
    else {
        res.status(404).send ("Not found bro")
    }

})


router.post("/checkEmail/:email", async (req,res) => {
    let students = await readFile();

    res.send(students.find(student => student.email == req.params.email) 
    ? "Email in use" 
    :  "Email not in use")

})





module.exports = router;