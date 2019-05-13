const  hbs = require("nodemailer-express-handlebars"),
    mailerEmail = process.env.MAILER_EMAIL_ID || "auth_email_address@gmail.com",
    mailerPass = process.env.MAILER_PASSWORD || "auth_email_pass"
nodemailer = require("nodemailer");


const smtpTransport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: mailerEmail,
        pass: mailerPass
    }
});

const handlebarOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: "API/v1/templates/",
        layoutsDir: "API/v1/templates/"
    },
    viewPath: "API/v1/templates/",
    extName: ".html",
};

smtpTransport.use("compile", hbs(handlebarOptions));

/**
 * @swagger
 * paths:
 *  /requisition:
 *      post:
 *          tags:
 *          - requisition
 *          summary: Sends an email to the company
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - name: Authorization
 *              in: header
 *              description: Authorization token format must be the following 'Bearer **********'
 *              required: true
 *              type: string
 *            - name: Information
 *              in: body
 *              description: What fields must be filled in order to make a requisition
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      email:
 *                          type: string
 *                          example: 00062816@uca.edu.sv
 *                      name:
 *                          type: string
 *                          example: Mario Rene
 *                      content:
 *                          type: string
 *                          example: 3 cameras, 20 boxes of dahua
 *          responses:
 *              '200':
 *                  description: Requisition made. A member of our team while contact you later
 *              '401':
 *                  description: Your lack of permissions prevents you from accessing this route
 *              '422':
 *                  description: Missing fields
 *              '500':
 *                  description: Some kind of error
 */

exports.requestPrice = (req, res, next)=> {
    const userData = req.userData;
    if(!req.body.email || !req.body.name || !req.body.content){
        return res.status(422).json({
            message: "Missing fields"
        });
    }
    const data = {
        to: mailerEmail,
        from: req.body.email,
        template: "make-requisition",
        subject: "Vino una requisición!",
        context: {
            account: userData.account,
            message: req.body.content,
            name: req.body.name,
            email: req.body.email
        }
    };
    smtpTransport.sendMail(data, (err) =>{
        if (!err) {
            return res.status(200).json({ message: "Requisition made. A member of our team while contact you later" });
        } else {
            return res.status(500).json({ message: err });
        }
    });
}