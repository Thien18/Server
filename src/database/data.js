const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./DATABASE.db', sqlite3.OPEN_READWRITE, (err) =>{
    if(err) return console.error(err.message);
})
// sql = 
// `CREATE TABLE roles (
//     id varchar(50) Primary Key,
//     name varchar(20) NOT NULL
// );

// `;
sql = `CREATE TABLE schedule (
    id VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(100),
    event_id VARCHAR(50),
    start_date DATETIME,
    end_date DATETIME,
    description NVARCHAR(500),
    
     CONSTRAINT fk_event_id_schedule FOREIGN KEY (event_id) REFERENCES event(id)
    );`

sql = `ALTER TABLE event 
ADD COLUMN status BOOLEAN DEFAULT FALSE`
sql = `ALTER TABLE attendance 
ADD COLUMN device_code NVARCHAR(100)`
    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "schedule" created successfully.');
        }
    });

// sql = `INSERT INTO roles (id, name) VALUES
// ('1', 'Admin'),
// ('2', 'User');`
/*
CREATE TABLE account (
    email VARCHAR(50) PRIMARY KEY,
    password VARCHAR(20),
    role_id VARCHAR(50),
    phone_number VARCHAR(20),
    refreshToken VARCHAR(255),
 	passwordChangedAt VARCHAR(255),
 	otpCode VARCHAR(10),
	passwordResetToken VARCHAR(255),
	 passwordResetExpires VARCHAR(255),
	 status BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50),
    address NVARCHAR(255),
    name NVARCHAR(50),
    gender VARCHAR(5),
    CONSTRAINT fk_email FOREIGN KEY (email) REFERENCES account(email)
);
CREATE TABLE groupp (
    id VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(50),
    user_id VARCHAR(255),
    
    CONSTRAINT fk_user_id_group FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE member (
    id VARCHAR(50) PRIMARY KEY,
    group_id VARCHAR(50),
    user_id VARCHAR(255),


    CONSTRAINT fk_group_id_member FOREIGN KEY (group_id) REFERENCES groupp(id),
    CONSTRAINT fk_user_id_member FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE event (
    id VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(50),
    user_id VARCHAR(50),
    group_id VARCHAR(50),
    start_date DATETIME,
    end_date DATETIME,
    description NVARCHAR(500),
    event_type NVARCHAR(100),
    location NVARCHAR(50),
    is_ticket BOOLEAN DEFAULT FALSE,


    CONSTRAINT fk_user_id_event FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_group_id_event FOREIGN KEY (group_id) REFERENCES groupp(id)
);
CREATE TABLE ticket (
    id VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(50),
    price DECIMAL(18,0),
    event_id VARCHAR(50),
    CONSTRAINT fk_event_id_ticket FOREIGN KEY (event_id) REFERENCES event(id)
);
CREATE TABLE area (
    id VARCHAR(50) PRIMARY KEY,
    name NVARCHAR(50),
    event_id VARCHAR(50),
    start_date DATETIME,
    end_date DATETIME,
    description NVARCHAR(500),
    
    CONSTRAINT fk_event_id_area FOREIGN KEY (event_id) REFERENCES event(id)
);
CREATE TABLE comment (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    event_id VARCHAR(50),
    content NVARCHAR(500),
    CONSTRAINT fk_user_id_comment FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_event_id_comment FOREIGN KEY (event_id) REFERENCES event(id)
);
CREATE TABLE ticket_payment (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    event_id VARCHAR(50),
    is_status BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_id_payment FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_event_id_payment FOREIGN KEY (event_id) REFERENCES event(id)
);
CREATE TABLE attendance (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    event_id VARCHAR(50),
    area_id VARCHAR(50),
    location NVARCHAR(50),
    is_status BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user_id_attendance FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_event_id_attendance FOREIGN KEY (event_id) REFERENCES event(id),
    CONSTRAINT fk_area_id_attendance FOREIGN KEY (area_id) REFERENCES area(id)


);

*/ 
// sql = `

















// CREATE TABLE QR_code (
//     id VARCHAR(50) PRIMARY KEY,
    
//     event_id VARCHAR(50),
//     area_id VARCHAR(50),
//     code NVARCHAR(100),
   
//     CONSTRAINT fk_event_id_QR FOREIGN KEY (event_id) REFERENCES event(id),
//     CONSTRAINT fk_area_id_QR FOREIGN KEY (area_id) REFERENCES area(id)


// );
// `;
// db.all("select * from roles", [], (err, rows) => {
//     if (err) return console.error(err.message);
//     rows.forEach((row) => {
//       console.log(row);
//     });
// });
// db.run(`









// CREATE TABLE QR_code (
//     id VARCHAR(50) PRIMARY KEY,
    
//     event_id VARCHAR(50),
//     area_id VARCHAR(50),
//     code NVARCHAR(100),
   
//     CONSTRAINT fk_event_id_QR FOREIGN KEY (event_id) REFERENCES event(id),
//     CONSTRAINT fk_area_id_QR FOREIGN KEY (area_id) REFERENCES area(id)


// );`);