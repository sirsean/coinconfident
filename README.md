# CoinConfident

This is an app that shows you your Coinbase transactions, with their USD value _at the time_ as well as _right now_.

This allows you to see a quick summary of how much money you have spent in Bitcoins, and what that money has been worth over time.

# Development

Compile and run the server:

```
go build
./coinconfident
```

Build the JSX:

```
jsx src/ build
```

Keep the JSX building:

```
./watch-jsx.sh
```

Build the app:

```
./build.sh
```

Keep the app building:

```
./watch-build.sh
```

**Note:** You'll need to run all three of those in separate Terminals, since they run in the foreground.

# Deployment

To deploy the backend, you will need to compile it for your production environment and upload the executable file and the template files to the server.

## /etc/coinconfident/coinconfident.gcfg

[Coinbase]
clientkey = XYZ
clientsecret = ABC
[Redis]
host = localhost
port = 6379
[Host]
port = :4444
path = /path/to/coinconfident
host = coinconfident.dev:1111

## systemd config

Edit `/lib/systemd/system/coinconfident.service`:

```
[Unit]
Description=coinconfident web service
After=syslog.target network.target

[Service]
Type=simple
ExecStart=/path/to/coinconfident/coinconfident.linux

[Install]
WantedBy=multi-user.target
```

Then, make a symbolic link:

```
ln -s /lib/systemd/system/coinconfident.service /etc/systemd/system/coinconfident.service
```

And start/enable your service:

```
systemctl start coinconfident.service
systemctl enable coinconfident.service
```

## compile/upload/deploy script

I deploy with a script like this:

```
echo "Compiling"
cd coinconfident; GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o coinconfident.linux; cd ..
echo "Uploading"
pwd
tar cvf coinconfident.tar coinconfident/coinconfident.linux coinconfident/template coinconfident/static
ssh -l sirsean coinconfident.com mkdir -p coinconfident
ssh -l sirsean coinconfident.com rm coinconfident/coinconfident.linux
scp coinconfident.tar sirsean@coinconfident.com:coinconfident.tar
ssh -l sirsean coinconfident.com tar xvf coinconfident.tar
echo "Restarting"
ssh -l root coinconfident.com systemctl restart coinconfident.service
echo "Deployed"

```

Note that you will need to set up your system to cross-compile for your target environment. (I deploy to a 64-bit Linux server.)

