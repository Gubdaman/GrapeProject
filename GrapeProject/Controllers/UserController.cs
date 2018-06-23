using GrapeProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GrapeProject.Controllers
{
    public class UserController : Controller
    {
        private Db db = new Db();
        
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Registration()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Employee()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Register(User user)
        {
            if (ModelState.IsValid)
            {
                db.Users.Add(user);
                db.SaveChanges();
                return View("Employee", user);
            }

            return View("Registration", user);
        }

        [HttpPost]
        public ActionResult Login(User user)
        {
            if (ModelState.IsValid)
            {
                var dbUser = db.Users.Where(t => t.EmailAddress == user.EmailAddress && t.HashedPassword == user.HashedPassword).FirstOrDefault();
                if(dbUser != null)
                {
                    return View("Employee", dbUser);
                }
            }

            return View("Login", user);
        }

    }
}