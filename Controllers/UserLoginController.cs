using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewMaxReact.Models;
using NewMaxReact.Services;

namespace NewMaxReact.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserLoginController : Controller
    {
        private readonly IUserManage _user;

        public UserLoginController(IUserManage user)
        {
            _user = user;
        }

        [HttpGet("Login")]
        public IActionResult Login()
        {
            return Ok();
        }

        [HttpPost("VerifyUser")]
        [HttpPost("login")]
        public IActionResult VerifyUser([FromBody] userInfo userlogin)
        {
            var res = _user.verifyUser(userlogin ?? new userInfo());
            UserRole userRole = new UserRole()
            {
                RoleID = res.RoleID,
                UserID = res.UserID
            };
            ViewData["UserName"] = userlogin?.username;
            HttpContext.Session.SetInt32("UserID", userRole.UserID);
            HttpContext.Session.SetString("Username", userlogin.username);
            HttpContext.Session.SetInt32("RoleID", userRole.RoleID);
            return new JsonResult(res);
        }

        [HttpGet("ChangePassword")]
        public ActionResult ChangePassword()
        {
            return Ok();
        }

        [HttpPost("ChangePasswordConfirmation")]
        [HttpPost("changepassword")]
        public ActionResult ChangePasswordConfirmation([FromBody] userInfo usr)
        {
            userInfo uinfo = new userInfo()
            {
                username = HttpContext.Session.GetString("Username"),
                password = usr?.password
            };

            return new JsonResult(_user.UpdatePassword(uinfo));
        }

        [HttpGet("GetSessionUser")]
        public IActionResult GetSessionUser()
        {
            var username = HttpContext.Session.GetString("Username") ?? "AdminUser";
            var roleId = HttpContext.Session.GetInt32("RoleID") ?? 1;
            return new JsonResult(new { username = username, roleId = roleId });
        }
    }
}
