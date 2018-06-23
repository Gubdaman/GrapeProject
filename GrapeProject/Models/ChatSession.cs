using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GrapeProject.Models
{
    [Table("ChatSessions")]
    public class ChatSession
    {
        [Key]
        public int SessionID { get; set; }
        public virtual User User { get; set; }
        public int ClientID { get; set; }
        public bool IsClosed { get; set; }
        public virtual List<Log> Logs { get; set; }
    }
}