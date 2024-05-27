const SequelizeAuto = require('sequelize-auto');

// Khởi tạo đối tượng SequelizeAuto với các thông số cần thiết
const auto = new SequelizeAuto('DATABASE', null, null, {
  dialect: 'sqlite', // Loại cơ sở dữ liệu (trong trường hợp này là SQLite)
  storage: './database/DATABASE.db', // Đường dẫn đến tệp cơ sở dữ liệu SQLite
  directory: './models', // Thư mục mà các models sẽ được tạo ra
  caseFile: 'l', // Kiểu chữ cho tên file (là snake_case)
  caseModel: 'p', // Kiểu chữ cho tên model (là PascalCase)
});

// Chạy quy trình tạo models
auto.run(function (err) {
  if (err) {
    console.error('Error occurred:', err);
  } else {
    console.log('Models were generated successfully!');
  }
});