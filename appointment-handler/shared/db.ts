import mysql from "mysql2/promise";

const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};

export async function insertAppointment(appointment: any) {
  const connection = await mysql.createConnection(connectionConfig);
  const query = "INSERT INTO appointments SET ?";
  await connection.execute(query, [appointment]);
  await connection.end();
}
