FROM prestashop/base:7.1-apache
LABEL maintainer="PrestaShop Core Team <coreteam@prestashop.com>"

ARG PS_VERSION

# Get PrestaShop
ADD https://www.prestashop.com/download/old/prestashop_${PS_VERSION}.zip /tmp/prestashop.zip

# Extract
RUN mkdir -p /var/www/html \
	&& unzip -q /tmp/prestashop.zip -d /var/www/html/ \
	&& bash /tmp/ps-extractor.sh /var/www/html \
	&& chmod 777 -R /var/www/html
	&& rm /tmp/prestashop.zip