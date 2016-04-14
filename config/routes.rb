Rails.application.routes.draw do
  devise_for :users

  resources :static_pages, only: [:index]
  resources :recipes
  
  root to: "static_pages#index"
end
