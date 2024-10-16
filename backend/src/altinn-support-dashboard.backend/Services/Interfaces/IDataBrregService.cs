﻿using altinn_support_dashboard.Server.Models;

namespace altinn_support_dashboard.Server.Services.Interfaces
{
    public interface IDataBrregService
    {
        Task<ErRollerModel> GetRolesAsync(string orgNumber, string environmentName);
        Task<UnderenhetRootObject> GetUnderenheter(string orgNumber, string environmentName);
    }
}
