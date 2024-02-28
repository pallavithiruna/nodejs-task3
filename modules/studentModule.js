const mongo=require('../connect');
const { ObjectId } = require( 'mongodb' );

  //.......................get students...........................//
module.exports.getAllStudents=async(req,res)=>{
    try{
        const getResponse=await mongo.selectedDb.collection('students').find().toArray();
        res.send(getResponse);
    }
    catch {
        res.send({
            statusCode:500,
            message:"Internal server error"
        })
    }
}

//.......................Create Students...........................//
module.exports.createStudent=async(req,res)=>{
    try{
        const existUser=await mongo.selectedDb.collection('students').find({$and:[{studentId:req.body.studentId},{studentName:req.body.studentName},{email:req.body.email}]}).count()>0
        if(existUser){
            res.send('Student already exists')
        }
        else{
        await mongo.selectedDb.collection('students').insertOne(req.body)
        res.send({
            statusCode:201,
            message:"student added successfully"
        })
    }
}
    catch {
        res.send({
            statusCode:500,
            message:"Internal server error"
        })
    }
}

//.......................Select One Student and Assign one Mentor...........................//

module.exports.assignMentorToStudent=async(req,res)=>{
    try{        
        let id=req.params.id
        const getResponse=await mongo.selectedDb.collection('students').find({_id:ObjectId(id)}).toArray();
       let arr=[]
      getResponse.map((e)=>{
            arr.push(req.body.mentorId===e.mentorId)
        })
        if(arr=="false"){
              await mongo.selectedDb.collection('students').updateOne({_id:ObjectId(id)},{$set:{mentorId:req.body.mentorId}})
        res.send({
           statusCode:200,
            message:'Mentor assigned successfully'
        });           
        }
        else{
        
            res.send({
                statusCode:400,
                message:'Mentor has already assigned to this student'
            })
    }
}
    catch {
        res.send({
            statusCode:500,
            message:"Internal server error"
        })
    }
}