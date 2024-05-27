var DataTypes = require("sequelize").DataTypes;
var _QrCode = require("./qr_code");
var _Account = require("./account");
var _Area = require("./area");
var _Attendance = require("./attendance");
var _Comment = require("./comment");
var _Event = require("./event");
var _Groups = require("./groups");
var _Member = require("./member");
var _Roles = require("./roles");
var _Schedule = require("./schedule");
var _Ticket = require("./ticket");
var _TicketPayment = require("./ticket_payment");
var _Users = require("./users");

function initModels(sequelize) {
  var QrCode = _QrCode(sequelize, DataTypes);
  var Account = _Account(sequelize, DataTypes);
  var Area = _Area(sequelize, DataTypes);
  var Attendance = _Attendance(sequelize, DataTypes);
  var Comment = _Comment(sequelize, DataTypes);
  var Event = _Event(sequelize, DataTypes);
  var Groups = _Groups(sequelize, DataTypes);
  var Member = _Member(sequelize, DataTypes);
  var Roles = _Roles(sequelize, DataTypes);
  var Schedule = _Schedule(sequelize, DataTypes);
  var Ticket = _Ticket(sequelize, DataTypes);
  var TicketPayment = _TicketPayment(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);

  Users.belongsTo(Account, { as: "email_account", foreignKey: "email"});
  Account.hasMany(Users, { as: "users", foreignKey: "email"});
  QrCode.belongsTo(Area, { as: "area", foreignKey: "area_id"});
  Area.hasMany(QrCode, { as: "QR_codes", foreignKey: "area_id"});
  Attendance.belongsTo(Area, { as: "area", foreignKey: "area_id"});
  Area.hasMany(Attendance, { as: "attendances", foreignKey: "area_id"});
  QrCode.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(QrCode, { as: "QR_codes", foreignKey: "event_id"});
  Area.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(Area, { as: "areas", foreignKey: "event_id"});
  Attendance.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(Attendance, { as: "attendances", foreignKey: "event_id"});
  Comment.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(Comment, { as: "comments", foreignKey: "event_id"});
  Schedule.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(Schedule, { as: "schedules", foreignKey: "event_id"});
  Ticket.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(Ticket, { as: "tickets", foreignKey: "event_id"});
  TicketPayment.belongsTo(Event, { as: "event", foreignKey: "event_id"});
  Event.hasMany(TicketPayment, { as: "ticket_payments", foreignKey: "event_id"});
  Event.belongsTo(Groups, { as: "group", foreignKey: "group_id"});
  Groups.hasMany(Event, { as: "events", foreignKey: "group_id"});
  Member.belongsTo(Groups, { as: "group", foreignKey: "group_id"});
  Groups.hasMany(Member, { as: "members", foreignKey: "group_id"});
  Account.belongsTo(Roles, { as: "role", foreignKey: "role_id"});
  Roles.hasMany(Account, { as: "accounts", foreignKey: "role_id"});
  TicketPayment.belongsTo(Ticket, { as: "ticket", foreignKey: "ticket_id"});
  Ticket.hasMany(TicketPayment, { as: "ticket_payments", foreignKey: "ticket_id"});
  Attendance.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Attendance, { as: "attendances", foreignKey: "user_id"});
  Comment.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Comment, { as: "comments", foreignKey: "user_id"});
  Event.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Event, { as: "events", foreignKey: "user_id"});
  Groups.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Groups, { as: "groups", foreignKey: "user_id"});
  Member.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(Member, { as: "members", foreignKey: "user_id"});
  TicketPayment.belongsTo(Users, { as: "user", foreignKey: "user_id"});
  Users.hasMany(TicketPayment, { as: "ticket_payments", foreignKey: "user_id"});

  return {
    QrCode,
    Account,
    Area,
    Attendance,
    Comment,
    Event,
    Groups,
    Member,
    Roles,
    Schedule,
    Ticket,
    TicketPayment,
    Users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
