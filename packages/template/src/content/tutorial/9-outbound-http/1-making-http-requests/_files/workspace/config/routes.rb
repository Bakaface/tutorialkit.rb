Rails.application.routes.draw do
  root "http_demo#index"

  post "http_demo/fetch_get"
  post "http_demo/fetch_post"

  get "up" => "rails/health#show", as: :rails_health_check
end
