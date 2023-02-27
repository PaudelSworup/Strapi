'use strict';

/**
 * auth controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

const { ValidationError  } = require("@strapi/utils").errors;


const { addDays, addMinutes } = require("date-fns")


const crypto = require("crypto");

// const { request } = require('http');
const sendEmail = require('../../../../utils/sendMail');
module.exports = createCoreController('api::auth.auth' , ({strapi}) =>({
   async registerUser(ctx){
    const{name, email , faculty , semester} = ctx.request.body


    // get the authenticated user
    const user = ctx.state.user
    if(!user){
        console.log("no header found")
        return ctx.request(null, [{messages:[{id:"NO Authrization Header was found"}]}]);
    }

    //check if email already exist in the db

    const isExist = await strapi.db.query("api::auth.auth").findOne({
        where:{email:email}
    })

    if(isExist){
        throw new ValidationError("Email already exist")
    }
  


    // record the users data in the db

    const entity = await strapi.service("api::auth.auth").create({
        data:{
            publishedAt: new Date(),
            name,
            email,
            faculty,
            semester
        }
    })

    console.log(entity)

    // now store the token
    const token = await strapi.service("api::token.token").create({
        data:{
            publishedAt:new Date(),
            token:crypto.randomBytes(16).toString("hex"),
            userId:String(entity.id),
            expiresIn:addDays(Date.now() , 1)
        }
    })

    if(!token){
        console.log("token was not set")
        return ctx.request(null, [{messages:[{id:"Something went wrong"}]}]);
    }
    console.log(token)

        sendEmail({
            from:process.env.MAIL_FROM,
            to:email,
            subject: 'Verify your account' ,
            text: `Verify your account before token get expired \n\n http:\/\/${ctx.request.headers.host}\/api\/confirmation\/${token.token} ` 
        })
  

    const sanitizedEntity =  await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
   }
}));
