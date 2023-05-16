FROM php:8.1-apache

RUN docker-php-ext-install pdo_mysql
RUN a2enmod rewrite

WORKDIR /var/www/html

COPY ./newsbackend/composer.json .
COPY ./newsbackend/composer.lock .
COPY ./newsbackend/.env .env

RUN apt-get update && apt-get install -y unzip
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-scripts --no-autoloader

COPY ./newsbackend .

RUN composer dump-autoload
RUN chown -R www-data:www-data storage

RUN php artisan key:generate
RUN php artisan jwt:secret --force

RUN php artisan migrate --force

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0
