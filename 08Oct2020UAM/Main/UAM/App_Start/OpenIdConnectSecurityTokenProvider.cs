using System.Collections.Generic;
using System.Configuration;
using System.IdentityModel.Tokens;
using System.Threading;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.Owin.Security.Jwt;

namespace UAM.App_Start
{
    public class OpenIdConnectSecurityTokenProvider 
    {
        public ConfigurationManager<OpenIdConnectConfiguration> ConfigManager;
        private string _issuer;
        private IEnumerable<SecurityToken> _tokens;
        private readonly string _metadataEndpoint;

        private readonly ReaderWriterLockSlim _synclock = new ReaderWriterLockSlim();

        public OpenIdConnectSecurityTokenProvider(string metadataEndpoint)
        {
            _metadataEndpoint = metadataEndpoint;
             ConfigManager = new ConfigurationManager<OpenIdConnectConfiguration>(metadataEndpoint,new OpenIdConnectConfigurationRetriever());
            // ConfigurationManager<OpenIdConnectConfiguration> configManager = new ConfigurationManager<OpenIdConnectConfiguration>(stsDiscoveryEndpoint, new OpenIdConnectConfigurationRetriever());
            RetrieveMetadata();
        }

        /// <summary>
        /// Gets the issuer the credentials are for.
        /// </summary>
        /// <value>
        /// The issuer the credentials are for.
        /// </value>
        public string Issuer
        {
            get
            {
                RetrieveMetadata();
                _synclock.EnterReadLock();
                try
                {
                    return _issuer;
                }
                finally
                {
                    _synclock.ExitReadLock();
                }
            }
        }

        /// <summary>
        /// Gets all known security tokens.
        /// </summary>
        /// <value>
        /// All known security tokens.
        /// </value>
        public IEnumerable<SecurityToken> SecurityTokens
        {
            get
            {
                RetrieveMetadata();
                _synclock.EnterReadLock();
                try
                {
                    return _tokens;
                }
                finally
                {
                    _synclock.ExitReadLock();
                }
            }
        }

        private void RetrieveMetadata()
        {
            _synclock.EnterWriteLock();
            try
            {
                OpenIdConnectConfiguration config = ConfigManager.GetConfigurationAsync().Result;
                _issuer = config.Issuer;
             //  _tokens = config.SigningTokens;
            }
            finally
            {
                _synclock.ExitWriteLock();
            }
        }
    }
}
    
