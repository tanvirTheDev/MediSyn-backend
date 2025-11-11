"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const emailSender = async (email, html) => {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
        },
    });
    const info = await transporter.sendMail({
        from: '"MediSync" <maddison53@ethereal.email>',
        to: email,
        subject: "Reset Password Link",
        // text: "Hello world?", // plain‑text body
        html,
    });
    console.log("Message sent:", info.messageId);
};
exports.default = emailSender;
