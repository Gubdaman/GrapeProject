using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GrapeProject.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int UserID { get; set; }
        public string EmailAddress { get; set; }
        public string HashedPassword { get; set; }
        public virtual List<ChatSession> Sessions { get; set; }
    }
}