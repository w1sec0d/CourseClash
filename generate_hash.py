import bcrypt

# Password to hash
password = "password123"

# Generate salt and hash
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode("utf-8"), salt)

print(f"Password: {password}")
print(f"Generated hash: {hashed.decode('utf-8')}")

# Verify the hash
if bcrypt.checkpw(password.encode("utf-8"), hashed):
    print("Hash verification successful!")
else:
    print("Hash verification failed!")
