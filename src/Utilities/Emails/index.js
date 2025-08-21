import nodemailer from 'nodemailer';
//lkxc gghy lsou wwrc

export async function sendmail({to,subject,html}){
const transporter = nodemailer.createTransport({
host:'smtp.gmail.com',
port:587,
auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
}
});

await transporter.sendMail({
    from:"'saraha app'<eng.eman.ahmed1989@gmail.com>",
    to,
    subject,
    html
});
}
