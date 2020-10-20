using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Configuration;
//using System.Web.Mvc;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using UAM.Models;

namespace UAM.Controllers
{
    [RoutePrefix("api/Home")]
    public class HomeController : ApiController
    {
      
        [HttpGet]
        [Route("CultureInfo/{language}/{country}/{keyName}")]
        public IHttpActionResult GetCultureInfo(string language, string country, string keyName)
        {
            try
            {
                CultureInfo culture = new CultureInfo(language + "-" + country);
                Thread.CurrentThread.CurrentCulture = culture;
                Thread.CurrentThread.CurrentUICulture = culture;
                CultureInfo.DefaultThreadCurrentCulture = culture;
                CultureInfo.DefaultThreadCurrentUICulture = culture;

                return Ok(Properties.Resources.ResourceManager.GetObject(keyName));

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return InternalServerError();
            }


        }

    }
}

