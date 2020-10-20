using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace UAM.Service
{
    public class ShaSaltService
    {
        readonly byte[] _salt =new byte[16];
        private readonly RNGCryptoServiceProvider _cSProvider = new RNGCryptoServiceProvider();

        public void ShaSaltGeneration()
        {
            _cSProvider.GetBytes(_salt);
        }

        public string[] Sha256PasswordSaltHash(string password)
        {
            ShaSaltGeneration();
            SHA256CryptoServiceProvider provider = new SHA256CryptoServiceProvider();
            byte[] passwordbyte = Encoding.Unicode.GetBytes(password);
            byte[] saltByte = _salt;
            byte[] output = provider.ComputeHash(passwordbyte.Concat(saltByte).ToArray());
            byte[] hashBytes = new byte[48];
            Array.Copy(_salt, 0, hashBytes, 0, 16);
            Array.Copy(output, 0, hashBytes, 16, 32);
            string savedPasswordHash = Convert.ToBase64String(hashBytes);
            string hashString = Convert.ToBase64String(output);
            string[] response = new String[] { hashString, savedPasswordHash };
            return response;
        }

        public bool Sha256VerifyPassword(string passwordHash, string password)
        {
            byte[] passwordbyte = Encoding.Unicode.GetBytes(password);
            
            //Extracting the Salt from the stored Hash Password
            SHA256CryptoServiceProvider provider = new SHA256CryptoServiceProvider();
            byte[] hashBytes = Convert.FromBase64String(passwordHash);
            byte[] saltvalue = new byte[16];
            Array.Copy(hashBytes, 0, saltvalue, 0, 16);

            //Concatenate the User provided password with the Salt and create the Hash
            byte[] output = provider.ComputeHash(passwordbyte.Concat(saltvalue).ToArray());
            string hashString = Convert.ToBase64String(output);

            //Now extract the existing stored password hash from the hashBytes
            byte[] dBPasswordSalt = new byte[32];
            Array.Copy(hashBytes,16,dBPasswordSalt, 0,32);
            string dBPasswordSaltString = Convert.ToBase64String(dBPasswordSalt);

            if (hashString == dBPasswordSaltString)
                return true;

            return false;
        }



    }
}
