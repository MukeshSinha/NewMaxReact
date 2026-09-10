using System;

namespace NewMaxReact.Models
{
    public class DojoCriteriaModel
    {
        public int TestID { get; set; }
        public string TestName { get; set; } = string.Empty;
        public int PassScore { get; set; }
        public int DurationMins { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class DojoResultModel
    {
        public string CertNo { get; set; } = string.Empty;
        public string TraineeName { get; set; } = string.Empty;
        public string Score { get; set; } = string.Empty;
        public string IssueDate { get; set; } = string.Empty;
        public string Status { get; set; } = "Passed";
    }

    public class DojoTraineeModel
    {
        public string TraineeCode { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Contractor { get; set; } = string.Empty;
        public string TargetDept { get; set; } = string.Empty;
        public string TrainingStatus { get; set; } = "Enrolled";
    }
}
