Rails.application.routes.draw do
  devise_for :admins
  mount Avo::Engine => Avo.configuration.root_path

  namespace :api do
    namespace :v1 do
      resources :posts, only: [:index, :show]
    end
  end
end
