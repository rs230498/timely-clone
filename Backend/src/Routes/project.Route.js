const {Router}=require("express")
const { ProjectModel } = require("../Models/project.model")

const projectController=Router()

projectController.get("/",async(req,res)=>{

    const {userId,name}=req.body
    const projects=await ProjectModel.find({userId:userId})

    if(!projects){
        return res.status(404).json({msg:"Something went wrong"})
    }
    
    return res.status(200).json({msg:"Proejcts fetched",name:name,projects:projects})

})

projectController.get("/search?q=",async(req,res)=>{

    const query=req.query
    let data=await ProjectModel.find({projectName:{$regex:req.query}})
    if(!data){
        return res.status(500).json({msg:"Something went wrong, please try again."})
    }
    return res.status(200).json({data:data})

})


projectController.post("/create",async(req,res)=>{

    const{userId,projectName,client,tag}=req.body
    
    if(!userId||!projectName||!client||!tag){
        return res.status(400).json({msg:"Please fill all the input fields"})
    }

    const project=await new ProjectModel({userId:userId,projectName:projectName,client:client,tag:tag})

    try{
        project.save()
        return res.status(201).json({msg:"Project Created"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:"Something went wrong, please try again."})
    }

})

projectController.patch("/update/:id",async(req,res)=>{
    
    const id=req.params.id
    const payload=req.body

    await ProjectModel.findByIdAndUpdate({_id:id},payload)

    try{
        return res.status(200).json({msg:"Project updated"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:"Something went wrong"})
    }
})

projectController.delete("/:id",async(req,res)=>{
    
    const id=req.params.id

    await ProjectModel.findByIdAndDelete({_id:id})
    try{
        return res.status(200).json({msg:"Data deleted"})
    }catch(err){
        console.log(err)
        return res.status(500).json({msg:"Something went wrong"})
    }
})




module.exports={
    projectController
}