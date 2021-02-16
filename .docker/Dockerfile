FROM prestashop/base:5.6-apache
LABEL maintainer="PrestaShop Core Team <coreteam@prestashop.com>"

ARG PS_VERSION

# Get PrestaShop
ADD https://www.prestashop.com/download/old/prestashop_${PS_VERSION}.zip /tmp/prestashop.zip

# Get Autoupgrade module
ADD https://api-addons.prestashop.com/?method=module&id_module=5496 /tmp/autoupgrade.zip

# Extract PS
RUN mkdir -p /tmp/data-ps \
	&& unzip -q /tmp/prestashop.zip -d /tmp/data-ps/ \
	&& bash /tmp/ps-extractor.sh /tmp/data-ps \
	&& rm /tmp/prestashop.zip

# Extract Autoupgrade module
RUN unzip -q /tmp/autoupgrade.zip -d /var/www/html/modules/ \
	&& rm /tmp/autoupgrade.zip

# Give permissions
RUN chmod 777 -R /var/www/html
