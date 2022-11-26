export const ErrorHandler=(err,req,res,next)=>{
    const errorStatus=err.status || 500;
    const errorMessage=err.message || "Someting went wrong!";
    const error={
        success:false,
        status:errorStatus,
        message:errorMessage
    }

    return res.status(errorStatus).json(error);
}