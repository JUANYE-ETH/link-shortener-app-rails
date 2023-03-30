Rails.application.routes.draw do
  root to: "static#shorten"

  resources :shortened_urls, only: [:create], param: :unique_code
  get "/:unique_code", to: "shortened_urls#show", as: :short_url
end
