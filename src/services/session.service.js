'use strict'
const sessionSchema = require ('../models/sessionId')
const crypto = require("crypto");
const { BadRequestError, Forbiden, AuthFailureError } = require("../core/error.response");

class SessionService{
    static async createSessionId(userId){
    const sessionId = crypto.randomUUID(); 
    const expiredDay = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    await sessionSchema.create({
        session_id: sessionId,
        user_id: userId,
        expired_day: expiredDay
    })
    return sessionId
    }
    static async checkValidSessionId (sessionId){
        const session= sessionSchema.findOne({session_id: sessionId})
        if(!sessionId){
            throw Forbiden("Invalid session Id")
        }
        if (session.expired_day < new Date()) {
            await this.deleteSessionId(sessionId)
            throw AuthFailureError("Session Id is expired")
        }
        return true
    }
    static async deleteSessionId(sessionId){
        await sessionSchema.findOneAndDelete({session_id: sessionId})

    }
}
module.exports = SessionService;
