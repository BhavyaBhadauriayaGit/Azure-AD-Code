using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using UAM.DL;

namespace UAM.Controllers
{
  
    [RoutePrefix("api/details")]
    public class DetailController : ApiController
    {
      
        [Route("Details")]
        public HttpResponseMessage Get()
        {
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, "Value1");
            return response;
        }

    }
}

    


