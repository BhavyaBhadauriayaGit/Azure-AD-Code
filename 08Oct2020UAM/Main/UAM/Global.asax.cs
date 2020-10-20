using System;
using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace UAM
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            System.Net.ServicePointManager.ServerCertificateValidationCallback +=
                (se, cert, chain, sslerror) => true;
        }

        /// <summary>
        /// To method call during the http request
        /// </summary>
        protected void Application_BeginRequest()
        {
            Response.AddHeader("Access-Control-Allow-Origin", "*");
            if (Request.Headers.AllKeys.Contains("Origin", StringComparer.CurrentCultureIgnoreCase)
                && Request.HttpMethod == "OPTIONS")
            {
                Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Pragma, Cache-Control, Authorization ");
                Response.End();
            }
        }
    }
}
