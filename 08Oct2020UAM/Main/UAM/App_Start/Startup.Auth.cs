using System;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Owin;
using UAM.Providers;
using UAM.Models;
using System.Configuration;
using Microsoft.Owin;
using Microsoft.Owin.Security.ActiveDirectory;
using Owin;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Http;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using System.Web.Configuration;
using Microsoft.IdentityModel.Tokens;
using UAM.App_Start;
using System.IdentityModel.Tokens.Jwt;

namespace UAM
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }
        private static string clientId = ConfigurationManager.AppSettings["clientId"];
        App_Start.OpenIdConnectSecurityTokenProvider obj;
        public static string PublicClientId { get; private set; }

        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromHours(5),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true,
                RefreshTokenProvider = new ApplicationRefreshOAuthProvider()
            };

            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            
        }


    }
}
