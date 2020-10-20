using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Threading.Tasks;
using Microsoft.Owin.Security.Notifications;
using System.Web.Http;
using Microsoft.Owin.Builder;

[assembly: OwinStartup(typeof(UAM.Startup))]

namespace UAM
{
    public partial class Startup
    {
       public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            HttpConfiguration config = new HttpConfiguration();

            ConfigureAuth(app);

            WebApiConfig.Register(config);

            app.UseWebApi(config);
            

        }
    }
}
