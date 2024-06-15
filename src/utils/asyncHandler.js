//APPROACH 1
const asyncHandler = (requestHandler) =>{
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}//production centered code


// const asyncHandler = ()=>{} 
// const asyncHandler = (func)=>()=>{}  
// const asyncHandler = (func)=> async ()=>{}  

//APPROACH 2
//WRAPPER FUNCTION - can be used anywhere
// const asyncHandler = (fn) => async (req,res,next) =>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message: error.message
//         })
//     }
// }// (fn)=>{()=>{}} hi h bs 



export {asyncHandler}