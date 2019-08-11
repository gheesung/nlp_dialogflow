#
#--------------------------------------------------------------------------
# Install
#--------------------------------------------------------------------------
#

FROM php:7.0-fpm
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
        wget \
        git \
        vim \
        nginx \
        ca-certificates \
        supervisor \
        cron \
        unzip \
    && docker-php-ext-install -j$(nproc) iconv mcrypt \
        mbstring \
        mysqli \
        pdo_mysql \
        opcache \
    && docker-php-ext-configure gd \
    --with-gd \
    --with-freetype-dir=/usr/include/ \
    --with-png-dir=/usr/include/ \
    --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd \
    && ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && chown -R www-data:www-data /var/lib/nginx \
    && chown -R www-data:www-data /var/www \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer \
    && composer global require "hirak/prestissimo:^0.3" \
    && wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 \
    && mv cloud_sql_proxy.linux.amd64 /usr/bin/cloud_sql_proxy \
    && chmod +x /usr/bin/cloud_sql_proxy
#
#--------------------------------------------------------------------------
# Configuration
#--------------------------------------------------------------------------
#

ADD ./config/supervisord.conf.uat /etc/supervisord.conf

ADD ./config/nginx-uat.conf /etc/nginx/nginx.conf

ADD ./config/php.ini /usr/local/etc/php/php-fpm.ini

#ADD ./config/laravel-cron /etc/cron.d/laravel-cron

#RUN chmod 0644 /etc/cron.d/laravel-cron 

RUN echo "* * * * * /usr/local/bin/php /var/www/union-mobile/artisan schedule:run >> /var/log/laravel/batch.log 2>&1" | crontab -

RUN mkdir -p /etc/nginx/ssl

COPY ./config/fuelmylife-chain.crt /etc/nginx/ssl

COPY ./config/fuelmylife.key /etc/nginx/ssl

RUN rm /etc/nginx/sites-available/default

#
#--------------------------------------------------------------------------
# Mobile Application
#--------------------------------------------------------------------------
#
RUN mkdir -p /var/www/union-mobile

WORKDIR /var/www/union-mobile

COPY ./union-mobile/source /tmp/www/union-mobile

COPY ./config/config-secret/.env.uat /tmp/www/union-mobile/.env

COPY ./config/config-secret/union-energy-uat.json /tmp/www/union-mobile/config/union-energy-uat.json

COPY ./union-mobile/source/public/js/script-uat.js /tmp/www/union-mobile/public/js/script.js

RUN cp -r /tmp/www/union-mobile /var/www && chown -R www-data:www-data -R . && rm -rf /tmp/www/union-mobile

USER www-data

RUN composer install

RUN chown -R www-data:www-data -R .

#
#--------------------------------------------------------------------------
# Init
#--------------------------------------------------------------------------
#

EXPOSE 443

USER root

CMD /usr/bin/supervisord -c /etc/supervisord.conf

