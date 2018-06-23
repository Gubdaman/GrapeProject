using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace GrapeProject.Models
{
    [Table("Logs")]
    public class Log
    {
        public DateTime TimeStamp { get; set; }
        public int FromID { get; set; }
        public int ToID { get; set; }
        public string Text { get; set; }
        [Key]
        public int ID { get; set; }
        public virtual ChatSession Session { get; set; }
    }
}