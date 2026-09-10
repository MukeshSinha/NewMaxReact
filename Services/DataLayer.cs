using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.IO;

namespace NewMaxReact.Services
{
    public class DataLayer
    {
        public IConfiguration GetConfiguration()
        {
            var basePath = Directory.GetCurrentDirectory();
            if (!File.Exists(Path.Combine(basePath, "appsettings.json")))
            {
                basePath = AppContext.BaseDirectory;
            }
            var builder = new ConfigurationBuilder().SetBasePath(basePath).AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            return builder.Build();
        }

        public static SqlParameter AddParameter(string ParameterName, Object value, SqlDbType dbType, int size = 50)
        {
            SqlParameter Param = new SqlParameter();
            Param.ParameterName = ParameterName;
            Param.Value = value ?? DBNull.Value;
            Param.SqlDbType = dbType;
            Param.Size = size;
            Param.Direction = ParameterDirection.Input;

            return Param;
        }

        public static SqlParameter AddParameterStructure(string ParameterName, Object value, SqlDbType dbType)
        {
            SqlParameter Param = new SqlParameter();
            Param.ParameterName = ParameterName;
            Param.Value = value ?? DBNull.Value;
            Param.SqlDbType = SqlDbType.Structured;
            Param.Direction = ParameterDirection.Input;

            return Param;
        }

        public static DataTable ExecuteDbProcedure(string ParameterName, SqlParameter[] param)
        {
            DataLayer db = new DataLayer();
            var config = db.GetConfiguration();
            SqlConnection con = new SqlConnection();
            string connStr = config.GetSection("ConnectionStrings")?.GetSection("DefaultConnectionString")?.Value
                          ?? config.GetSection("ConnectionStrings")?.GetSection("DefaultConnection")?.Value
                          ?? "Data Source=172.28.2.237;Initial Catalog=MaxpayContractor;User ID=sa;Password=maxpay;";
            con.ConnectionString = connStr;

            SqlCommand Cmd = new SqlCommand();
            Cmd.Connection = con;

            Cmd.Parameters.AddRange(param);
            Cmd.CommandText = ParameterName;
            Cmd.CommandType = CommandType.StoredProcedure;
            Cmd.CommandTimeout = 180;

            SqlDataAdapter Da = new SqlDataAdapter(Cmd);
            DataTable Dtbl = new DataTable();

            try
            {
                con.Open();
                Da.Fill(Dtbl);
                con.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.GetType().Name);
                Console.WriteLine(ex.Message);
            }

            finally
            {
                Da.Dispose();
                con.Dispose();
                Cmd.Parameters.Clear();
                Cmd.Dispose();

            }

            return Dtbl;

        }

        public static DataTable ExecuteDbQuery(string sqlQuery)
        {
            DataLayer db = new DataLayer();
            var config = db.GetConfiguration();
            SqlConnection con = new SqlConnection();
            string connStr = config.GetSection("ConnectionStrings").GetSection("DefaultConnectionString")?.Value
                          ?? config.GetSection("ConnectionStrings").GetSection("DefaultConnection")?.Value
                          ?? "";
            con.ConnectionString = connStr;

            SqlCommand Cmd = new SqlCommand(sqlQuery, con);
            Cmd.CommandType = CommandType.Text;
            Cmd.CommandTimeout = 180;

            SqlDataAdapter Da = new SqlDataAdapter(Cmd);
            DataTable Dtbl = new DataTable();

            try
            {
                con.Open();
                Da.Fill(Dtbl);
                con.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                Da.Dispose();
                con.Dispose();
                Cmd.Dispose();
            }

            return Dtbl;
        }
    }

    public class Data : DataLayer
    {
    }
}
