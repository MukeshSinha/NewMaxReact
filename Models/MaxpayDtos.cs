using System;
using System.Collections.Generic;

namespace NewMaxReact.Models
{
    public class ManpowerSummaryDto
    {
        public int Regular { get; set; }
        public int Fot { get; set; }
        public int Toa { get; set; }
        public int RollReg { get; set; }
        public int RollFot { get; set; }
        public int RollToa { get; set; }
    }

    public class ContractorManpowerDto
    {
        public string Ezone { get; set; } = string.Empty;
        public int Regular { get; set; }
        public int Fot { get; set; }
        public int Toa { get; set; }
        public int Total { get; set; }
    }

    public class DeptManpowerDto
    {
        public string Dept { get; set; } = string.Empty;
        public int Regular { get; set; }
        public int Fot { get; set; }
        public int Toa { get; set; }
        public int Total { get; set; }
    }
}
