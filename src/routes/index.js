// Import các tệp route cho các bảng khác
const auth = require('./auth');
const user = require('./user_router');
const event = require('./event_router');
const group = require('./group_router');
const qr_code = require('./qr_code_router');
const ticket = require('./ticket_router');
const payment = require('./payment_router');
const area = require('./area_router');
const attendance = require('./attendance_router');
const schedule = require('./schedule_router');
const comment = require('./comment_router');
const chart = require('./chart_router')
const index = (app) => {
    app.use("/", area);
    app.use("/", attendance);
    app.use("/", schedule);
    app.use("/", auth);
    app.use("/", user);
    app.use("/",event);
    app.use("/", group);
    app.use("/",qr_code);
    app.use("/",ticket);
    app.use("/",payment);
    app.use("/",comment);
    app.use("/",chart)
};

module.exports = index;
