using System;
using System.Collections.Generic;
using System.Data;
using UAM.BO;
using UAM.DL;

namespace UAM.Service
{
    public class RoleActivityService
    {
        private readonly RoleActivityEngine _roleActivityEngine = new RoleActivityEngine();
        public List<RoleActivityBo> GetRoleActivityRights(int roleId)
        {
            List<RoleActivityBo> lstRoleActivityBo = new List<RoleActivityBo>();
            try
            {
                UtilityService utilService = new UtilityService();
                DataTable dTable = _roleActivityEngine.GetRoleActivityRights(roleId);
                if (dTable != null)
                    lstRoleActivityBo = utilService.ConvertDataTableToRoleActivityBo(dTable);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return lstRoleActivityBo;
        }
        public List<RoleActivityBo> GetUserActivityRights(int userId)
        {
            List<RoleActivityBo> lstRoleActivityBo = new List<RoleActivityBo>();
            try
            {
                UtilityService utilService = new UtilityService();
                DataTable dTable = _roleActivityEngine.GetUserActivityRights(userId);
                if (dTable != null)
                {
                    lstRoleActivityBo = utilService.ConvertDataTableToRoleActivityBo(dTable);
                }

                //return lstRoleActivityBo;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }

            return lstRoleActivityBo;
        }

        public List<RoleBo> GetRole()
        {
            List<RoleBo> lstRoleBo = new List<RoleBo>();
            try
            {
                UtilityService utilService = new UtilityService();
                DataTable dTable = _roleActivityEngine.GetRole();
                if (dTable != null)
                    lstRoleBo = utilService.ConvertDataTableToRoleBo(dTable);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                
            }
            return lstRoleBo;
        }
    }
}