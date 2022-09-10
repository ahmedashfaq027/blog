# Generate keys
cd keys

echo "-----Generating private and public keys-----"
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem

openssl genrsa -out privater.pem 2048
openssl rsa -in privater.pem -outform PEM -pubout -out publicr.pem