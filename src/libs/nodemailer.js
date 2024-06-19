import * as nodemailer from 'nodemailer'
import { config } from "../config/index.js";

export const createLead = (id, contactInfo) => {  //quitar async
    try {
        let transporter = nodemailer.createTransport({
            // service:'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: config.nodemailerUser,
                pass: config.nodemailerPassword
            }
        })
        const MailToLead = {
            from: config.nodemailerUser,
            to: config.nodemailerSupportMail,
            subject: "User Support",
            text: `The user ${id} wants to talk with someone. Message: ${contactInfo}`
        }
        transporter.sendMail(MailToLead, (err, info) => {
            console.log('message: ', MailToLead)
            if (err) {
                console.error({err})
            } else {
                console.log(info)
            }
        })
        // transporter.sendMail(mailToMe, (err, info) => {

        //     console.log('message: ', mailToMe)
        //     if (err) {
        //         console.error(err)
        //     } else {
        //         console.log(info)
        //         res.status(200).json(req.body)
        //     }
        // })
    } catch (error) {
        console.log({error});
        // res.status(500).send({ "err": error })
        // res.json({ error: error.message })
    }
}