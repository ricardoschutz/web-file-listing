# Web File Listing
Simple web app for listing files. AngularJS, Python.

Useful if you need a page to display files from your web server and you don't like the interface of apache's index listing.

## Installing
You need apache (or other web server of your liking) and python.
```
cd /var/www
git clone https://github.com/ricardoschutz/web-file-listing.git
```

Enable cgi. I know that's not the correct way of using python for web, but the goal is to be quick.
```
a2enmod cgi
```

Set up your virtual server.
```
vi /etc/apache2/sites-available/web-file-listing.conf
```

```
<VirtualHost *:80>

  # Change to your needs
	ServerName download.example.com
	ServerAdmin ricardo.schutz@gmail.com
	DocumentRoot /var/www/web-file-listing
	ErrorLog ${APACHE_LOG_DIR}/web-file-listing-error.log
	CustomLog ${APACHE_LOG_DIR}/web-file-listing-access.log combined
  
	DirectoryIndex index.html
	FallbackResource /index.html
	
  <Directory /var/www/web-file-listing/>
		Options +ExecCGI
		AddHandler cgi-script .py
	</Directory>
  
</VirtualHost>
```

Enable and reload.
```
a2ensite web-file-listing
apachectl -k graceful
```
