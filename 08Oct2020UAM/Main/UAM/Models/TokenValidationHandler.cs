
using Microsoft.Ajax.Utilities;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using UAM.DL;

namespace UAM.Models
{
    public class TokenValidationHandler : DelegatingHandler
    {
        private static string clientId = ConfigurationManager.AppSettings["ClientId"];
       
        private static bool TryRetrieveToken(HttpRequestMessage request, out string token)
        {
            token = null;
            IEnumerable<string> authzHeaders;
            if (!request.Headers.TryGetValues("Authorization", out authzHeaders) || authzHeaders.Count() > 1)
            {
                return false;
            }
            var bearerToken = authzHeaders.ElementAt(0);
            token = bearerToken.StartsWith("Bearer ") ? bearerToken.Substring(7) : bearerToken;
            return true;
        }

        protected override  Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            HttpStatusCode statusCode;
            string token;

            //determine whether a jwt exists or not
            if (!TryRetrieveToken(request, out token))
            {
                statusCode = HttpStatusCode.Unauthorized;
                //allow requests with no token - whether a action method needs an authentication can be set with the claimsauthorization attribute
                //return base.SendAsync(request, cancellationToken);
                return Task<HttpResponseMessage>.Factory.StartNew(() => new HttpResponseMessage(statusCode) { });
            }

            try
            {
                const string sec = "401b09eab3c013d4ca54922bb802bec8fd5318192b0a75f201d8b3727429090fb337591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";
                var now = DateTime.UtcNow;
                var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(sec)) ;
                TokenValidationParameters validationParameters = new TokenValidationParameters()
                {
                    ValidAudiences = new[] { clientId, $"api://{clientId}" },
                    ValidIssuer = "http://localhost:4200",
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.FromMinutes(10),
                    IssuerSigningKey = securityKey,
                    ValidateIssuer = true,
                };
                var stream = token;
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(stream);
                var tokenS = handler.ReadToken(stream) as JwtSecurityToken;
                var emailId = tokenS.Claims.First(claim => claim.Type == "preferred_username").Value;
                GetAuthenticatedUserByEmailId(emailId);

                return base.SendAsync(request, cancellationToken);
                
            }
            catch (SecurityTokenValidationException e)
            {
                statusCode = HttpStatusCode.Unauthorized;
            }
            catch (Exception ex)
            {
                statusCode = HttpStatusCode.InternalServerError;
            }
            return Task<HttpResponseMessage>.Factory.StartNew(() => new HttpResponseMessage(statusCode) { });
        }
        public string GetAuthenticatedUserByEmailId(string email)
        {
            string constring = ConfigurationManager.ConnectionStrings["VTDatabasePath"].ConnectionString;
            SqlConnection con = new SqlConnection(constring);
            SqlCommand cmd = new SqlCommand("SELECT count(*) FROM User WHERE Email = '" + email + "'", con);
            string iemail = cmd.ExecuteScalar().ToString();
            if (iemail == "0")
            {
                return "User Email does not exists in the database";
            }

            else
            {
                return iemail;
            }
        }

        public bool LifetimeValidator(DateTime? notBefore, DateTime? expires, SecurityToken securityToken, TokenValidationParameters validationParameters)
        {
            if (expires != null)
            {
                if (DateTime.UtcNow < expires)
                    return true;
            }
            return false;
        }
       


    }
}
