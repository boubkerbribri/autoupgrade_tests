FROM prestashop/base:7.1-apache
LABEL maintainer="PrestaShop Core Team <coreteam@prestashop.com>"

ARG PS_VERSION

# Get PrestaShop
ADD https://www.prestashop.com/download/old/prestashop_${PS_VERSION}.zip /tmp/prestashop.zip

RUN mkdir -p /var/www/html
RUN chmod 777 -R /var/www/html

# Extract
RUN mkdir -p /tmp/data-ps \
	&& unzip -q /tmp/prestashop.zip -d /tmp/data-ps/ \
	&& bash /tmp/ps-extractor.sh /tmp/data-ps \
	&& rm /tmp/prestashop.zip