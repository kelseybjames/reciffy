source 'https://rubygems.org'

gem 'rails', '4.2.6'
gem 'pg', '~> 0.15'
gem 'sass-rails', '~> 5.0'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'jquery-rails'
gem 'jbuilder', '~> 2.0'
gem 'sdoc', '~> 0.4.0', group: :doc
gem 'devise'
gem 'faker'
gem 'figaro'
gem 'paperclip', :git=> 'https://github.com/thoughtbot/paperclip', :ref => '523bd46c768226893f23889079a7aa9c73b57d68'
gem 'aws-sdk'
gem 'bcrypt', '~> 3.1.7'
gem 'bootstrap-sass', '~> 3.2.0'
gem 'autoprefixer-rails'
gem 'angularjs-rails'
gem 'angular_rails_csrf'
gem 'angular-ui-bootstrap-rails'
gem 'sprockets'
gem 'font-awesome-sass'
gem 'httparty'

group :development, :test do
  gem 'jazz_hands', github: 'nixme/jazz_hands', branch: 'bring-your-own-debugger'
  gem 'pry-byebug'
  gem 'hirb'
  gem 'rspec-rails'
  gem 'guard-rspec'
  gem 'factory_girl_rails'
  gem 'database_cleaner'
  gem 'capybara'
  gem 'launchy'
  gem 'selenium-webdriver'
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'railroady'
end

group :development do
  gem 'web-console', '~> 2.0'
  gem 'spring'
end

group :production do
  ruby '2.3.0'
end

gem 'rails_12factor', group: [:staging, :production]

source "https://rails-assets.org" do
  gem "rails-assets-angular-devise"
  gem "rails-assets-angucomplete-alt"
  gem "rails-assets-owlcar"
end
