using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using System.Web;
using UAM.BO;
using UAM.Models;
using UAM.Service;
namespace UAM.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;
        

        public ApplicationOAuthProvider(string publicClientId)
        {
            if (publicClientId == null)
            {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
           
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //Commented the below one line after the review from Resharper 
            //todo
          //  var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();
            //doto
         //   ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);
            
            UserAuthenticationService uAuthService =  new UserAuthenticationService();
            UserBo uBo = uAuthService.LoginValidation(context.UserName, context.Password);
            UserService userService = new UserService();
            if (uBo == null)
            {
                UserBo invalidUserBo = userService.GetUserByEmailId(context.UserName, false);
                context.SetError("invalid_grant", "The user name or password is incorrect. Login Counter:"+invalidUserBo.LoginCounter ); // included the login counter in msg
                return;
            }

            UserService usrService = new UserService();
            int noOfLoggedInUsers = usrService.GetNoOfLoggedInUsers();
            if (noOfLoggedInUsers > 25)
            {
                context.SetError("invalid_grant", "Maximum users reached");
                return;
            }
            //todo
            var claims = new List<Claim>();
            ClaimsIdentity oAuthClaimIdentity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
            ClaimsIdentity cookiesClaimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationType);

            //if (uBo.IsLocked == true)
            //{
            //    context.SetError("invalid_grant", "User Account Locked. Login Counter:" + uBo.LoginCounter);
            //    return;
            //}

            string role = (uBo.RoleId==1) ? "Super User" :
                (uBo.RoleId==2) ? "Customer User" : "Anonymous User";
            ClaimsIdentity oAuthIdentity = new ClaimsIdentity(context.Options.AuthenticationType);
          
            oAuthIdentity.AddClaim(new Claim(ClaimTypes.Email, role));
          //  oAuthIdentity.AddClaim(new Claim((ClaimTypes.Role, role));

            IPrincipal principal = new GenericPrincipal(new GenericIdentity("User"),role.Split(','));
            HttpContext.Current.User = principal;

            AuthenticationProperties properties = CreateProperties(uBo.RoleId.ToString());


            //AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
          


            context.Validated(ticket);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // Resource owner password credentials does not provide a client ID.
            if (context.ClientId == null)
            {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
        {
            if (context.ClientId == _publicClientId)
            {
                Uri expectedRootUri = new Uri(context.Request.Uri, "/");

                if (expectedRootUri.AbsoluteUri == context.RedirectUri)
                {
                    context.Validated();
                }
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string roleId)
        {
            //string roleName = roleId.Equals("1") ? "Super User" : roleId.Equals("2") ? "Customer User": "No Access";
            IDictionary<string, string> data = new Dictionary<string, string>();
            return new AuthenticationProperties(data);
        }
    }
}