FROM prestashop/base:7.1-apache
LABEL maintainer="PrestaShop Core Team <coreteam@prestashop.com>"

ARG PS_VERSION

# Get PrestaShop
ADD https://www.prestashop.com/download/old/prestashop_${PS_VERSION}.zip /tmp/prestashop.zip

# Get Autoupgrade module
ADD https://api-addons.prestashop.com/?method=module&id_module=5496 /tmp/autoupgrade.zip

# Install php zip
RUN apt-get update -y \
    && apt-get install -y libzip-dev zip php7.1-zip \
    && docker-php-ext-configure zip --with-libzip \
    && docker-php-ext-install zip

# Extract PS
RUN mkdir -p /tmp/data-ps \
	&& unzip -q /tmp/prestashop.zip -d /tmp/data-ps/ \
	&& bash /tmp/ps-extractor.sh /tmp/data-ps \
	&& rm /tmp/prestashop.zip

# Create defines_custom.inc.php
RUN echo "<?php define('_PS_ADMIN_DIR_', 'admin-dev');" > /var/www/html/config/defines_custom.inc.php

# Extract Autoupgrade module
RUN unzip -q /tmp/autoupgrade.zip -d /var/www/html/modules/ \
	&& rm /tmp/autoupgrade.zip

# Give permissions
RUN chmod 777 -R /var/www/html
