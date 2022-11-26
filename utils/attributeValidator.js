import { LoG } from "../logger/logger.js"
const logger= new LoG("Attribute Validator")
export const attributeValidator=(attributes)=>{
    for (const attribute in attributes) {
        if (attributes[attribute]=="" || attributes[attribute]=="undefined" || attributes[attribute]==undefined ){
          const err={
            success:false,
            message:` Missing required attribute ${attribute}`
        }
        logger.error(err)
            return err
        }
      }
      return{
        success:true
      }
}