
const jwt = require('jsonwebtoken');
let express = require('express');
let router = express.Router();
let $ = require('jquery');
//const request = require('request');
const moment = require('moment');
const UserService = require('../service/user_service');
const TicketPayment = require('../service/payment_services');
const TicketService = require('../service/ticket_service');

let user_id;
let event_id;
let ticket_id;

const createPayment = async (req, res) => {
    
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    //console.log("lllllllllllllllllllllllllllllll", req.body);
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    user_id = req.body.user_id;
    event_id = req.body.event_id;
    ticket_id = req.body.ticket_id;
    console.log(req.body);
    let amount = req.body.amount;
    //let locale = req.body.language;
    //if(locale === null || locale === ''){
    let email = req.body.email;
    let name_ticket = req.body.name_ticket;
    let name_event = req.body.name_event;
    let date_payment = moment(date).format('DD-MM-YYYY');
    let locale = 'vn';
    if(await TicketPayment.isCheckingPaymentForEvent(user_id, event_id)){
        res.status(200).json({ message: "Bạn đã mua vé cho sự kiện này" });
        return;
    }
    const tk = await TicketService.getTicketDetails(ticket_id)
    if(tk.quantity <= 0 ){

        res.status(200).json({ message: "Sự kiện đã hết vé" });
        return;
    }
    //}
    let bankCode = null;
    const user = await UserService.getUserbyEmail(email);

    if (!user) {
        res.status(300).json({ error: 'Đã xảy ra lỗi không tìm thấy user' });
    }
    const user_name = user.name;


    let payment_message = "Thanh toan ve " + name_ticket +" cho su kien "+ name_event + ", nguoi dung ";
    
    
    
    payment_message = payment_message + user_name + " voi ma GD: ";

    let currCode = 'VND';
    let vnp_Params = {};
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = payment_message + orderId  + " email: " + email + " ngay: "+ date_payment  ;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }
    console.log(">>>>>>>>>>>>>>>", vnp_Params.vnp_OrderInfo);
    vnp_Params = sortObject(vnp_Params);
    //console.log(vnp_Params);
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    //
    console.log("<<<<<<<<<<<>>>>>>>>>>>", vnpUrl, "fdfdfs");
    //res.redirect(vnpUrl);
    res.status(200).json({ redirectUrl: vnpUrl });
};




const vnp_Return = async (req, res) => {
    let vnp_Params = req.query;
    const vnp_TransactionStatus = vnp_Params['vnp_TransactionStatus'];
    console.log(vnp_TransactionStatus);
    const amount = vnp_Params['vnp_Amount'] / 100;

    const order_inf = vnp_Params['vnp_OrderInfo'];
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

//vnp_TransactionStatus
   
  
const htmlReportTrue = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EOS PAYMENT RESULT</title>
        <style>
            body {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                height: 100vh;
margin: 0;
font-family: 'Arial', sans-serif;
                background-color: #f4f4f4;
            }
    
            div {
                text-align: center;
            }
    
            h1, p {
                margin: 0;
            }
    
            h1 {
                color: #333;
                font-size: 2em;
                margin-bottom: 10px;
            }
    
            p {
                color: #666;
                font-size: 1.2em;
                margin-bottom: 20px; /* Khoảng cách dưới cùng */
            }
    
            a {
                text-decoration: none; /* Loại bỏ đường gạch chân mặc định của liên kết */
                color: #007bff; /* Màu liên kết */
            }
    
            button {
                padding: 10px 20px;
                font-size: 1.2em;
                background-color: #007bff;
                color: #fff;
                border: none;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>EVENT ORGANIZATION SYSTEM</h1>
            <p>Thanh Toán Thành Công!</p>
            <p>Trân trọng Cảm ơn Quý Khách đã sử dụng dịch vụ của chúng tôi</p>
            <p>Mai iu <3</p>
 
        </div>
    </body>
    </html>
    
    `;
    if(vnp_TransactionStatus == '00'){
        const qlt = await TicketService.getTicketDetails(ticket_id);
        let quantity = qlt.quantity - 1;
        const tk = await TicketService.updateTicket(ticket_id, {quantity})
        const tp = await TicketPayment.createPayment(user_id,event_id, ticket_id);
        res.send(htmlReportTrue);
        return;
    }else{
        res.status(400).json({message: "thanh toan that bai"});
        return;
    }

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        //res.render('success', {code: vnp_Params['vnp_ResponseCode']})
        res.setHeader('Content-Type', 'text/html');
        
    } else {
        res.render('success', { code: '97' })
    }
}
const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};

module.exports = {

    createPayment,
    vnp_Return
};